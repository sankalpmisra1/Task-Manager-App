// taskRoutes.js
const express = require('express');
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middlewares/authMiddleware');
const { roleMiddleware } = require('../middlewares/roleMiddleware');
const { checkRole } = require('../middlewares/roleMiddleware');
const router = express.Router();


router.post('/', protect, checkRole(['Admin', 'Manager']), createTask);
router.get('/', protect, checkRole(['Admin', 'Manager', 'User']), getTasks);
router.put('/:id', protect, checkRole(['Admin', 'Manager', 'User']), updateTask);
router.delete('/:id', protect, checkRole(['Admin']), deleteTask);

module.exports = router;
