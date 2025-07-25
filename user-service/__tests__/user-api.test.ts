import request from 'supertest';
import { app } from '../index';
import { Server } from 'http';
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';

let server: Server;
let pool: mysql.Pool;

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

describe('User Service API', () => {
  let userId: number;
  let token: string;

  it('should register a new user', async () => {
    const res = await request(server)
      .post('/users/register')
      .send({ name: 'Test User', email: 'test@example.com', password: 'password123', role: 'student' });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
    const decoded: any = jwt.decode(token);
    userId = decoded.id;
  });

  it('should not register with duplicate email', async () => {
    const res = await request(server)
      .post('/users/register')
      .send({ name: 'Test User', email: 'test@example.com', password: 'password123', role: 'student' });
    expect(res.status).toBe(400);
  });

  it('should login with correct credentials', async () => {
    const res = await request(server)
      .post('/users/login')
      .send({ email: 'test@example.com', password: 'password123' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('should not login with wrong password', async () => {
    const res = await request(server)
      .post('/users/login')
      .send({ email: 'test@example.com', password: 'wrongpass' });
    expect(res.status).toBe(401);
  });

  it('should get user profile', async () => {
    const res = await request(server).get(`/users/${userId}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe('test@example.com');
  });

  it('should update user profile', async () => {
    const res = await request(server)
      .put(`/users/${userId}`)
      .send({ name: 'Updated User', bio: 'Bio', avatar_url: 'http://avatar' });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Updated');
  });

  it('should reset password', async () => {
    const res = await request(server)
      .post('/users/reset-password')
      .send({ email: 'test@example.com', new_password: 'newpassword123' });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Password reset');
  });

  it('should change user role', async () => {
    const res = await request(server)
      .patch(`/users/${userId}/role`)
      .send({ role: 'teacher' });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Role updated');
});
});
