import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import mysql from 'mysql2/promise';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { body, param, validationResult } from 'express-validator';
import axios from 'axios';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
app.use(express.json());

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'mysql',
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: Number(process.env.MYSQL_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
});

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Live Session Service API',
      version: '1.0.0',
      description: 'API for managing live sessions in the LMS',
    },
    servers: [
      {
        url: `http://localhost:${process.env.LIVE_SESSION_SERVICE_PORT || 3007}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./index.ts'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP' });
});

/**
 * @swagger
 * components:
 *   schemas:
 *     LiveSession:
 *       type: object
 *       required:
 *         - course_id
 *         - teacher_id
 *         - scheduled_at
 *         - duration
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the live session
 *         course_id:
 *           type: integer
 *           description: The course ID this session belongs to
 *         teacher_id:
 *           type: integer
 *           description: The teacher ID who will conduct the session
 *         zoom_link:
 *           type: string
 *           description: The Zoom meeting link
 *         scheduled_at:
 *           type: string
 *           format: date-time
 *           description: When the session is scheduled
 *         duration:
 *           type: integer
 *           description: Duration in minutes
 *     Attendance:
 *       type: object
 *       required:
 *         - session_id
 *         - user_id
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the attendance record
 *         session_id:
 *           type: integer
 *           description: The live session ID
 *         user_id:
 *           type: integer
 *           description: The user ID who attended
 *         attended_at:
 *           type: string
 *           format: date-time
 *           description: When the attendance was recorded
 */

/**
 * @swagger
 * /live-sessions/schedule:
 *   post:
 *     summary: Schedule a new live session
 *     tags: [Live Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - course_id
 *               - teacher_id
 *               - scheduled_at
 *               - duration
 *             properties:
 *               course_id:
 *                 type: integer
 *               teacher_id:
 *                 type: integer
 *               scheduled_at:
 *                 type: string
 *                 format: date-time
 *               duration:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Live session scheduled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LiveSession'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
app.post(
  '/live-sessions/schedule',
  [
    body('course_id').isInt().withMessage('Course ID must be an integer'),
    body('teacher_id').isInt().withMessage('Teacher ID must be an integer'),
    body('scheduled_at').isISO8601().withMessage('Scheduled at must be a valid date-time'),
    body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
  ],
  async (req: Request, res: Response) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Extract data from request
      const { course_id, teacher_id, scheduled_at, duration } = req.body;

      // Generate Zoom link (in a real implementation, this would use the Zoom API)
      let zoomLink = '';
      try {
        // This is a placeholder for actual Zoom API integration
        // In a real implementation, you would use the Zoom API SDK or REST API
        if (process.env.ZOOM_API_KEY && process.env.ZOOM_API_SECRET) {
          // Example of how you might integrate with Zoom API
          // const zoomResponse = await axios.post('https://api.zoom.us/v2/users/me/meetings', {
          //   topic: `Course ${course_id} Live Session`,
          //   type: 2, // Scheduled meeting
          //   start_time: scheduled_at,
          //   duration: duration,
          // }, {
          //   headers: {
          //     'Authorization': `Bearer ${zoomToken}`,
          //     'Content-Type': 'application/json',
          //   },
          // });
          // zoomLink = zoomResponse.data.join_url;
          
          // For now, we'll just create a dummy link
          zoomLink = `https://zoom.us/j/${Math.floor(Math.random() * 1000000000)}`;
        } else {
          // If Zoom credentials are not configured, create a placeholder link
          zoomLink = `https://zoom.us/j/placeholder-${Date.now()}`;
        }
      } catch (error) {
        console.error('Error generating Zoom link:', error);
        // Continue with a placeholder if Zoom API fails
        zoomLink = `https://zoom.us/j/placeholder-${Date.now()}`;
      }

      // Insert into database
      const [result] = await pool.execute(
        'INSERT INTO live_sessions (course_id, teacher_id, zoom_link, scheduled_at, duration) VALUES (?, ?, ?, ?, ?)',
        [course_id, teacher_id, zoomLink, scheduled_at, duration]
      );

      // Get the inserted ID
      const insertId = (result as any).insertId;

      // Return the created session
      const [sessions] = await pool.execute(
        'SELECT * FROM live_sessions WHERE id = ?',
        [insertId]
      );

      res.status(201).json((sessions as any[])[0]);
    } catch (error) {
      console.error('Error scheduling live session:', error);
      res.status(500).json({ error: 'Failed to schedule live session' });
    }
  }
);

/**
 * @swagger
 * /live-sessions/{course_id}:
 *   get:
 *     summary: Get all live sessions for a course
 *     tags: [Live Sessions]
 *     parameters:
 *       - in: path
 *         name: course_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Course ID
 *     responses:
 *       200:
 *         description: List of live sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LiveSession'
 *       400:
 *         description: Invalid course ID
 *       500:
 *         description: Server error
 */
app.get(
  '/live-sessions/:course_id',
  [
    param('course_id').isInt().withMessage('Course ID must be an integer'),
  ],
  async (req: Request, res: Response) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Extract course ID from request
      const courseId = req.params.course_id;

      // Query database
      const [sessions] = await pool.execute(
        'SELECT * FROM live_sessions WHERE course_id = ? ORDER BY scheduled_at',
        [courseId]
      );

      res.status(200).json(sessions);
    } catch (error) {
      console.error('Error fetching live sessions:', error);
      res.status(500).json({ error: 'Failed to fetch live sessions' });
    }
  }
);

/**
 * @swagger
 * /live-sessions/{id}/join:
 *   get:
 *     summary: Get the Zoom link for a live session
 *     tags: [Live Sessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Live session ID
 *     responses:
 *       200:
 *         description: Zoom link for the session
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 zoom_link:
 *                   type: string
 *       400:
 *         description: Invalid session ID
 *       404:
 *         description: Session not found
 *       500:
 *         description: Server error
 */
app.get(
  '/live-sessions/:id/join',
  [
    param('id').isInt().withMessage('Session ID must be an integer'),
  ],
  async (req: Request, res: Response) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Extract session ID from request
      const sessionId = req.params.id;

      // Query database
      const [sessions] = await pool.execute(
        'SELECT * FROM live_sessions WHERE id = ?',
        [sessionId]
      );

      // Check if session exists
      if ((sessions as any[]).length === 0) {
        return res.status(404).json({ error: 'Live session not found' });
      }

      // Return the Zoom link
      const session = (sessions as any[])[0];
      res.status(200).json({ zoom_link: session.zoom_link });
    } catch (error) {
      console.error('Error fetching live session:', error);
      res.status(500).json({ error: 'Failed to fetch live session' });
    }
  }
);

/**
 * @swagger
 * /live-sessions/{id}/attendance:
 *   post:
 *     summary: Record attendance for a live session
 *     tags: [Live Sessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Live session ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *             properties:
 *               user_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Attendance recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Attendance'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Session not found
 *       500:
 *         description: Server error
 */
app.post(
  '/live-sessions/:id/attendance',
  [
    param('id').isInt().withMessage('Session ID must be an integer'),
    body('user_id').isInt().withMessage('User ID must be an integer'),
  ],
  async (req: Request, res: Response) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Extract data from request
      const sessionId = req.params.id;
      const { user_id } = req.body;

      // Check if session exists
      const [sessions] = await pool.execute(
        'SELECT * FROM live_sessions WHERE id = ?',
        [sessionId]
      );

      if ((sessions as any[]).length === 0) {
        return res.status(404).json({ error: 'Live session not found' });
      }

      // Check if attendance already recorded
      const [existingAttendance] = await pool.execute(
        'SELECT * FROM live_session_attendance WHERE session_id = ? AND user_id = ?',
        [sessionId, user_id]
      );

      if ((existingAttendance as any[]).length > 0) {
        return res.status(200).json((existingAttendance as any[])[0]);
      }

      // Insert attendance record
      const [result] = await pool.execute(
        'INSERT INTO live_session_attendance (session_id, user_id) VALUES (?, ?)',
        [sessionId, user_id]
      );

      // Get the inserted ID
      const insertId = (result as any).insertId;

      // Return the created attendance record
      const [attendance] = await pool.execute(
        'SELECT * FROM live_session_attendance WHERE id = ?',
        [insertId]
      );

      res.status(201).json((attendance as any[])[0]);
    } catch (error) {
      console.error('Error recording attendance:', error);
      res.status(500).json({ error: 'Failed to record attendance' });
    }
  }
);

/**
 * @swagger
 * /live-sessions/{id}/attendees:
 *   get:
 *     summary: Get all attendees for a live session
 *     tags: [Live Sessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Live session ID
 *     responses:
 *       200:
 *         description: List of attendees
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Attendance'
 *       400:
 *         description: Invalid session ID
 *       404:
 *         description: Session not found
 *       500:
 *         description: Server error
 */
app.get(
  '/live-sessions/:id/attendees',
  [
    param('id').isInt().withMessage('Session ID must be an integer'),
  ],
  async (req: Request, res: Response) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Extract session ID from request
      const sessionId = req.params.id;

      // Check if session exists
      const [sessions] = await pool.execute(
        'SELECT * FROM live_sessions WHERE id = ?',
        [sessionId]
      );

      if ((sessions as any[]).length === 0) {
        return res.status(404).json({ error: 'Live session not found' });
      }

      // Query database
      const [attendees] = await pool.execute(
        'SELECT * FROM live_session_attendance WHERE session_id = ? ORDER BY attended_at',
        [sessionId]
      );

      res.status(200).json(attendees);
    } catch (error) {
      console.error('Error fetching attendees:', error);
      res.status(500).json({ error: 'Failed to fetch attendees' });
    }
  }
);

// Start server
const PORT = process.env.LIVE_SESSION_SERVICE_PORT || 3007;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Live Session Service running on port ${PORT}`);
  });
}

// Export for testing
export { app, pool };