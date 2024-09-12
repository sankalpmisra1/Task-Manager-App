const User = require('../models/user');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

const registerUser = async (req, res) => {
  const { username, email, password ,roles} = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({ username, email, password ,roles });

  if (user) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.status(201).json({ token });
    sendEmail(email, 'Welcome!', 'Thank you for registering!');
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

const logoutUser = (req, res) => {
  res.json({ message: 'Logged out successfully' });
};

const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json(user);
};

module.exports = { registerUser, loginUser, logoutUser, getUserProfile };
