// src/init-database.ts
import dataSource from "./config/typeorm.config";

async function initializeDatabase() {
  console.log('=== Attempting to initialize DataSource ===');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  try {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
      console.log('✅ DataSource has been initialized successfully');
    } else {
      console.log('ℹ️ DataSource was already initialized');
    }
  } catch (err) {
    console.error('❌ Error during DataSource initialization:', err);
    // Optionally, rethrow or process.exit(1) if this is fatal:
    // process.exit(1);
  }
}

// Immediately invoke, or call from your main entrypoint
initializeDatabase();
