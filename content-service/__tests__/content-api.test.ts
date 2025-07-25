import request from 'supertest';
import { app } from '../index';
import { Server } from 'http';
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

let server: Server;
let pool: mysql.Pool;
let contentId: number;
const testFilePath = path.join(__dirname, 'testfile.txt');

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
  fs.writeFileSync(testFilePath, 'test content');
  server = app.listen(0);
});

afterAll(async () => {
  await pool.end();
  server.close();
  if (fs.existsSync(testFilePath)) fs.unlinkSync(testFilePath);
});

describe('Content Service API', () => {
  it('should upload content', async () => {
    const res = await request(server)
      .post('/content/upload')
      .field('type', 'pdf')
      .field('course_id', '1')
      .attach('file', testFilePath);
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    contentId = res.body.id;
  });

  it('should get content metadata', async () => {
    const res = await request(server).get(`/content/${contentId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(contentId);
    expect(res.body.download_url).toBeDefined();
  });

  it('should delete content', async () => {
    const res = await request(server).delete(`/content/${contentId}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Deleted');
  });
});
