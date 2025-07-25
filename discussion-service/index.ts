import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import mysql from 'mysql2/promise';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { body, param, query, validationResult } from 'express-validator';

export const app = express();
const port = process.env.DISCUSSION_SERVICE_PORT || 3011;
app.use(express.json());

// MySQL connection pool
export const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'mysql',
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: Number(process.env.MYSQL_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
});

// Validation error handler middleware
const handleValidationErrors = (req: Request, res: Response, next: Function) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Discussion/Q&A Service API',
      version: '1.0.0',
    },
  },
  apis: ['./index.ts'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     responses:
 *       200:
 *         description: OK
 */
app.get('/health', (req: Request, res: Response) =>
  res.json({ status: 'ok', service: 'discussion-service' })
);

/**
 * @swagger
 * /discussions:
 *   post:
 *     summary: Post a discussion question
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [course_id, question]
 *             properties:
 *               course_id: { type: integer }
 *               question: { type: string }
 *     responses:
 *       201:
 *         description: Question posted
 *       400:
 *         description: Validation error
 */
app.post(
  '/discussions',
  body('course_id').isInt(),
  body('question').isString().notEmpty(),
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const { course_id, question } = req.body;
    const user_id = req.body.user_id || 1; // TODO: Replace with real user auth
    try {
      const [result]: any = await pool.query(
        'INSERT INTO discussions (course_id, user_id, question, created_at) VALUES (?, ?, ?, NOW())',
        [course_id, user_id, question]
      );
      res.status(201).json({ id: result.insertId });
    } catch (err) {
      res.status(500).json({ error: 'Failed to post question', details: err });
    }
  }
);

/**
 * @swagger
 * /discussions/{id}/reply:
 *   post:
 *     summary: Reply to a discussion question
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [reply]
 *             properties:
 *               reply: { type: string }
 *     responses:
 *       201:
 *         description: Reply posted
 *       400:
 *         description: Validation error
 *       404:
 *         description: Discussion not found
 */
app.post(
  '/discussions/:id/reply',
  param('id').isInt(),
  body('reply').isString().notEmpty(),
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const discussion_id = Number(req.params.id);
    const { reply } = req.body;
    const user_id = req.body.user_id || 1; // TODO: Replace with real user auth
    try {
      // Check if discussion exists
      const [discussions]: any = await pool.query('SELECT * FROM discussions WHERE id = ?', [discussion_id]);
      if (discussions.length === 0) return res.status(404).json({ error: 'Discussion not found' });
      
      const [result]: any = await pool.query(
        'INSERT INTO discussion_replies (discussion_id, user_id, reply, created_at) VALUES (?, ?, ?, NOW())',
        [discussion_id, user_id, reply]
      );
      res.status(201).json({ id: result.insertId });
    } catch (err) {
      res.status(500).json({ error: 'Failed to post reply', details: err });
    }
  }
);

/**
 * @swagger
 * /feedback:
 *   post:
 *     summary: Post feedback for a course
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [course_id, rating]
 *             properties:
 *               course_id: { type: integer }
 *               rating: { type: integer, minimum: 1, maximum: 5 }
 *               comment: { type: string }
 *     responses:
 *       201:
 *         description: Feedback posted
 *       400:
 *         description: Validation error
 */
app.post(
  '/feedback',
  body('course_id').isInt(),
  body('rating').isInt({ min: 1, max: 5 }),
  body('comment').optional().isString(),
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const { course_id, rating, comment } = req.body;
    const user_id = req.body.user_id || 1; // TODO: Replace with real user auth
    try {
      const [result]: any = await pool.query(
        'INSERT INTO feedback (course_id, user_id, rating, comment, created_at) VALUES (?, ?, ?, ?, NOW())',
        [course_id, user_id, rating, comment || null]
      );
      res.status(201).json({ id: result.insertId });
    } catch (err) {
      res.status(500).json({ error: 'Failed to post feedback', details: err });
    }
  }
);

/**
 * @swagger
 * /discussions:
 *   get:
 *     summary: List discussions for a course
 *     parameters:
 *       - in: query
 *         name: course_id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: List of discussions
 *       400:
 *         description: Validation error
 */
app.get(
  '/discussions',
  query('course_id').isInt(),
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const course_id = Number(req.query.course_id);
    try {
      const [discussions]: any = await pool.query(
        'SELECT d.*, COUNT(dr.id) as reply_count FROM discussions d ' +
        'LEFT JOIN discussion_replies dr ON d.id = dr.discussion_id ' +
        'WHERE d.course_id = ? ' +
        'GROUP BY d.id ' +
        'ORDER BY d.created_at DESC',
        [course_id]
      );
      res.json(discussions);
    } catch (err) {
      res.status(500).json({ error: 'Failed to get discussions', details: err });
    }
  }
);

/**
 * @swagger
 * /discussions/{id}:
 *   get:
 *     summary: Get a discussion with replies
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Discussion with replies
 *       404:
 *         description: Discussion not found
 */
app.get(
  '/discussions/:id',
  param('id').isInt(),
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const discussion_id = Number(req.params.id);
    try {
      const [discussions]: any = await pool.query('SELECT * FROM discussions WHERE id = ?', [discussion_id]);
      if (discussions.length === 0) return res.status(404).json({ error: 'Discussion not found' });
      
      const discussion = discussions[0];
      const [replies]: any = await pool.query(
        'SELECT * FROM discussion_replies WHERE discussion_id = ? ORDER BY created_at',
        [discussion_id]
      );
      discussion.replies = replies;
      res.json(discussion);
    } catch (err) {
      res.status(500).json({ error: 'Failed to get discussion', details: err });
    }
  }
);

/**
 * @swagger
 * /feedback:
 *   get:
 *     summary: Get feedback for a course
 *     parameters:
 *       - in: query
 *         name: course_id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: List of feedback
 *       400:
 *         description: Validation error
 */
app.get(
  '/feedback',
  query('course_id').isInt(),
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const course_id = Number(req.query.course_id);
    try {
      const [feedback]: any = await pool.query(
        'SELECT * FROM feedback WHERE course_id = ? ORDER BY created_at DESC',
        [course_id]
      );
      
      // Calculate average rating
      const [avgRating]: any = await pool.query(
        'SELECT AVG(rating) as average_rating FROM feedback WHERE course_id = ?',
        [course_id]
      );
      
      res.json({
        feedback,
        average_rating: avgRating[0].average_rating || 0,
        count: feedback.length
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to get feedback', details: err });
    }
  }
);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Discussion service listening on port ${port}`);
  });
}