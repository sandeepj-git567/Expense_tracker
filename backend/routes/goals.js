import express from 'express';
import { 
  getGoals, 
  createGoal, 
  updateGoal, 
  deleteGoal, 
  addToGoal 
} from '../controllers/goalController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getGoals)
  .post(createGoal);

router.route('/:id')
  .put(updateGoal)
  .delete(deleteGoal);

router.post('/:id/add', addToGoal);

export default router;