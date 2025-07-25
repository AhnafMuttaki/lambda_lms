import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import mysql from 'mysql2/promise';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { body, param, validationResult } from 'express-validator';

export const app = express();
const port = process.env.ADMIN_SERVICE_PORT || 3010;
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
    info: { title: 'Admin/Moderation Service API', version: '1.0.0' },
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
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'admin-service' }));

/**
 * @swagger
 * /moderation/courses/{id}/approve:
 *   post:
 *     summary: Approve a course
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: Course approved
 *       400:
 *         description: Validation error
 */
app.post(
  '/moderation/courses/:id/approve',
  param('id').isInt(),
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const course_id = Number(req.params.id);
    const admin_id = req.body.admin_id || 1; // TODO: Replace with real admin auth
    try {
      // Update course status (simulate)
      // Log moderation action
      await pool.query(
        'INSERT INTO moderation_logs (entity_type, entity_id, action, admin_id, notes) VALUES (?, ?, ?, ?, ?)',
        ['course', course_id, 'approve', admin_id, req.body.notes || null]
      );
      res.json({ message: 'Course approved' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to approve course', details: err });
    }
  }
);

/**
 * @swagger
 * /moderation/courses/{id}/reject:
 *   post:
 *     summary: Reject a course
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: Course rejected
 *       400:
 *         description: Validation error
 */
app.post(
  '/moderation/courses/:id/reject',
  param('id').isInt(),
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const course_id = Number(req.params.id);
    const admin_id = req.body.admin_id || 1;
    try {
      await pool.query(
        'INSERT INTO moderation_logs (entity_type, entity_id, action, admin_id, notes) VALUES (?, ?, ?, ?, ?)',
        ['course', course_id, 'reject', admin_id, req.body.notes || null]
      );
      res.json({ message: 'Course rejected' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to reject course', details: err });
    }
  }
);

/**
 * @swagger
 * /moderation/content/{id}/approve:
 *   post:
 *     summary: Approve content
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: Content approved
 *       400:
 *         description: Validation error
 */
app.post(
  '/moderation/content/:id/approve',
  param('id').isInt(),
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const content_id = Number(req.params.id);
    const admin_id = req.body.admin_id || 1;
    try {
      await pool.query(
        'INSERT INTO moderation_logs (entity_type, entity_id, action, admin_id, notes) VALUES (?, ?, ?, ?, ?)',
        ['content', content_id, 'approve', admin_id, req.body.notes || null]
      );
      res.json({ message: 'Content approved' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to approve content', details: err });
    }
  }
);

/**
 * @swagger
 * /moderation/logs:
 *   get:
 *     summary: View moderation logs
 *     responses:
 *       200:
 *         description: List of moderation logs
 */
app.get(
  '/moderation/logs',
  async (req: Request, res: Response) => {
    try {
      const [logs]: any = await pool.query('SELECT * FROM moderation_logs ORDER BY timestamp DESC');
      res.json(logs);
    } catch (err) {
      res.status(500).json({ error: 'Failed to get moderation logs', details: err });
    }
  }
);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Admin service listening on port ${port}`);
  });
} 