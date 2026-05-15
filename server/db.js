import mongoose from 'mongoose';
import { readFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function connectDB(uri) {
  const mongoUri = uri || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kickscale';
  mongoose.set('strictQuery', false);
  await mongoose.connect(mongoUri, { dbName: 'kickscale' });
}

export async function seedFromFileIfEmpty(models) {
  const storePath = join(__dirname, 'data', 'store.json');
  try {
    const usersCount = await models.User.countDocuments();
    if (usersCount > 0) return;
    const content = await readFile(storePath, 'utf-8');
    const store = JSON.parse(content);
    if (Array.isArray(store.users)) {
      await models.User.insertMany(store.users);
    }
    if (Array.isArray(store.projects)) {
      await models.Project.insertMany(store.projects);
    }
    if (Array.isArray(store.investments)) {
      await models.Investment.insertMany(store.investments);
    }
    console.log('Seeded MongoDB from store.json');
  } catch (err) {
    console.warn('Seeding skipped or failed:', err.message);
  }
}
