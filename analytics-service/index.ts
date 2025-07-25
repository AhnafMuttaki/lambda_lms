import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import mysql from 'mysql2/promise';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { param, query, validationResult } from 'express-validator';

export const app = express();
const port = process.env.ANALYTICS_SERVICE_PORT || 3009;
app.use(express.json());

export const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'mysql',
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: Number(process.env.MYSQL_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
});

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'Analytics & Reporting Service API', version: '1.0.0' },
  },
  apis: ['./index.ts'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

function handleValidationErrors(req: Request, res: Response, next: any) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
}

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     responses:
 *       200:
 *         description: OK
 */
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'analytics-service' }));

/**
 * @swagger
 * /analytics/dashboard:
 *   get:
 *     summary: Get analytics dashboard data
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         required: false
 *     responses:
 *       200:
 *         description: Dashboard data
 */
app.get(
  '/analytics/dashboard',
  query('role').optional().isString(),
  handleValidationErrors,
  async (req: Request, res: Response) => {
    // Simulate dashboard data by role
    const role = req.query.role || 'admin';
    try {
      // Example: count events by type
      const [rows]: any = await pool.query(
        'SELECT event_type, COUNT(*) as count FROM analytics_events GROUP BY event_type'
      );
      res.json({ role, events: rows });
    } catch (err) {
      res.status(500).json({ error: 'Failed to get dashboard data', details: err });
    }
  }
);

/**
 * @swagger
 * /analytics/course/{id}:
 *   get:
 *     summary: Get analytics for a course
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Course analytics
 */
app.get(
  '/analytics/course/:id',
  param('id').isInt(),
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const course_id = Number(req.params.id);
    try {
      const [rows]: any = await pool.query(
        'SELECT * FROM analytics_events WHERE entity_id = ? AND event_type = ? ORDER BY timestamp DESC',
        [course_id, 'course']
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: 'Failed to get course analytics', details: err });
    }
  }
);

/**
 * @swagger
 * /analytics/user/{id}:
 *   get:
 *     summary: Get analytics for a user
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: User analytics
 */
app.get(
  '/analytics/user/:id',
  param('id').isInt(),
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const user_id = Number(req.params.id);
    try {
      const [rows]: any = await pool.query(
        'SELECT * FROM analytics_events WHERE user_id = ? ORDER BY timestamp DESC',
        [user_id]
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: 'Failed to get user analytics', details: err });
    }
  }
);

/**
 * @swagger
 * /analytics/report:
 *   get:
 *     summary: Export/download analytics report
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Downloadable report
 */
app.get(
  '/analytics/report',
  query('type').isString(),
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const type = req.query.type as string;
    try {
      const [rows]: any = await pool.query(
        'SELECT * FROM reports WHERE type = ? ORDER BY generated_at DESC LIMIT 1',
        [type]
      );
      if (rows.length === 0) return res.status(404).json({ error: 'Report not found' });
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Failed to get report', details: err });
    }
  }
);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Analytics service listening on port ${port}`);
  });
} 