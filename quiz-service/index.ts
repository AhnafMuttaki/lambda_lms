import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import mysql from 'mysql2/promise';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { body, param, query, validationResult } from 'express-validator';

export const app = express();
const port = process.env.QUIZ_SERVICE_PORT || 3004;

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

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Quiz Service API',
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
  res.json({ status: 'ok', service: 'quiz-service' })
);

// Helper: error handler for validation
function handleValidationErrors(req: Request, res: Response, next: any) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

/**
 * @swagger
 * /quizzes:
 *   post:
 *     summary: Create a new quiz
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [course_id, module_id, title, type]
 *             properties:
 *               course_id: { type: integer }
 *               module_id: { type: integer }
 *               title: { type: string }
 *               type: { type: string, enum: [mcq, short, tf] }
 *     responses:
 *       201:
 *         description: Quiz created
 *       400:
 *         description: Validation error
 */
app.post(
  '/quizzes',
  body('course_id').isInt(),
  body('module_id').optional().isInt(),
  body('title').isString().notEmpty(),
  body('type').isIn(['mcq', 'short', 'tf']),
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const { course_id, module_id, title, type } = req.body;
    try {
      const [result]: any = await pool.query(
        'INSERT INTO quizzes (course_id, module_id, title, type) VALUES (?, ?, ?, ?)',
        [course_id, module_id || null, title, type]
      );
      res.status(201).json({ id: result.insertId, course_id, module_id, title, type });
    } catch (err) {
      res.status(500).json({ error: 'Failed to create quiz', details: err });
    }
  }
);

/**
 * @swagger
 * /quizzes/{id}/questions:
 *   post:
 *     summary: Add a question to a quiz
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Quiz ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [question_text, type]
 *             properties:
 *               question_text: { type: string }
 *               type: { type: string, enum: [mcq, short, tf] }
 *               options: { type: array, items: { type: string } }
 *               answer: { type: string }
 *     responses:
 *       201:
 *         description: Question added
 *       400:
 *         description: Validation error
 */
app.post(
  '/quizzes/:id/questions',
  param('id').isInt(),
  body('question_text').isString().notEmpty(),
  body('type').isIn(['mcq', 'short', 'tf']),
  body('options').optional().isArray(),
  body('answer').optional().isString(),
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const quiz_id = Number(req.params.id);
    const { question_text, type, options, answer } = req.body;
    try {
      const [quizRows]: any = await pool.query('SELECT * FROM quizzes WHERE id = ?', [quiz_id]);
      if (quizRows.length === 0) return res.status(404).json({ error: 'Quiz not found' });
      const [result]: any = await pool.query(
        'INSERT INTO quiz_questions (quiz_id, question_text, type, options, answer) VALUES (?, ?, ?, ?, ?)',
        [quiz_id, question_text, type, options ? JSON.stringify(options) : null, answer || null]
      );
      res.status(201).json({ id: result.insertId, quiz_id, question_text, type, options, answer });
    } catch (err) {
      res.status(500).json({ error: 'Failed to add question', details: err });
    }
  }
);

/**
 * @swagger
 * /quizzes:
 *   get:
 *     summary: List quizzes for a course/module
 *     parameters:
 *       - in: query
 *         name: course_id
 *         schema:
 *           type: integer
 *         required: false
 *       - in: query
 *         name: module_id
 *         schema:
 *           type: integer
 *         required: false
 *     responses:
 *       200:
 *         description: List of quizzes
 */
app.get(
  '/quizzes',
  query('course_id').optional().isInt(),
  query('module_id').optional().isInt(),
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const { course_id, module_id } = req.query;
    let sql = 'SELECT * FROM quizzes WHERE 1=1';
    const params: any[] = [];
    if (course_id) {
      sql += ' AND course_id = ?';
      params.push(Number(course_id));
    }
    if (module_id) {
      sql += ' AND module_id = ?';
      params.push(Number(module_id));
    }
    try {
      const [rows]: any = await pool.query(sql, params);
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: 'Failed to list quizzes', details: err });
    }
  }
);

/**
 * @swagger
 * /quizzes/{id}:
 *   get:
 *     summary: Get quiz details (with questions)
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Quiz details
 *       404:
 *         description: Quiz not found
 */
app.get(
  '/quizzes/:id',
  param('id').isInt(),
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const quiz_id = Number(req.params.id);
    try {
      const [quizRows]: any = await pool.query('SELECT * FROM quizzes WHERE id = ?', [quiz_id]);
      if (quizRows.length === 0) return res.status(404).json({ error: 'Quiz not found' });
      const quiz = quizRows[0];
      const [questions]: any = await pool.query('SELECT * FROM quiz_questions WHERE quiz_id = ?', [quiz_id]);
      quiz.questions = questions;
      res.json(quiz);
    } catch (err) {
      res.status(500).json({ error: 'Failed to get quiz', details: err });
    }
  }
);

/**
 * @swagger
 * /quizzes/{id}/attempt:
 *   post:
 *     summary: Attempt a quiz
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
 *             required: [answers]
 *             properties:
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [question_id, answer]
 *                   properties:
 *                     question_id: { type: integer }
 *                     answer: { type: string }
 *     responses:
 *       200:
 *         description: Attempt result
 *       400:
 *         description: Validation error
 */
app.post(
  '/quizzes/:id/attempt',
  param('id').isInt(),
  body('answers').isArray({ min: 1 }),
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const quiz_id = Number(req.params.id);
    const user_id = req.body.user_id || 1; // TODO: Replace with real user auth
    const { answers } = req.body;
    try {
      // Get quiz questions
      const [questions]: any = await pool.query('SELECT * FROM quiz_questions WHERE quiz_id = ?', [quiz_id]);
      if (questions.length === 0) return res.status(400).json({ error: 'No questions for this quiz' });
      // Grade answers
      let score = 0;
      let total = 0;
      const answerMap: any = {};
      for (const q of questions) answerMap[q.id] = q;
      const gradedAnswers = answers.map((a: any) => {
        const q = answerMap[a.question_id];
        if (!q) return { ...a, is_correct: null };
        let is_correct: boolean | null = null;
        if (q.type === 'mcq' || q.type === 'tf') {
          is_correct = a.answer === q.answer ? true : false;
          if (is_correct) score++;
          total++;
        }
        return { ...a, is_correct };
      });
      // Store attempt
      const [attemptResult]: any = await pool.query(
        'INSERT INTO quiz_attempts (quiz_id, user_id, score, started_at, completed_at) VALUES (?, ?, ?, NOW(), NOW())',
        [quiz_id, user_id, total ? score / total : null]
      );
      const attempt_id = attemptResult.insertId;
      for (const a of gradedAnswers) {
        await pool.query(
          'INSERT INTO quiz_answers (attempt_id, question_id, answer, is_correct) VALUES (?, ?, ?, ?)',
          [attempt_id, a.question_id, a.answer, a.is_correct]
        );
      }
      res.json({ attempt_id, score, total, gradedAnswers });
    } catch (err) {
      res.status(500).json({ error: 'Failed to attempt quiz', details: err });
    }
  }
);

/**
 * @swagger
 * /quizzes/{id}/results:
 *   get:
 *     summary: Get quiz results for a user
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         required: false
 *     responses:
 *       200:
 *         description: Quiz results
 *       404:
 *         description: Not found
 */
app.get(
  '/quizzes/:id/results',
  param('id').isInt(),
  query('user_id').optional().isInt(),
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const quiz_id = Number(req.params.id);
    const user_id = req.query.user_id ? Number(req.query.user_id) : null;
    try {
      let sql = 'SELECT * FROM quiz_attempts WHERE quiz_id = ?';
      const params: any[] = [quiz_id];
      if (user_id) {
        sql += ' AND user_id = ?';
        params.push(user_id);
      }
      const [attempts]: any = await pool.query(sql, params);
      for (const attempt of attempts) {
        const [answers]: any = await pool.query('SELECT * FROM quiz_answers WHERE attempt_id = ?', [attempt.id]);
        attempt.answers = answers;
      }
      res.json(attempts);
    } catch (err) {
      res.status(500).json({ error: 'Failed to get quiz results', details: err });
    }
  }
);

/**
 * @swagger
 * /quizzes/{id}/attempts:
 *   get:
 *     summary: List all attempts for a quiz (admin/teacher)
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: List of attempts
 *       404:
 *         description: Not found
 */
app.get(
  '/quizzes/:id/attempts',
  param('id').isInt(),
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const quiz_id = Number(req.params.id);
    try {
      const [attempts]: any = await pool.query('SELECT * FROM quiz_attempts WHERE quiz_id = ?', [quiz_id]);
      for (const attempt of attempts) {
        const [answers]: any = await pool.query('SELECT * FROM quiz_answers WHERE attempt_id = ?', [attempt.id]);
        attempt.answers = answers;
      }
      res.json(attempts);
    } catch (err) {
      res.status(500).json({ error: 'Failed to list attempts', details: err });
    }
  }
);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Quiz service listening on port ${port}`);
  });
} 