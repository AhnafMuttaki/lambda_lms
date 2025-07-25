import request from 'supertest';
import { app } from '../index';
import { Server } from 'http';
import mysql from 'mysql2/promise';

let server: Server;
let pool: mysql.Pool;
let discussionId: number;

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
});

afterAll(async () => {
  await pool.end();
  server.close();
});

describe('Discussion Service API', () => {
  it('should post a discussion question', async () => {
    const res = await request(server)
      .post('/discussions')
      .send({ course_id: 1, question: 'Test question?' });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    discussionId = res.body.id;
  });

  it('should reply to a discussion question', async () => {
    const res = await request(server)
      .post(`/discussions/${discussionId}/reply`)
      .send({ reply: 'Test reply' });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
  });

  it('should post feedback for a course', async () => {
    const res = await request(server)
      .post('/feedback')
      .send({ course_id: 1, rating: 5, comment: 'Great course!' });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
  });

  it('should list discussions for a course', async () => {
    const res = await request(server).get('/discussions?course_id=1');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get a discussion with replies', async () => {
    const res = await request(server).get(`/discussions/${discussionId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(discussionId);
    expect(Array.isArray(res.body.replies)).toBe(true);
  });

  it('should get feedback for a course', async () => {
    const res = await request(server).get('/feedback?course_id=1');
    expect(res.status).toBe(200);
    expect(res.body.feedback).toBeDefined();
    expect(res.body.average_rating).toBeDefined();
  });
});