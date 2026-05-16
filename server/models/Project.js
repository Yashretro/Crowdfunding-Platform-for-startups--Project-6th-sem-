import mongoose from 'mongoose';

const FounderSchema = new mongoose.Schema({
  name: String,
  bio: String,
}, { _id: false });

const UpdateSchema = new mongoose.Schema({
  date: String,
  content: String,
}, { _id: false });

const ProjectSchema = new mongoose.Schema({
  id: { type: String, index: true, unique: true },
  ownerId: { type: String, index: true },
  title: String,
  description: String,
  goal: Number,
  raised: Number,
  image: String,
  category: String,
  daysLeft: Number,
  featured: Boolean,
  founder: FounderSchema,
  updates: [UpdateSchema],
  approved: Boolean,
  rejected: Boolean,
}, { timestamps: true });

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
