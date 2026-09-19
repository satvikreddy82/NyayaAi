import { Router, Request, Response } from 'express';
import { legalRetrievalService } from '../services/legalRetrievalService';
import legalHelpData from '../data/legalHelp.json';

const router = Router();

router.get('/legal-sources', (req: Request, res: Response) => {
  const { category, jurisdiction } = req.query;
  if (category) {
    const sources = legalRetrievalService.getSourcesByCategory(
      category as string,
      jurisdiction as string
    );
    return res.json({ success: true, count: sources.length, data: sources });
  }
  const all = legalRetrievalService.getSources();
  res.json({ success: true, count: all.length, data: all });
});

router.get('/legal-help', (req: Request, res: Response) => {
  const { state, district } = req.query;
  let resources = legalHelpData;

  if (state && state !== 'All') {
    resources = resources.filter(
      (r) => r.state.toLowerCase() === (state as string).toLowerCase() || r.state === 'All India'
    );
  }

  if (district && district !== 'All') {
    resources = resources.filter(
      (r) =>
        r.district.toLowerCase() === (district as string).toLowerCase() ||
        r.district === 'All Districts'
    );
  }

  res.json({ success: true, count: resources.length, data: resources });
});

export default router;
