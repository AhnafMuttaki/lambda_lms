import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const app = express();
// Enable CORS for all origins (customize as needed)
app.use(cors());
const port = process.env.USER_SERVICE_PORT || 3001;
const jwtSecret = process.env.JWT_SECRET || 'changeme';

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
      title: 'User Service API',
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
  res.json({ status: 'ok', service: 'user-service' })
);

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, role]
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               role: { type: string, enum: [student, teacher, admin, super_admin] }
 *     responses:
 *       201:
 *         description: User registered
 *       400:
 *         description: Validation error
 */
app.post('/users/register', async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  if (
    !name ||
    typeof name !== 'string' ||
    name.length > 255 ||
    !email ||
    typeof email !== 'string' ||
    !/^[^@]+@[^@]+\.[^@]+$/.test(email) ||
    !password ||
    typeof password !== 'string' ||
    password.length < 8 ||
    !role ||
    !['student', 'teacher', 'admin', 'super_admin'].includes(role)
  ) {
    return res.status(400).json({ error: 'Invalid input' });
  }
  try {
    const [rows]: [any[], any] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    const password_hash = await bcrypt.hash(password, 10);
    const [result]: [any, any] = await pool.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, email, password_hash, role]
    );
    const userId = result.insertId;
    await pool.query('INSERT INTO user_profiles (user_id) VALUES (?)', [userId]);
    const token = jwt.sign({ id: userId, email, role }, jwtSecret, { expiresIn: '1d' });
    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: User login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: JWT token
 *       401:
 *         description: Invalid credentials
 */
app.post('/users/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (
    !email ||
    typeof email !== 'string' ||
    !password ||
    typeof password !== 'string'
  ) {
    return res.status(400).json({ error: 'Invalid input' });
  }
  try {
    const [rows]: [any[], any] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const user = rows[0];
    if (!(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, jwtSecret, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user profile
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: integer }
 *         required: true
 *     responses:
 *       200:
 *         description: User profile
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 */
app.get('/users/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: 'Invalid id' });
  try {
    const [rows]: [any[], any] = await pool.query(
      `SELECT u.id, u.name, u.email, u.role, u.status, up.bio, up.avatar_url
       FROM users u LEFT JOIN user_profiles up ON u.id = up.user_id WHERE u.id = ?`,
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user profile
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
 *               name: { type: string }
 *               bio: { type: string }
 *               avatar_url: { type: string }
 *     responses:
 *       200:
 *         description: Updated
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 */
app.put('/users/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { name, bio, avatar_url } = req.body;
  if (!id) return res.status(400).json({ error: 'Invalid id' });
  try {
    const [rows]: [any[], any] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    if (name) {
      await pool.query('UPDATE users SET name = ? WHERE id = ?', [name, id]);
    }
    if (bio || avatar_url) {
      await pool.query(
        'UPDATE user_profiles SET bio = ?, avatar_url = ? WHERE user_id = ?',
        [bio || null, avatar_url || null, id]
      );
    }
    res.json({ message: 'Updated' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @swagger
 * /users/reset-password:
 *   post:
 *     summary: Password reset (mock, no email)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, new_password]
 *             properties:
 *               email: { type: string }
 *               new_password: { type: string }
 *     responses:
 *       200:
 *         description: Password reset
 *       404:
 *         description: Not found
 */
app.post('/users/reset-password', async (req: Request, res: Response) => {
  const { email, new_password } = req.body;
  if (
    !email ||
    typeof email !== 'string' ||
    !new_password ||
    typeof new_password !== 'string' ||
    new_password.length < 8
  ) {
    return res.status(400).json({ error: 'Invalid input' });
  }
  try {
    const [rows]: [any[], any] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    const password_hash = await bcrypt.hash(new_password, 10);
    await pool.query('UPDATE users SET password_hash = ? WHERE email = ?', [password_hash, email]);
    res.json({ message: 'Password reset' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @swagger
 * /users/{id}/role:
 *   patch:
 *     summary: Assign/change user role
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
 *             required: [role]
 *             properties:
 *               role: { type: string, enum: [student, teacher, admin, super_admin] }
 *     responses:
 *       200:
 *         description: Role updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Not found
 */
app.patch('/users/:id/role', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { role } = req.body;
  if (!id || !role || !['student', 'teacher', 'admin', 'super_admin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid input' });
  }
  try {
    const [rows]: [any[], any] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
    res.json({ message: 'Role updated' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(port, () => {
  console.log(`User Service running on port ${port}`);
});

export { app };
