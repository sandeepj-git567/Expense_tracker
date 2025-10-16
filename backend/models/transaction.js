import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Please add a text description'],
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Please add a positive or negative number']
  },
  category: {
    type: String,
    required: true,
    enum: ['Food', 'Transport', 'Entertainment', 'Utilities', 'Healthcare', 'Shopping', 'Income', 'Other'],
    default: 'Other'
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model('Transaction', transactionSchema);