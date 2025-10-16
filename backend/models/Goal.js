import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  targetAmount: {
    type: Number,
    required: true
  },
  currentAmount: {
    type: Number,
    default: 0
  },
  deadline: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    enum: ['Savings', 'Vacation', 'Emergency Fund', 'Investment', 'Education', 'Other'],
    default: 'Savings'
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: '#3498db'
  }
}, {
  timestamps: true
});

export default mongoose.model('Goal', goalSchema);