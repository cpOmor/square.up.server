/* eslint-disable no-console */
import mongoose from 'mongoose';
import config from '.';

export const databaseConnecting = async () => {
  try {
    await mongoose.connect(config.database_url as string);
    console.log('🚀 Database connected successfully');
  } catch (err) {
    console.error('❌ Database connection error:', err);
    process.exit(1);
  }
};
