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
    const content = await readFile(storePath, 'utf-8');
    const store = JSON.parse(content);

    const usersCount = await models.User.countDocuments();
    if (usersCount === 0 && Array.isArray(store.users)) {
      await models.User.insertMany(store.users);
    }

    if (Array.isArray(store.projects)) {
      const existingProjects = await models.Project.find({}, { id: 1, _id: 0 }).lean();
      const existingProjectIds = new Set(existingProjects.map((project) => project.id));
      const missingProjects = store.projects.filter((project) => project && project.id && !existingProjectIds.has(project.id));

      if (missingProjects.length > 0) {
        await models.Project.insertMany(missingProjects);
      }
    }

    if (usersCount === 0 && Array.isArray(store.investments)) {
      await models.Investment.insertMany(store.investments);
    }

    console.log('Synced MongoDB seeds from store.json');
  } catch (err) {
    console.warn('Seeding skipped or failed:', err.message);
  }
}
