import { Router, Request, Response } from 'express';
import { caseService } from '../services/caseService';
import { adaptiveQuestionService } from '../services/adaptiveQuestionService';
import { db } from '../models/db';

const router = Router();

// Demo mode loader
router.post('/demo/load', async (req: Request, res: Response, next) => {
  try {
    const demo = await caseService.loadDemoCase();
    res.json({ success: true, data: demo });
  } catch (err) {
    next(err);
  }
});

// Create Case
router.post('/cases', async (req: Request, res: Response, next) => {
  try {
    const caseData = await caseService.createCase(req.body);
    res.status(201).json({ success: true, data: caseData });
  } catch (err) {
    next(err);
  }
});

// List Cases
router.get('/cases', async (req: Request, res: Response, next) => {
  try {
    const cases = await caseService.getCases();
    res.json({ success: true, count: cases.length, data: cases });
  } catch (err) {
    next(err);
  }
});

// Get Case by ID
router.get('/cases/:id', async (req: Request, res: Response, next) => {
  try {
    const caseItem = await caseService.getCaseById(req.params.id);
    if (!caseItem) {
      return res.status(404).json({ success: false, error: 'Case not found' });
    }

    const evidence = await db.getEvidenceByCase(caseItem.id);
    const timeline = await db.getTimelineByCase(caseItem.id);
    const documents = await db.getDocumentsByCase(caseItem.id);
    const generatedDocuments = await db.getGeneratedDocumentsByCase(caseItem.id);

    res.json({
      success: true,
      data: {
        ...caseItem,
        evidence,
        timeline,
        documents,
        generatedDocuments
      }
    });
  } catch (err) {
    next(err);
  }
});

// Delete Case
router.delete('/cases/:id', async (req: Request, res: Response, next) => {
  try {
    const deleted = await caseService.deleteCase(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Case not found or already deleted' });
    }
    res.json({ success: true, message: 'Case and all associated records permanently deleted' });
  } catch (err) {
    next(err);
  }
});

// Get Adaptive Questions
router.post('/cases/:id/questions', async (req: Request, res: Response, next) => {
  try {
    const caseItem = await caseService.getCaseById(req.params.id);
    if (!caseItem) {
      return res.status(404).json({ success: false, error: 'Case not found' });
    }

    const answers = req.body.answers || {};
    const questions = adaptiveQuestionService.getQuestionsForCategory(caseItem.category);
    const nextQuestion = adaptiveQuestionService.getNextQuestion(caseItem.category, answers);

    res.json({
      success: true,
      totalQuestions: questions.length,
      questions,
      nextQuestion
    });
  } catch (err) {
    next(err);
  }
});

// Analyze Case
router.post('/cases/:id/analyze', async (req: Request, res: Response, next) => {
  try {
    const { answers, language } = req.body;
    const analysis = await caseService.analyzeCase(
      req.params.id,
      answers || {},
      language || 'en'
    );
    res.json({ success: true, data: analysis });
  } catch (err) {
    next(err);
  }
});

// Generate Action Plan
router.post('/cases/:id/action-plan', async (req: Request, res: Response, next) => {
  try {
    const { language } = req.body;
    const plan = await caseService.generateActionPlan(req.params.id, language || 'en');
    res.json({ success: true, data: plan });
  } catch (err) {
    next(err);
  }
});

export default router;
