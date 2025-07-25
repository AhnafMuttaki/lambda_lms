import request from 'supertest';
import { app } from '../index';
import { Server } from 'http';
import mysql from 'mysql2/promise';

let server: Server;
let pool: mysql.Pool;
let sessionId: number;

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

  // Clean up any existing test data
  await pool.execute('DELETE FROM live_session_attendance WHERE session_id IN (SELECT id FROM live_sessions WHERE course_id = 999)');
  await pool.execute('DELETE FROM live_sessions WHERE course_id = 999');
});

afterAll(async () => {
  // Clean up test data
  await pool.execute('DELETE FROM live_session_attendance WHERE session_id IN (SELECT id FROM live_sessions WHERE course_id = 999)');
  await pool.execute('DELETE FROM live_sessions WHERE course_id = 999');
  await pool.end();
  server.close();
});

describe('Live Session Service API', () => {
  it('should schedule a new live session', async () => {
    const res = await request(server)
      .post('/live-sessions/schedule')
      .send({
        course_id: 999,
        teacher_id: 1,
        scheduled_at: new Date().toISOString(),
        duration: 60
      });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.zoom_link).toBeDefined();
    sessionId = res.body.id;
  });

  it('should reject scheduling with invalid data', async () => {
    const res = await request(server)
      .post('/live-sessions/schedule')
      .send({
        course_id: 'invalid',
        teacher_id: 1,
        scheduled_at: 'not-a-date',
        duration: -10
      });
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('should list live sessions for a course', async () => {
    const res = await request(server).get('/live-sessions/999');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].course_id).toBe(999);
  });

  it('should get the join link for a session', async () => {
    const res = await request(server).get(`/live-sessions/${sessionId}/join`);
    expect(res.status).toBe(200);
    expect(res.body.zoom_link).toBeDefined();
  });

  it('should return 404 for non-existent session', async () => {
    const res = await request(server).get('/live-sessions/9999999/join');
    expect(res.status).toBe(404);
  });

  it('should record attendance for a session', async () => {
    const res = await request(server)
      .post(`/live-sessions/${sessionId}/attendance`)
      .send({ user_id: 1 });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.session_id).toBe(sessionId);
    expect(res.body.user_id).toBe(1);
  });

  it('should not duplicate attendance records', async () => {
    // First request creates the record
    await request(server)
      .post(`/live-sessions/${sessionId}/attendance`)
      .send({ user_id: 2 });
    
    // Second request should return the existing record
    const res = await request(server)
      .post(`/live-sessions/${sessionId}/attendance`)
      .send({ user_id: 2 });
    
    expect(res.status).toBe(200); // Not 201 because it's not creating a new record
    expect(res.body.user_id).toBe(2);
  });

  it('should list attendees for a session', async () => {
    const res = await request(server).get(`/live-sessions/${sessionId}/attendees`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should return 404 when listing attendees for non-existent session', async () => {
    const res = await request(server).get('/live-sessions/9999999/attendees');
    expect(res.status).toBe(404);
  });
});