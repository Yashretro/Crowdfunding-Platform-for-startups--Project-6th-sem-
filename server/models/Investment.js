import mongoose from 'mongoose';

const InvestmentSchema = new mongoose.Schema({
  id: { type: String, index: true, unique: true },
  projectId: String,
  projectTitle: String,
  amount: Number,
  createdAt: String,
  status: String,
  investorName: String,
}, { timestamps: true });

export default mongoose.models.Investment || mongoose.model('Investment', InvestmentSchema);
