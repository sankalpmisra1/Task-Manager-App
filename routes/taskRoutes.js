// taskRoutes.js
const express = require('express');
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middlewares/authMiddleware');
const { roleMiddleware } = require('../middlewares/roleMiddleware');
const { checkRole } = require('../middlewares/roleMiddleware');
const router = express.Router();


/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - dueDate
 *         - priority
 *         - status
 *       properties:
 *         title:
 *           type: string
 *           description: The task title
 *         description:
 *           type: string
 *           description: The task description
 *         dueDate:
 *           type: string
 *           format: date
 *           description: The task due date
 *         priority:
 *           type: string
 *           description: The task priority
 *         status:
 *           type: string
 *           description: The task status
 *         assignedTo:
 *           type: string
 *           description: The ID of the user the task is assigned to
 *         createdBy:
 *           type: string
 *           description: The ID of the user who created the task
 *       example:
 *         title: Complete project
 *         description: Finish the project by the end of the month
 *         dueDate: 2024-09-30
 *         priority: High
 *         status: In Progress
 *         assignedTo: 60d0fe4f5311236168a109ca
 *         createdBy: 60d0fe4f5311236168a109cb
 */

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       201:
 *         description: The task was successfully created
 *       403:
 *         description: Forbidden
 */
router.post('/', protect, checkRole(['Admin', 'Manager']), createTask);

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks retrieved successfully
 *       403:
 *         description: Forbidden
 */
router.get('/', protect, checkRole(['Admin', 'Manager', 'User']), getTasks);

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: The task was successfully updated
 *       403:
 *         description: Forbidden
 */
router.put('/:id', protect, checkRole(['Admin', 'Manager', 'User']), updateTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The task ID
 *     responses:
 *       200:
 *         description: The task was successfully deleted
 *       403:
 *         description: Forbidden
 */
router.delete('/:id', protect, checkRole(['Admin']), deleteTask);

module.exports = router;
