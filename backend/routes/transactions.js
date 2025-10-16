import express from 'express';
import {
  getTransactions,
  addTransaction,
  deleteTransaction,
  getBalance,
  getAnalytics,
  generateReport
} from '../controllers/transactionController.js';

const router = express.Router();

router
  .route('/')
  .get(getTransactions)
  .post(addTransaction);

router
  .route('/:id')
  .delete(deleteTransaction);

router
  .route('/balance')
  .get(getBalance);

router
  .route('/analytics')
  .get(getAnalytics);

router
  .route('/report')
  .post(generateReport);

export default router;