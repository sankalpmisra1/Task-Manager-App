const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const { protect } = require('./middlewares/authMiddleware');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
// const csrf = require('csurf');
const { swaggerUi, specs } = require('./config/swagger');
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Security middlewares
app.use(helmet()); // Sets various HTTP headers for security
app.use(xss()); // Prevents XSS attacks
// app.use(csrf({ cookie: true })); // CSRF protection

// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
  });
  
// Apply rate limiting to all requests
app.use(limiter);
// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', protect, taskRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
