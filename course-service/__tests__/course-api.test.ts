import request from 'supertest';
import { app } from '../index';
import { Server } from 'http';
import mysql from 'mysql2/promise';

let server: Server;
let pool: mysql.Pool;
let courseId: number;
let moduleId: number;
let sectionId: number;

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

describe('Course Service API', () => {
  it('should create a new course', async () => {
    const res = await request(server)
      .post('/courses')
      .send({ title: 'Test Course', description: 'Desc', teacher_id: 1 });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    courseId = res.body.id;
  });

  it('should edit the course', async () => {
    const res = await request(server)
      .put(`/courses/${courseId}`)
      .send({ title: 'Updated Course', description: 'Updated Desc' });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Updated');
  });

  it('should list courses', async () => {
    const res = await request(server).get('/courses');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should submit course for approval', async () => {
    const res = await request(server).post(`/courses/${courseId}/submit-for-approval`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Submitted for approval');
  });

  it('should approve the course', async () => {
    const res = await request(server).post(`/courses/${courseId}/approve`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Approved');
  });

  it('should create a module', async () => {
    const res = await request(server)
      .post(`/courses/${courseId}/modules`)
      .send({ title: 'Module 1', order: 1 });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    moduleId = res.body.id;
  });

  it('should edit the module', async () => {
    const res = await request(server)
      .put(`/modules/${moduleId}`)
      .send({ title: 'Updated Module', order: 2 });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Updated');
  });

  it('should create a section', async () => {
    const res = await request(server)
      .post(`/modules/${moduleId}/sections`)
      .send({ title: 'Section 1', order: 1 });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    sectionId = res.body.id;
  });

  it('should edit the section', async () => {
    const res = await request(server)
      .put(`/sections/${sectionId}`)
      .send({ title: 'Updated Section', order: 2 });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Updated');
  });

  it('should delete the section', async () => {
    const res = await request(server).delete(`/sections/${sectionId}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Deleted');
  });

  it('should delete the module', async () => {
    const res = await request(server).delete(`/modules/${moduleId}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Deleted');
  });

  it('should delete the course', async () => {
    const res = await request(server).delete(`/courses/${courseId}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Deleted');
  });
});
