import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { body, param, validationResult } from 'express-validator';
import nodemailer from 'nodemailer';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
app.use(express.json());

// MySQL connection pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'mysql',
  user: process.env.MYSQL_USER || 'lmsuser',
  password: process.env.MYSQL_PASSWORD || 'lmspassword',
  database: process.env.MYSQL_DATABASE || 'lms',
  port: Number(process.env.MYSQL_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
});

// Configure Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Notification Service API',
      version: '1.0.0',
      description: 'API for managing notifications in the LMS',
    },
    servers: [
      {
        url: `http://localhost:${process.env.NOTIFICATION_SERVICE_PORT || 3008}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./index.ts'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Email transporter setup (for demonstration purposes)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SMTP_HOST || 'smtp.example.com',
  port: Number(process.env.EMAIL_SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || 'user@example.com',
    pass: process.env.EMAIL_PASSWORD || 'password',
  },
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       required:
 *         - user_id
 *         - type
 *         - message
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the notification
 *         user_id:
 *           type: integer
 *           description: The user ID who will receive the notification
 *         type:
 *           type: string
 *           enum: [email, in_app]
 *           description: Type of notification
 *         message:
 *           type: string
 *           description: Notification message content
 *         status:
 *           type: string
 *           enum: [pending, sent, failed]
 *           description: Status of the notification
 *         sent_at:
 *           type: string
 *           format: date-time
 *           description: When the notification was sent
 */

/**
 * @swagger
 * /notifications/send:
 *   post:
 *     summary: Send a notification to a user
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - type
 *               - message
 *             properties:
 *               user_id:
 *                 type: integer
 *               type:
 *                 type: string
 *                 enum: [email, in_app]
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Notification sent successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
app.post(
  '/notifications/send',
  [
    body('user_id').isInt().withMessage('User ID must be an integer'),
    body('type').isIn(['email', 'in_app']).withMessage('Type must be email or in_app'),
    body('message').notEmpty().withMessage('Message is required'),
  ],
  async (req: Request, res: Response) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { user_id, type, message } = req.body;

    try {
      // Insert notification into database
      const [result]: any = await pool.execute(
        'INSERT INTO notifications (user_id, type, message, status) VALUES (?, ?, ?, ?)',
        [user_id, type, message, 'pending']
      );

      const notificationId = result.insertId;

      // If it's an email notification, send it
      if (type === 'email') {
        try {
          // Get user email from user service (in a real implementation)
          // For demo, we'll assume we have the email
          const userEmail = `user${user_id}@example.com`; // This would come from user service

          // Send email
          await transporter.sendMail({
            from: process.env.EMAIL_FROM || 'noreply@lms.com',
            to: userEmail,
            subject: 'LMS Notification',
            text: message,
          });

          // Update notification status to sent
          await pool.execute(
            'UPDATE notifications SET status = ?, sent_at = NOW() WHERE id = ?',
            ['sent', notificationId]
          );
        } catch (emailError) {
          console.error('Email sending failed:', emailError);
          // Update notification status to failed
          await pool.execute(
            'UPDATE notifications SET status = ? WHERE id = ?',
            ['failed', notificationId]
          );
        }
      } else {
        // For in-app notifications, mark as sent immediately
        await pool.execute(
          'UPDATE notifications SET status = ?, sent_at = NOW() WHERE id = ?',
          ['sent', notificationId]
        );
      }

      res.status(201).json({
        id: notificationId,
        message: 'Notification sent successfully',
      });
    } catch (error) {
      console.error('Error sending notification:', error);
      res.status(500).json({ error: 'Failed to send notification' });
    }
  }
);

/**
 * @swagger
 * /notifications/{user_id}:
 *   get:
 *     summary: Get all notifications for a user
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *       400:
 *         description: Invalid user ID
 *       500:
 *         description: Server error
 */
app.get(
  '/notifications/:user_id',
  [
    param('user_id').isInt().withMessage('User ID must be an integer'),
  ],
  async (req: Request, res: Response) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.params.user_id;

    try {
      // Get notifications for user
      const [rows] = await pool.execute(
        'SELECT * FROM notifications WHERE user_id = ? ORDER BY sent_at DESC',
        [userId]
      );

      res.status(200).json(rows);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  }
);

/**
 * @swagger
 * /notifications/reminders/live-sessions:
 *   post:
 *     summary: Send reminders for upcoming live sessions
 *     tags: [Notifications]
 *     responses:
 *       200:
 *         description: Reminders sent successfully
 *       500:
 *         description: Server error
 */
app.post('/notifications/reminders/live-sessions', async (req: Request, res: Response) => {
  try {
    // In a real implementation, this would query the live-session service
    // to get upcoming sessions and enrolled users
    // For demo purposes, we'll simulate this process

    // Example: Find all live sessions starting in the next hour
    const upcomingSessionsQuery = `
      SELECT ls.id, ls.course_id, ls.scheduled_at, ls.zoom_link, 
             c.title as course_title, 
             e.user_id
      FROM live_sessions ls
      JOIN courses c ON ls.course_id = c.id
      JOIN enrollments e ON e.course_id = c.id
      WHERE ls.scheduled_at BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 1 HOUR)
    `;

    // This would be executed in a real implementation
    // const [upcomingSessions] = await pool.query(upcomingSessionsQuery);

    // For demo, we'll simulate some upcoming sessions
    const simulatedSessions = [
      { id: 1, course_id: 101, user_id: 201, course_title: 'Introduction to Programming', scheduled_at: new Date(Date.now() + 30 * 60 * 1000) },
      { id: 2, course_id: 102, user_id: 202, course_title: 'Advanced Web Development', scheduled_at: new Date(Date.now() + 45 * 60 * 1000) },
    ];

    // Send notifications for each session
    let sentCount = 0;
    for (const session of simulatedSessions) {
      const message = `Reminder: Your live session for "${session.course_title}" starts at ${session.scheduled_at.toLocaleTimeString()}`;
      
      // Insert notification
      const [result]: any = await pool.execute(
        'INSERT INTO notifications (user_id, type, message, status) VALUES (?, ?, ?, ?)',
        [session.user_id, 'in_app', message, 'sent']
      );

      // Update sent_at
      await pool.execute(
        'UPDATE notifications SET sent_at = NOW() WHERE id = ?',
        [result.insertId]
      );

      sentCount++;
    }

    res.status(200).json({
      message: `Sent ${sentCount} live session reminders`,
    });
  } catch (error) {
    console.error('Error sending reminders:', error);
    res.status(500).json({ error: 'Failed to send reminders' });
  }
});

/**
 * @swagger
 * /notifications/reminders/deadlines:
 *   post:
 *     summary: Send reminders for upcoming course deadlines
 *     tags: [Notifications]
 *     responses:
 *       200:
 *         description: Deadline reminders sent successfully
 *       500:
 *         description: Server error
 */
app.post('/notifications/reminders/deadlines', async (req: Request, res: Response) => {
  try {
    // In a real implementation, this would query other services
    // to get upcoming deadlines and enrolled users
    // For demo purposes, we'll simulate this process

    // Simulate some upcoming deadlines
    const simulatedDeadlines = [
      { course_id: 101, user_id: 201, course_title: 'Introduction to Programming', deadline_type: 'assignment', deadline_at: new Date(Date.now() + 24 * 60 * 60 * 1000) },
      { course_id: 102, user_id: 202, course_title: 'Advanced Web Development', deadline_type: 'quiz', deadline_at: new Date(Date.now() + 12 * 60 * 60 * 1000) },
    ];

    // Send notifications for each deadline
    let sentCount = 0;
    for (const deadline of simulatedDeadlines) {
      const message = `Reminder: Your ${deadline.deadline_type} for "${deadline.course_title}" is due on ${deadline.deadline_at.toLocaleDateString()}`;
      
      // Insert notification
      const [result]: any = await pool.execute(
        'INSERT INTO notifications (user_id, type, message, status) VALUES (?, ?, ?, ?)',
        [deadline.user_id, 'in_app', message, 'sent']
      );

      // Update sent_at
      await pool.execute(
        'UPDATE notifications SET sent_at = NOW() WHERE id = ?',
        [result.insertId]
      );

      sentCount++;
    }

    res.status(200).json({
      message: `Sent ${sentCount} deadline reminders`,
    });
  } catch (error) {
    console.error('Error sending deadline reminders:', error);
    res.status(500).json({ error: 'Failed to send deadline reminders' });
  }
});

// Start server
const PORT = process.env.NOTIFICATION_SERVICE_PORT || 3008;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Notification service running on port ${PORT}`);
  });
}

// Export for testing
export { app, pool };