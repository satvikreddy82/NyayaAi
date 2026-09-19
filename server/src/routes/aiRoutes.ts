import { Router, Request, Response } from 'express';
import { getAIProvider } from '../providers/geminiProvider';
import { legalRetrievalService } from '../services/legalRetrievalService';
import { GLOBAL_SYSTEM_INSTRUCTION } from '../utils/prompts';

const router = Router();

router.get(['/status', '/ai/status'], (req: Request, res: Response) => {
  const provider = getAIProvider();
  res.json({
    success: true,
    provider: provider.name,
    isMock: provider.isMock
  });
});

router.post(['/chat', '/ai/chat'], async (req: Request, res: Response, next) => {
  try {
    const { query, category, language } = req.body;
    if (!query) {
      return res.status(400).json({ success: false, error: 'Query is required' });
    }

    const sources = legalRetrievalService.getSourcesByCategory(category || 'other');
    const provider = getAIProvider();

    if (provider.isMock) {
      return res.json({
        success: true,
        response: `Based on verified Indian legal provisions and official guidelines:
- For this matter, you may review applicable statutory provisions under ${sources[0]?.title || 'relevant Indian laws'}.
- Always consider obtaining direct pre-litigation assistance through the District Legal Services Authority (DLSA) or dialing the 24x7 NALSA helpline at 15100.
- Note: This constitutes legal information, not formal advocate representation.`,
        sources,
        isMock: true
      });
    }

    const prompt = `${GLOBAL_SYSTEM_INSTRUCTION}
User Query: "${query}"
Approved Verified Sources:
${JSON.stringify(sources, null, 2)}

Provide a concise, empathetic, source-backed answer in language "${language || 'en'}".
Do not invent laws or citations.`;

    const responseText = await (provider as any).callGemini(prompt);
    res.json({
      success: true,
      response: responseText,
      sources,
      isMock: false
    });
  } catch (err) {
    next(err);
  }
});

export default router;
