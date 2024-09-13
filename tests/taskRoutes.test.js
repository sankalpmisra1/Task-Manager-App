const request = require('supertest');
const express = require('express');
const taskRoutes = require('../routes/taskRoutes');
const { protect } = require('../middlewares/authMiddleware');
const Task = require('../models/task');
const jwt = require('jsonwebtoken');

jest.mock('../models/task');
jest.mock('../middlewares/authMiddleware');
jest.mock('jsonwebtoken');

const app = express();
app.use(express.json());
app.use('/api/tasks', protect, taskRoutes);

describe('Task Routes', () => {
  beforeEach(() => {
    protect.mockImplementation((req, res, next) => next());
  });

  describe('GET /api/tasks', () => {
    it('should get all tasks', async () => {
      const tasks = [{ _id: '1', title: 'Task 1' }, { _id: '2', title: 'Task 2' }];
      Task.find.mockResolvedValue(tasks);

      const res = await request(app).get('/api/tasks');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(tasks);
    });

    it('should return 401 if not authorized', async () => {
      protect.mockImplementation((req, res, next) => res.status(401).json({ message: 'Not authorized' }));

      const res = await request(app).get('/api/tasks');

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message', 'Not authorized');
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const task = { _id: '1', title: 'New Task' };
      Task.create.mockResolvedValue(task);

      const res = await request(app)
        .post('/api/tasks')
        .send({ title: 'New Task' });

      expect(res.status).toBe(201);
      expect(res.body).toEqual(task);
    });

    it('should return 400 if validation fails', async () => {
      Task.create.mockImplementation(() => {
        throw new Error('Validation failed');
      });

      const res = await request(app)
        .post('/api/tasks')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message', 'Validation failed');
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update a task', async () => {
      const task = { _id: '1', title: 'Updated Task' };
      Task.findByIdAndUpdate.mockResolvedValue(task);

      const res = await request(app)
        .put('/api/tasks/1')
        .send({ title: 'Updated Task' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(task);
    });

    it('should return 404 if task not found', async () => {
      Task.findByIdAndUpdate.mockResolvedValue(null);

      const res = await request(app)
        .put('/api/tasks/1')
        .send({ title: 'Updated Task' });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', 'Task not found');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
      Task.findByIdAndDelete.mockResolvedValue({ _id: '1', title: 'Task to delete' });

      const res = await request(app).delete('/api/tasks/1');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Task removed');
    });

    it('should return 404 if task not found', async () => {
      Task.findByIdAndDelete.mockResolvedValue(null);

      const res = await request(app).delete('/api/tasks/1');

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', 'Task not found');
    });
  });
});
