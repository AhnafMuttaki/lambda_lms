import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import mysql from 'mysql2/promise';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const app = express();
const port = process.env.CONTENT_SERVICE_PORT || 3003;
const storagePath = process.env.CONTENT_STORAGE_PATH || '/data/content';

app.use(express.json());

// Ensure storage directory exists
if (!fs.existsSync(storagePath)) {
  fs.mkdirSync(storagePath, { recursive: true });
}

// Multer setup for local storage
const upload = multer({
  dest: storagePath,
  limits: { fileSize: 1024 * 1024 * 500 }, // 500MB max
});

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
      title: 'Content Service API',
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
  res.json({ status: 'ok', service: 'content-service' })
);

/**
 * @swagger
 * /content/upload:
 *   post:
 *     summary: Upload content (video, PDF, interactive)
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file, type, course_id]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               type:
 *                 type: string
 *                 enum: [video, pdf, interactive]
 *               course_id:
 *                 type: integer
 *               module_id:
 *                 type: integer
 *               section_id:
 *                 type: integer
 *               order:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Content uploaded
 *       400:
 *         description: Validation error
 */
app.post('/content/upload', upload.single('file'), async (req: Request, res: Response) => {
  const { type, course_id, module_id, section_id, order } = req.body;
  if (
    !req.file ||
    !type ||
    !['video', 'pdf', 'interactive'].includes(type) ||
    !course_id
  ) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(400).json({ error: 'Invalid input' });
  }
  try {
    const fileUrl = `/files/${req.file.filename}`;
    const [result]: any = await pool.query(
      'INSERT INTO contents (course_id, module_id, section_id, type, url, metadata, `order`, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
      [
        Number(course_id),
        module_id ? Number(module_id) : null,
        section_id ? Number(section_id) : null,
        type,
        fileUrl,
        JSON.stringify({ originalname: req.file.originalname, mimetype: req.file.mimetype }),
        order ? Number(order) : 0,
      ]
    );
    res.status(201).json({ id: result.insertId, url: fileUrl });
  } catch (err) {
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @swagger
 * /content/{id}:
 *   get:
 *     summary: Get content metadata and download URL
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: integer }
 *         required: true
 *     responses:
 *       200:
 *         description: Content metadata
 *       404:
 *         description: Not found
 */
app.get('/content/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: 'Invalid id' });
  try {
    const [rows]: any[] = await pool.query('SELECT * FROM contents WHERE id = ?', [id]);
    if ((rows as any[])[0].length === 0) return res.status(404).json({ error: 'Not found' });
    const content = (rows as any[])[0][0];
    res.json({
      ...content,
      download_url: content.url,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @swagger
 * /content/{id}:
 *   delete:
 *     summary: Delete content (metadata and file)
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
app.delete('/content/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: 'Invalid id' });
  try {
    const [rows]: any[] = await pool.query('SELECT * FROM contents WHERE id = ?', [id]);
    if ((rows as any[])[0].length === 0) return res.status(404).json({ error: 'Not found' });
    const content = (rows as any[])[0][0];
    // Remove file
    const filePath = path.join(storagePath, path.basename(content.url));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    await pool.query('DELETE FROM contents WHERE id = ?', [id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Serve uploaded files
app.use('/files', express.static(storagePath));

app.listen(port, () => {
  console.log(`Content Service running on port ${port}`);
});

export { app };
