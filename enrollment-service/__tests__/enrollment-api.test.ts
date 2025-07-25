import request from 'supertest';
import { app } from '../index';
import { Server } from 'http';
import mysql from 'mysql2/promise';

let server: Server;
let pool: mysql.Pool;
let enrollmentId: number;

beforeAll(async () => {
  pool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'mysql',
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: Number(process.env.MYSQL_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
  });
  server = app.listen(0);
  
  // Setup test data
  await pool.query('INSERT INTO users (id, name, email, password_hash, role, status) VALUES (999, "Test User", "test@example.com", "hash", "student", "active") ON DUPLICATE KEY UPDATE id=id');
  await pool.query('INSERT INTO courses (id, title, description, status, teacher_id) VALUES (999, "Test Course", "Test Description", "published", 1) ON DUPLICATE KEY UPDATE id=id');
});

afterAll(async () => {
  // Clean up test data
  if (enrollmentId) {
    await pool.query('DELETE FROM progress WHERE enrollment_id = ?', [enrollmentId]);
    await pool.query('DELETE FROM enrollments WHERE id = ?', [enrollmentId]);
  }
  await pool.query('DELETE FROM users WHERE id = 999');
  await pool.query('DELETE FROM courses WHERE id = 999');
  
  await pool.end();
  server.close();
});

describe('Enrollment Service API', () => {
  it('should create a new enrollment', async () => {
    const res = await request(server)
      .post('/enrollments')
      .send({ user_id: 999, course_id: 999 });
    
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.user_id).toBe(999);
    expect(res.body.course_id).toBe(999);
    expect(res.body.status).toBe('active');
    
    enrollmentId = res.body.id;
  });

  it('should not allow duplicate enrollments', async () => {
    const res = await request(server)
      .post('/enrollments')
      .send({ user_id: 999, course_id: 999 });
    
    expect(res.status).toBe(409);
  });

  it('should get enrollments for a user', async () => {
    const res = await request(server).get('/enrollments/999');
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].user_id).toBe(999);
    expect(res.body[0].course_id).toBe(999);
  });

  it('should filter enrollments by status', async () => {
    const res = await request(server).get('/enrollments/999?status=active');
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].status).toBe('active');
  });

  it('should update progress for an enrollment', async () => {
    // First, create a module and section for testing
    const [moduleResult]: any = await pool.query(
      'INSERT INTO course_modules (course_id, title, `order`) VALUES (999, "Test Module", 1) ON DUPLICATE KEY UPDATE id=id'
    );
    const moduleId = moduleResult.insertId || 999;
    
    const [sectionResult]: any = await pool.query(
      'INSERT INTO course_sections (module_id, title, `order`) VALUES (?, "Test Section", 1) ON DUPLICATE KEY UPDATE id=id',
      [moduleId]
    );
    const sectionId = sectionResult.insertId || 999;
    
    const res = await request(server)
      .patch(`/enrollments/${enrollmentId}/progress`)
      .send({
        module_id: moduleId,
        section_id: sectionId,
        status: 'in_progress'
      });
    
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Progress updated successfully');
    
    // Verify progress was recorded
    const [progressRows]: any = await pool.query(
      'SELECT * FROM progress WHERE enrollment_id = ? AND module_id = ? AND section_id = ?',
      [enrollmentId, moduleId, sectionId]
    );
    
    expect(Array.isArray(progressRows)).toBe(true);
    expect(progressRows.length).toBe(1);
    expect(progressRows[0].status).toBe('in_progress');
  });

  it('should mark enrollment as completed when all sections are completed', async () => {
    // Get the module and section IDs
    const [moduleRows]: any = await pool.query(
      'SELECT id FROM course_modules WHERE course_id = 999 LIMIT 1'
    );
    const moduleId = moduleRows[0].id;
    
    const [sectionRows]: any = await pool.query(
      'SELECT id FROM course_sections WHERE module_id = ? LIMIT 1',
      [moduleId]
    );
    const sectionId = sectionRows[0].id;
    
    // Mark the section as completed
    const res = await request(server)
      .patch(`/enrollments/${enrollmentId}/progress`)
      .send({
        module_id: moduleId,
        section_id: sectionId,
        status: 'completed'
      });
    
    expect(res.status).toBe(200);
    
    // Check if enrollment was marked as completed
    const [enrollmentRows]: any = await pool.query(
      'SELECT * FROM enrollments WHERE id = ?',
      [enrollmentId]
    );
    
    expect(enrollmentRows[0].status).toBe('completed');
    expect(enrollmentRows[0].completed_at).not.toBeNull();
  });
});