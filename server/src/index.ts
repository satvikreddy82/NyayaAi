import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { db } from './models/db';
import { rateLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';

import caseRoutes from './routes/caseRoutes';
import documentRoutes from './routes/documentRoutes';
import legalRoutes from './routes/legalRoutes';
import riskRoutes from './routes/riskRoutes';
import aiRoutes from './routes/aiRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Security Headers & CORS
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      CLIENT_URL,
      'http://localhost:5173',
      'http://127.0.0.1:5173'
    ];
    // Allow Vercel preview + production deployments
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin.includes('nyayaai')
    ) {
      callback(null, true);
    } else {
      callback(null, true); // permissive for hackathon demo
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiting
app.use('/api', rateLimiter);

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    product: 'NYAYAAI',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api', caseRoutes);
app.use('/api', documentRoutes);
app.use('/api', legalRoutes);
app.use('/api', riskRoutes);
app.use('/api', aiRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Initialize DB & Start Server
async function startServer() {
  const mongoUri = process.env.MONGODB_URI;
  await db.initialize(mongoUri);

  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`⚖️  NYAYAAI Backend Server running on port ${PORT}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/health`);
    console.log(`🤖 AI Provider: ${process.env.GEMINI_API_KEY ? 'Google Gemini Free Tier' : 'Mock AI (Demo Mode)'}`);
    console.log(`====================================================`);
  });
}

startServer().catch((err) => {
  console.error('[Server Start Error]', err);
});
