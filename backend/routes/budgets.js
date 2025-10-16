import express from 'express';
import { 
  getBudgets, 
  createBudget, 
  updateBudget, 
  deleteBudget, 
  getBudgetAlerts 
} from '../controllers/budgetController.js';

const router = express.Router();

router.route('/')
  .get(getBudgets)
  .post(createBudget);

router.route('/:id')
  .put(updateBudget)
  .delete(deleteBudget);

router.get('/alerts', getBudgetAlerts);

export default router;