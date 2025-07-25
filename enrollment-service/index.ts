import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import mysql from 'mysql2/promise';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { body, param, validationResult } from 'express-validator';

// Create Express app
const app = express();
const port = process.env.ENROLLMENT_SERVICE_PORT || 3005;

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
      title: 'Enrollment Service API',
      version: '1.0.0',
      description: 'API for managing course enrollments and progress tracking',
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
  res.json({ status: 'ok', service: 'enrollment-service' })
);

/**
 * @swagger
 * /enrollments:
 *   post:
 *     summary: Enroll a user in a course
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [user_id, course_id]
 *             properties:
 *               user_id: 
 *                 type: integer
 *                 description: ID of the user enrolling in the course
 *               course_id: 
 *                 type: integer
 *                 description: ID of the course to enroll in
 *     responses:
 *       201:
 *         description: Enrollment created successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: User already enrolled in this course
 *       500:
 *         description: Server error
 */
app.post(
  '/enrollments',
  [
    body('user_id').isInt().withMessage('User ID must be an integer'),
    body('course_id').isInt().withMessage('Course ID must be an integer'),
  ],
  async (req: Request, res: Response) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { user_id, course_id } = req.body;

    try {
      // Check if course exists and is published
      const [courseRows]: any = await pool.query(
        'SELECT * FROM courses WHERE id = ? AND status = "published"',
        [course_id]
      );

      if (Array.isArray(courseRows) && courseRows.length === 0) {
        return res.status(404).json({ error: 'Course not found or not published' });
      }

      // Check if user is already enrolled
      const [enrollmentRows]: any = await pool.query(
        'SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?',
        [user_id, course_id]
      );

      if (Array.isArray(enrollmentRows) && enrollmentRows.length > 0) {
        return res.status(409).json({ error: 'User already enrolled in this course' });
      }

      // Create enrollment
      const [result]: any = await pool.query(
        'INSERT INTO enrollments (user_id, course_id, status, enrolled_at) VALUES (?, ?, ?, NOW())',
        [user_id, course_id, 'active']
      );

      res.status(201).json({
        id: result.insertId,
        user_id,
        course_id,
        status: 'active',
        enrolled_at: new Date(),
      });
    } catch (err) {
      console.error('Error creating enrollment:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

/**
 * @swagger
 * /enrollments/{user_id}:
 *   get:
 *     summary: Get all enrollments for a user
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, completed, cancelled]
 *         description: Filter enrollments by status
 *     responses:
 *       200:
 *         description: List of enrollments
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
app.get(
  '/enrollments/:user_id',
  [
    param('user_id').isInt().withMessage('User ID must be an integer'),
  ],
  async (req: Request, res: Response) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user_id = Number(req.params.user_id);
    const status = req.query.status as string | undefined;

    try {
      // Check if user exists
      const [userRows]: any = await pool.query(
        'SELECT * FROM users WHERE id = ?',
        [user_id]
      );

      if (Array.isArray(userRows) && userRows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Build query based on status filter
      let query = 'SELECT e.*, c.title as course_title FROM enrollments e ' +
                 'JOIN courses c ON e.course_id = c.id ' +
                 'WHERE e.user_id = ?';
      const params: any[] = [user_id];

      if (status) {
        query += ' AND e.status = ?';
        params.push(status);
      }

      query += ' ORDER BY e.enrolled_at DESC';

      // Get enrollments
      const [enrollments]: any = await pool.query(query, params);

      res.json(enrollments);
    } catch (err) {
      console.error('Error fetching enrollments:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

/**
 * @swagger
 * /enrollments/{id}/progress:
 *   patch:
 *     summary: Update progress for an enrollment
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the enrollment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [module_id, section_id, status]
 *             properties:
 *               module_id:
 *                 type: integer
 *                 description: ID of the module
 *               section_id:
 *                 type: integer
 *                 description: ID of the section
 *               status:
 *                 type: string
 *                 enum: [not_started, in_progress, completed]
 *                 description: Progress status
 *     responses:
 *       200:
 *         description: Progress updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Enrollment not found
 *       500:
 *         description: Server error
 */
app.patch(
  '/enrollments/:id/progress',
  [
    param('id').isInt().withMessage('Enrollment ID must be an integer'),
    body('module_id').isInt().withMessage('Module ID must be an integer'),
    body('section_id').isInt().withMessage('Section ID must be an integer'),
    body('status').isIn(['not_started', 'in_progress', 'completed']).withMessage('Status must be one of: not_started, in_progress, completed'),
  ],
  async (req: Request, res: Response) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const enrollment_id = Number(req.params.id);
    const { module_id, section_id, status } = req.body;

    try {
      // Check if enrollment exists
      const [enrollmentRows]: any = await pool.query(
        'SELECT * FROM enrollments WHERE id = ?',
        [enrollment_id]
      );

      if (Array.isArray(enrollmentRows) && enrollmentRows.length === 0) {
        return res.status(404).json({ error: 'Enrollment not found' });
      }

      // Check if progress record exists
      const [progressRows]: any = await pool.query(
        'SELECT * FROM progress WHERE enrollment_id = ? AND module_id = ? AND section_id = ?',
        [enrollment_id, module_id, section_id]
      );

      if (Array.isArray(progressRows) && progressRows.length > 0) {
        // Update existing progress
        await pool.query(
          'UPDATE progress SET status = ?, updated_at = NOW() WHERE enrollment_id = ? AND module_id = ? AND section_id = ?',
          [status, enrollment_id, module_id, section_id]
        );
      } else {
        // Create new progress record
        await pool.query(
          'INSERT INTO progress (enrollment_id, module_id, section_id, status, updated_at) VALUES (?, ?, ?, ?, NOW())',
          [enrollment_id, module_id, section_id, status]
        );
      }

      // Check if all sections are completed to update enrollment status
      if (status === 'completed') {
        const [courseModules]: any = await pool.query(
          'SELECT cm.id FROM course_modules cm ' +
          'JOIN enrollments e ON cm.course_id = e.course_id ' +
          'WHERE e.id = ?',
          [enrollment_id]
        );
        
        const [courseSections]: any = await pool.query(
          'SELECT cs.id FROM course_sections cs ' +
          'JOIN course_modules cm ON cs.module_id = cm.id ' +
          'JOIN enrollments e ON cm.course_id = e.course_id ' +
          'WHERE e.id = ?',
          [enrollment_id]
        );
        
        const [completedSections]: any = await pool.query(
          'SELECT COUNT(*) as count FROM progress ' +
          'WHERE enrollment_id = ? AND status = "completed"',
          [enrollment_id]
        );
        
        // If all sections are completed, update enrollment status
        if (Array.isArray(courseSections) && 
            Array.isArray(completedSections) && 
            courseSections.length > 0 && 
            completedSections[0].count >= courseSections.length) {
          await pool.query(
            'UPDATE enrollments SET status = "completed", completed_at = NOW() WHERE id = ?',
            [enrollment_id]
          );
        }
      }

      res.json({ message: 'Progress updated successfully' });
    } catch (err) {
      console.error('Error updating progress:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Enrollment service running on port ${port}`);
  });
}

// Export for testing
export { app };