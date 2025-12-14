import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import serverless from 'serverless-http';

// Import routes
import authRoutes from '../../backend/routes/auth.js';
import transactionRoutes from '../../backend/routes/transactions.js';
import budgetRoutes from '../../backend/routes/budgets.js';
import goalRoutes from '../../backend/routes/goals.js';

dotenv.config({ path: '../../backend/.env' });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/goals', goalRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

export const handler = serverless(app);