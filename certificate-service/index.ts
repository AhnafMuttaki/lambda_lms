import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import mysql from 'mysql2/promise';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { body, param, query, validationResult } from 'express-validator';

export const app = express();
const port = process.env.CERTIFICATE_SERVICE_PORT || 3006;
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
    info: { title: 'Certificate Service API', version: '1.0.0' },
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
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'certificate-service' }));

/**
 * @swagger
 * /certificates/generate:
 *   post:
 *     summary: Generate a certificate for a user and course
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [user_id, course_id, url]
 *             properties:
 *               user_id: { type: integer }
 *               course_id: { type: integer }
 *               url: { type: string }
 *     responses:
 *       201:
 *         description: Certificate generated
 *       400:
 *         description: Validation error
 */
app.post(
  '/certificates/generate',
  body('user_id').isInt(),
  body('course_id').isInt(),
  body('url').isString().notEmpty(),
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const { user_id, course_id, url } = req.body;
    try {
      const [result]: any = await pool.query(
        'INSERT INTO certificates (user_id, course_id, url) VALUES (?, ?, ?)',
        [user_id, course_id, url]
      );
      res.status(201).json({ id: result.insertId, user_id, course_id, url });
    } catch (err) {
      res.status(500).json({ error: 'Failed to generate certificate', details: err });
    }
  }
);

/**
 * @swagger
 * /certificates/{user_id}/{course_id}:
 *   get:
 *     summary: Get/download a certificate for a user and course
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: integer
 *         required: true
 *       - in: path
 *         name: course_id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Certificate found
 *       404:
 *         description: Not found
 */
app.get(
  '/certificates/:user_id/:course_id',
  param('user_id').isInt(),
  param('course_id').isInt(),
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const user_id = Number(req.params.user_id);
    const course_id = Number(req.params.course_id);
    try {
      const [rows]: any = await pool.query(
        'SELECT * FROM certificates WHERE user_id = ? AND course_id = ?',
        [user_id, course_id]
      );
      if (rows.length === 0) return res.status(404).json({ error: 'Certificate not found' });
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Failed to get certificate', details: err });
    }
  }
);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Certificate service listening on port ${port}`);
  });
} 