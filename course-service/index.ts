import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import mysql from 'mysql2/promise';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const app = express();
const port = process.env.COURSE_SERVICE_PORT || 3002;

app.use(express.json());

// MySQL connection pool
const pool = mysql.createPool({
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
      title: 'Course Service API',
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
  res.json({ status: 'ok', service: 'course-service' })
);

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Create a new course (draft)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, teacher_id]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               teacher_id: { type: integer }
 *     responses:
 *       201:
 *         description: Course created
 *       400:
 *         description: Validation error
 */
app.post('/courses', async (req: Request, res: Response) => {
  const { title, description, teacher_id } = req.body;
  if (
    !title ||
    typeof title !== 'string' ||
    title.length > 255 ||
    !teacher_id ||
    typeof teacher_id !== 'number'
  ) {
    return res.status(400).json({ error: 'Invalid input' });
  }
  try {
    const [result]: any = await pool.query(
      'INSERT INTO courses (title, description, status, teacher_id) VALUES (?, ?, ?, ?)',
      [title, description || '', 'draft', teacher_id]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @swagger
 * /courses/{id}:
 *   put:
 *     summary: Edit a course
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: integer }
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Not found
 */
app.put('/courses/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { title, description } = req.body;
  if (!id) return res.status(400).json({ error: 'Invalid id' });
  try {
    const [rows]: any[] = await pool.query('SELECT * FROM courses WHERE id = ?', [id]);
    if ((rows as any[])[0].length === 0) return res.status(404).json({ error: 'Not found' });
    await pool.query(
      'UPDATE courses SET title = ?, description = ? WHERE id = ?',
      [title, description, id]
    );
    res.json({ message: 'Updated' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @swagger
 * /courses/{id}:
 *   delete:
 *     summary: Delete a course
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: integer }
 *         required: true
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Not found
 */
app.delete('/courses/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: 'Invalid id' });
  try {
    const [rows]: any[] = await pool.query('SELECT * FROM courses WHERE id = ?', [id]);
    if ((rows as any[])[0].length === 0) return res.status(404).json({ error: 'Not found' });
    await pool.query('DELETE FROM courses WHERE id = ?', [id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: List/browse courses
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *       - in: query
 *         name: teacher_id
 *         schema: { type: integer }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: List of courses
 */
app.get('/courses', async (req: Request, res: Response) => {
  const { status, teacher_id, search, page = 1, limit = 20 } = req.query;
  let sql = 'SELECT * FROM courses WHERE 1=1';
  const params: any[] = [];
  if (status) {
    sql += ' AND status = ?';
    params.push(status);
  }
  if (teacher_id) {
    sql += ' AND teacher_id = ?';
    params.push(Number(teacher_id));
  }
  if (search) {
    sql += ' AND title LIKE ?';
    params.push(`%${search}%`);
  }
  sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(Number(limit), (Number(page) - 1) * Number(limit));
  try {
    const [rows]: any[] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @swagger
 * /courses/{id}/submit-for-approval:
 *   post:
 *     summary: Submit course for approval
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: integer }
 *         required: true
 *     responses:
 *       200:
 *         description: Submitted
 *       404:
 *         description: Not found
 */
app.post('/courses/:id/submit-for-approval', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: 'Invalid id' });
  try {
    const [rows]: any[] = await pool.query('SELECT * FROM courses WHERE id = ?', [id]);
    if ((rows as any[])[0].length === 0) return res.status(404).json({ error: 'Not found' });
    await pool.query('UPDATE courses SET status = ? WHERE id = ?', ['pending', id]);
    res.json({ message: 'Submitted for approval' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @swagger
 * /courses/{id}/approve:
 *   post:
 *     summary: Approve a course (admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: integer }
 *         required: true
 *     responses:
 *       200:
 *         description: Approved
 *       404:
 *         description: Not found
 */
app.post('/courses/:id/approve', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: 'Invalid id' });
  try {
    const [rows]: any[] = await pool.query('SELECT * FROM courses WHERE id = ?', [id]);
    if ((rows as any[])[0].length === 0) return res.status(404).json({ error: 'Not found' });
    await pool.query('UPDATE courses SET status = ? WHERE id = ?', ['published', id]);
    res.json({ message: 'Approved' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @swagger
 * /courses/{id}/reject:
 *   post:
 *     summary: Reject a course (admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: integer }
 *         required: true
 *     responses:
 *       200:
 *         description: Rejected
 *       404:
 *         description: Not found
 */
app.post('/courses/:id/reject', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: 'Invalid id' });
  try {
    const [rows]: any[] = await pool.query('SELECT * FROM courses WHERE id = ?', [id]);
    if ((rows as any[])[0].length === 0) return res.status(404).json({ error: 'Not found' });
    await pool.query('UPDATE courses SET status = ? WHERE id = ?', ['rejected', id]);
    res.json({ message: 'Rejected' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Module/Section CRUD ---

/**
 * @swagger
 * /courses/{course_id}/modules:
 *   post:
 *     summary: Create a module under a course
 *     parameters:
 *       - in: path
 *         name: course_id
 *         schema: { type: integer }
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title: { type: string }
 *               order: { type: integer }
 *     responses:
 *       201:
 *         description: Module created
 *       404:
 *         description: Not found
 */
app.post('/courses/:course_id/modules', async (req: Request, res: Response) => {
  const course_id = Number(req.params.course_id);
  const { title, order } = req.body;
  if (!course_id || !title || typeof title !== 'string') {
    return res.status(400).json({ error: 'Invalid input' });
  }
  try {
    const [rows]: any[] = await pool.query('SELECT * FROM courses WHERE id = ?', [course_id]);
    if ((rows as any[])[0].length === 0) return res.status(404).json({ error: 'Course not found' });
    const [result]: any = await pool.query(
      'INSERT INTO course_modules (course_id, title, `order`) VALUES (?, ?, ?)',
      [course_id, title, order || 0]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @swagger
 * /modules/{id}:
 *   put:
 *     summary: Edit a module
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: integer }
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               order: { type: integer }
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Not found
 */
app.put('/modules/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { title, order } = req.body;
  if (!id) return res.status(400).json({ error: 'Invalid id' });
  try {
    const [rows]: any[] = await pool.query('SELECT * FROM course_modules WHERE id = ?', [id]);
    if ((rows as any[])[0].length === 0) return res.status(404).json({ error: 'Not found' });
    await pool.query('UPDATE course_modules SET title = ?, `order` = ? WHERE id = ?', [title, order, id]);
    res.json({ message: 'Updated' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @swagger
 * /modules/{id}:
 *   delete:
 *     summary: Delete a module
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: integer }
 *         required: true
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Not found
 */
app.delete('/modules/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: 'Invalid id' });
  try {
    const [rows]: any[] = await pool.query('SELECT * FROM course_modules WHERE id = ?', [id]);
    if ((rows as any[])[0].length === 0) return res.status(404).json({ error: 'Not found' });
    await pool.query('DELETE FROM course_modules WHERE id = ?', [id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @swagger
 * /modules/{module_id}/sections:
 *   post:
 *     summary: Create a section under a module
 *     parameters:
 *       - in: path
 *         name: module_id
 *         schema: { type: integer }
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title: { type: string }
 *               order: { type: integer }
 *     responses:
 *       201:
 *         description: Section created
 *       404:
 *         description: Not found
 */
app.post('/modules/:module_id/sections', async (req: Request, res: Response) => {
  const module_id = Number(req.params.module_id);
  const { title, order } = req.body;
  if (!module_id || !title || typeof title !== 'string') {
    return res.status(400).json({ error: 'Invalid input' });
  }
  try {
    const [rows]: any[] = await pool.query('SELECT * FROM course_modules WHERE id = ?', [module_id]);
    if ((rows as any[])[0].length === 0) return res.status(404).json({ error: 'Module not found' });
    const [result]: any = await pool.query(
      'INSERT INTO course_sections (module_id, title, `order`) VALUES (?, ?, ?)',
      [module_id, title, order || 0]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @swagger
 * /sections/{id}:
 *   put:
 *     summary: Edit a section
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: integer }
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               order: { type: integer }
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Not found
 */
app.put('/sections/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { title, order } = req.body;
  if (!id) return res.status(400).json({ error: 'Invalid id' });
  try {
    const [rows]: any[] = await pool.query('SELECT * FROM course_sections WHERE id = ?', [id]);
    if ((rows as any[])[0].length === 0) return res.status(404).json({ error: 'Not found' });
    await pool.query('UPDATE course_sections SET title = ?, `order` = ? WHERE id = ?', [title, order, id]);
    res.json({ message: 'Updated' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @swagger
 * /sections/{id}:
 *   delete:
 *     summary: Delete a section
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: integer }
 *         required: true
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Not found
 */
app.delete('/sections/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: 'Invalid id' });
  try {
    const [rows]: any[] = await pool.query('SELECT * FROM course_sections WHERE id = ?', [id]);
    if ((rows as any[])[0].length === 0) return res.status(404).json({ error: 'Not found' });
    await pool.query('DELETE FROM course_sections WHERE id = ?', [id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(port, () => {
  console.log(`Course Service running on port ${port}`);
});

export { app };
