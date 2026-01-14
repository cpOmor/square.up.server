/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import http from 'http';
import cookieParser from 'cookie-parser';
import { databaseConnecting } from './app/config/database.config';
import config from './app/config';
import notFound from './app/middlewares/notFound';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import router from './app/routes';
import './app/modules/Auth/googleAuth';

const app: Application = express();
const server = http.createServer(app);
 
app.use(express.json());
app.use(cookieParser());

// CORS configuration
const corsOptions = {
  origin: async (origin: any, callback: any) => {
    try {
      callback(null, true);
    } catch (error) {
      callback(error);
    }
  },
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
  ],
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};

app.use(cors(corsOptions));

// Session configuration
// app.use(
//   session({
//     secret: config.jwt_access_secret as string,
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false }, // Local development: secure false
//   }),
// );

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: '🚀 AI Server is running successfully!',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api', router);

// Error handling
app.use(globalErrorHandler);
app.use(notFound);

// Start server
const PORT = config.port || 5000;

const startServer = async () => {
  try {
    await databaseConnecting();
    server.listen(PORT, () => {
      
      console.log(`📍 Environment: ${config.NODE_ENV}`);
      console.log(`🌐 Server URL: http://localhost:${PORT}`);
      
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

export default app;
