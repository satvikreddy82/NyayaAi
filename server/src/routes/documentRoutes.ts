import { Router, Request, Response } from 'express';
import { upload } from '../middleware/validation';
import { documentAnalysisService } from '../services/documentAnalysisService';
import { generatorService } from '../services/generatorService';
import { db } from '../models/db';
import { v4 as uuidv4 } from 'uuid';
import { LegalDocument, Evidence } from '../../../shared/types';

const router = Router();

// Upload Document
router.post('/documents/upload', upload.single('file'), async (req: Request, res: Response, next) => {
  try {
    const file = req.file;
    const { caseId, docType } = req.body;

    if (!file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const extractedText = await documentAnalysisService.extractTextFromBuffer(
      file.buffer,
      file.mimetype
    );

    const docId = `doc-${uuidv4().slice(0, 8)}`;
    const newDoc: LegalDocument = {
      id: docId,
      caseId: caseId || 'temp-case',
      name: file.originalname,
      type: docType || file.mimetype,
      extractedText,
      createdAt: new Date().toISOString()
    };

    await db.saveDocument(newDoc);

    // Also register as evidence if caseId provided
    if (caseId) {
      const evId = `ev-${uuidv4().slice(0, 8)}`;
      const newEv: Evidence = {
        id: evId,
        caseId,
        type: file.mimetype.startsWith('image/') ? 'image' : 'document',
        name: file.originalname,
        description: `Uploaded file (${(file.size / 1024).toFixed(1)} KB)`,
        verified: false,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        createdAt: new Date().toISOString()
      };
      await db.saveEvidence(newEv);
    }

    res.status(201).json({
      success: true,
      data: newDoc,
      extractedLength: extractedText.length
    });
  } catch (err) {
    next(err);
  }
});

// Analyze Document
router.post('/documents/:id/analyze', async (req: Request, res: Response, next) => {
  try {
    const { id } = req.params;
    const { language } = req.body;

    const doc = await db.getDocumentById(id);
    if (!doc) {
      return res.status(404).json({ success: false, error: 'Document not found' });
    }

    const analysis = await documentAnalysisService.analyzeDocumentText(
      doc.extractedText || '',
      doc.type,
      language || 'en'
    );

    doc.analysis = analysis;
    await db.saveDocument(doc);

    res.json({ success: true, data: analysis });
  } catch (err) {
    next(err);
  }
});

// Delete Document
router.delete('/documents/:id', async (req: Request, res: Response, next) => {
  try {
    const deleted = await db.deleteDocument(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Document not found or already deleted' });
    }
    res.json({ success: true, message: 'Document removed' });
  } catch (err) {
    next(err);
  }
});

// Generate Legal Notice / Grievance Document
router.post('/documents/generate', async (req: Request, res: Response, next) => {
  try {
    const { caseId, templateType, facts, language } = req.body;
    if (!templateType || !facts) {
      return res.status(400).json({ success: false, error: 'templateType and facts are required' });
    }

    const generated = await generatorService.generateDocument(
      caseId || 'temp-case',
      templateType,
      facts,
      language || 'en'
    );

    await db.saveGeneratedDocument(generated);

    res.status(201).json({ success: true, data: generated });
  } catch (err) {
    next(err);
  }
});

// Add Evidence Manually
router.post('/evidence', async (req: Request, res: Response, next) => {
  try {
    const { caseId, type, name, description, size } = req.body;
    if (!caseId || !name) {
      return res.status(400).json({ success: false, error: 'caseId and name are required' });
    }

    const newEv: Evidence = {
      id: `ev-${uuidv4().slice(0, 8)}`,
      caseId,
      type: type || 'other',
      name,
      description: description || '',
      verified: false,
      size: size || 'Manual Entry',
      createdAt: new Date().toISOString()
    };

    await db.saveEvidence(newEv);
    res.status(201).json({ success: true, data: newEv });
  } catch (err) {
    next(err);
  }
});

// Verify / Unverify Evidence
router.put('/evidence/:id/verify', async (req: Request, res: Response, next) => {
  try {
    const { verified } = req.body;
    const updated = await db.updateEvidence(req.params.id, {
      verified: Boolean(verified)
    });
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Evidence record not found' });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

export default router;
