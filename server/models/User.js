import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  id: { type: String, index: true, unique: true },
  firstName: String,
  lastName: String,
  email: { type: String, index: true, unique: true },
  password: String,
  userType: String,
  role: String,
  watchlist: [String],
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
