const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/authRoutes');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

jest.mock('../models/user');
jest.mock('jsonwebtoken');
jest.mock('../utils/sendEmail');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Routes', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({ _id: '123', username: 'johndoe', email: 'johndoe@example.com', roles: ['User'] });
      jwt.sign.mockReturnValue('token');
      sendEmail.mockResolvedValue();

      const res = await request(app)
        .post('/api/auth/register')
        .send({ username: 'johndoe', email: 'johndoe@example.com', password: 'password123', roles: ['User'] });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token', 'token');
    });

    it('should return 400 if user already exists', async () => {
      User.findOne.mockResolvedValue({ email: 'johndoe@example.com' });

      const res = await request(app)
        .post('/api/auth/register')
        .send({ username: 'johndoe', email: 'johndoe@example.com', password: 'password123', roles: ['User'] });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message', 'User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login a user', async () => {
      const user = {
        _id: '123',
        email: 'johndoe@example.com',
        matchPassword: jest.fn().mockResolvedValue(true)
      };

      User.findOne.mockResolvedValue(user);
      jwt.sign.mockReturnValue('token');

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'johndoe@example.com', password: 'password123' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token', 'token');
    });

    it('should return 401 if email or password is invalid', async () => {
      User.findOne.mockResolvedValue(null);

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'johndoe@example.com', password: 'wrongpassword' });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message', 'Invalid email or password');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout a user', async () => {
      const res = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', 'Bearer token');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Logged out successfully');
    });
  });

  describe('GET /api/auth/profile', () => {
    it('should get user profile', async () => {
      const user = { _id: '123', username: 'johndoe' };

      jwt.verify.mockReturnValue({ id: '123' });
      User.findById.mockResolvedValue(user);

      const res = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer token');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(user);
    });

    it('should return 401 if not authorized', async () => {
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const res = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalidtoken');

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message', 'Not authorized, token failed');
    });
  });
});
