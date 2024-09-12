const Task = require('../models/task');

const createTask = async (req, res) => {
  const { title, description, dueDate, priority, status, assignedTo } = req.body;
  const task = await Task.create({
    title,
    description,
    dueDate,
    priority,
    status,
    assignedTo,
    createdBy: req.user._id,
  });
  res.status(201).json(task);
};

const getTasks = async (req, res) => {
  const tasks = await Task.find({ createdBy: req.user._id });
  res.json(tasks);
};

const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (task) {
    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.dueDate = req.body.dueDate || task.dueDate;
    task.priority = req.body.priority || task.priority;
    task.status = req.body.status || task.status;
    task.assignedTo = req.body.assignedTo || task.assignedTo;
    const updatedTask = await task.save();
    res.json(updatedTask);
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
};

const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (task) {
    await task.remove();
    res.json({ message: 'Task removed' });
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
