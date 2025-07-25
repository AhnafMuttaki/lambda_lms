import request from 'supertest';
import { app } from '../index';
import { Server } from 'http';
import mysql from 'mysql2/promise';

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

describe('Certificate Service API', () => {
  it('should return health', async () => {
    const res = await request(server).get('/health');
    expect(res.status).toBe(200);
  });
  // Add more tests for generate and get endpoints
}); 