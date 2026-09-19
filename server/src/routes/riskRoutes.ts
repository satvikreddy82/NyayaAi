import { Router, Request, Response } from 'express';
import { RiskDetectionService } from '../services/riskDetectionService';

const router = Router();

// Handle both /api/risk/check and /api/check
router.post(['/risk/check', '/check'], (req: Request, res: Response) => {
  const { text } = req.body;
  const assessment = RiskDetectionService.evaluateRisk(text || '');
  res.json({ success: true, data: assessment });
});

export default router;
