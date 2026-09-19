import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { db } from '../server/src/models/db';

import caseRoutes from '../server/src/routes/caseRoutes';
import documentRoutes from '../server/src/routes/documentRoutes';
import legalRoutes from '../server/src/routes/legalRoutes';
import riskRoutes from '../server/src/routes/riskRoutes';
import aiRoutes from '../server/src/routes/aiRoutes';
import { errorHandler } from '../server/src/middleware/errorHandler';
import { rateLimiter } from '../server/src/middleware/rateLimiter';

dotenv.config();

const app = express();

// CORS — allow all Vercel domains + localhost for dev
app.use(cors({
  origin: (origin, callback) => {
    // Allow Vercel deployments, localhost, and no-origin (server-to-server)
    if (
      !origin ||
      origin.includes('vercel.app') ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      (process.env.CLIENT_URL && origin === process.env.CLIENT_URL)
    ) {
      callback(null, true);
    } else {
      callback(null, true); // permissive for hackathon — lock down in production
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiting
app.use(rateLimiter);

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'healthy',
    product: 'NYAYAAI',
    version: '1.0.0',
    environment: 'vercel-serverless',
    timestamp: new Date().toISOString()
  });
});

// Mount all API routes
app.use('/api', caseRoutes);
app.use('/api', documentRoutes);
app.use('/api', legalRoutes);
app.use('/api', riskRoutes);
app.use('/api', aiRoutes);

// Error handling
app.use(errorHandler);

// Initialize DB once (in-memory on Vercel; MongoDB if MONGODB_URI is set)
let initialized = false;
const initDb = async () => {
  if (!initialized) {
    await db.initialize(process.env.MONGODB_URI);
    initialized = true;
  }
};

// Vercel serverless handler export
export default async function handler(req: any, res: any) {
  await initDb();
  return app(req, res);
}
