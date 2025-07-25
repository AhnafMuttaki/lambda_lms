import request from 'supertest';
import { app, pool } from '../index';
import { Server } from 'http';

let server: Server;

beforeAll(async () => {
  server = app.listen(0);
  
  // Clear notifications table before tests
  await pool.execute('DELETE FROM notifications');
});

afterAll(async () => {
  await pool.end();
  server.close();
});

describe('Notification Service API', () => {
  it('should send an in-app notification', async () => {
    const res = await request(server)
      .post('/notifications/send')
      .send({ user_id: 1, type: 'in_app', message: 'Test notification' });
    
    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Notification sent successfully');
    expect(res.body.id).toBeDefined();
  });

  it('should reject invalid notification data', async () => {
    const res = await request(server)
      .post('/notifications/send')
      .send({ user_id: 'invalid', type: 'unknown', message: '' });
    
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('should get notifications for a user', async () => {
    // First, create a notification for the user
    await request(server)
      .post('/notifications/send')
      .send({ user_id: 2, type: 'in_app', message: 'Test notification for user 2' });
    
    const res = await request(server).get('/notifications/2');
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].user_id).toBe(2);
    expect(res.body[0].message).toBe('Test notification for user 2');
  });

  it('should return empty array for user with no notifications', async () => {
    const res = await request(server).get('/notifications/999');
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  it('should send live session reminders', async () => {
    const res = await request(server).post('/notifications/reminders/live-sessions');
    
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('Sent');
  });

  it('should send deadline reminders', async () => {
    const res = await request(server).post('/notifications/reminders/deadlines');
    
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('Sent');
  });
});