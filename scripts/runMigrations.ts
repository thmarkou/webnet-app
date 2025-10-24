import { createLookupTables } from '../src/services/firebase/migrations';

const runMigrations = async () => {
  try {
    await createLookupTables();
    console.log('All migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
};

runMigrations();
