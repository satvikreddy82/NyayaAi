import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { Case, Evidence, TimelineEvent, LegalDocument, GeneratedDocument, User } from '../../../shared/types';

interface MemoryStore {
  users: Record<string, User>;
  cases: Record<string, Case>;
  evidence: Record<string, Evidence>;
  timeline: Record<string, TimelineEvent>;
  documents: Record<string, LegalDocument>;
  generatedDocuments: Record<string, GeneratedDocument>;
}

// On Vercel serverless, use /tmp (writable) — data resets on cold start.
// For production persistence, set MONGODB_URI to a MongoDB Atlas connection string.
const IS_VERCEL = process.env.VERCEL === '1' || process.env.VERCEL_ENV !== undefined;
const STORE_PATH = IS_VERCEL
  ? '/tmp/nyayaai-store.json'
  : path.join(__dirname, '../../data/store.json');


class DatabaseService {
  private isMongoConnected = false;
  private store: MemoryStore = {
    users: {},
    cases: {},
    evidence: {},
    timeline: {},
    documents: {},
    generatedDocuments: {}
  };

  constructor() {
    this.loadStoreFromDisk();
  }

  private loadStoreFromDisk() {
    try {
      if (fs.existsSync(STORE_PATH)) {
        const raw = fs.readFileSync(STORE_PATH, 'utf-8');
        this.store = JSON.parse(raw);
      } else {
        this.saveStoreToDisk();
      }
    } catch (err) {
      console.warn('[DB Fallback] Initializing fresh local memory store');
    }
  }

  private saveStoreToDisk() {
    try {
      const dir = path.dirname(STORE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(STORE_PATH, JSON.stringify(this.store, null, 2), 'utf-8');
    } catch (err) {
      console.error('[DB Fallback] Error saving store to disk:', err);
    }
  }

  public async initialize(mongoUri?: string) {
    if (mongoUri && !process.env.USE_LOCAL_DB) {
      try {
        await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
        this.isMongoConnected = true;
        console.log('[DB] Successfully connected to MongoDB:', mongoUri);
        return;
      } catch (err: any) {
        console.warn(`[DB] MongoDB connection failed (${err.message}). Activating local file-backed JSON store fallback.`);
      }
    } else {
      console.log('[DB] Operating in local file-backed JSON store mode.');
    }
    this.isMongoConnected = false;
  }

  public isUsingMongo(): boolean {
    return this.isMongoConnected;
  }

  // --- CASES ---
  public async getCases(): Promise<Case[]> {
    return Object.values(this.store.cases).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public async getCaseById(id: string): Promise<Case | null> {
    return this.store.cases[id] || null;
  }

  public async saveCase(c: Case): Promise<Case> {
    this.store.cases[c.id] = { ...c, updatedAt: new Date().toISOString() };
    this.saveStoreToDisk();
    return this.store.cases[c.id];
  }

  public async deleteCase(id: string): Promise<boolean> {
    if (this.store.cases[id]) {
      delete this.store.cases[id];
      // Clean up linked records
      Object.keys(this.store.evidence).forEach((k) => {
        if (this.store.evidence[k].caseId === id) delete this.store.evidence[k];
      });
      Object.keys(this.store.timeline).forEach((k) => {
        if (this.store.timeline[k].caseId === id) delete this.store.timeline[k];
      });
      Object.keys(this.store.documents).forEach((k) => {
        if (this.store.documents[k].caseId === id) delete this.store.documents[k];
      });
      Object.keys(this.store.generatedDocuments).forEach((k) => {
        if (this.store.generatedDocuments[k].caseId === id) delete this.store.generatedDocuments[k];
      });
      this.saveStoreToDisk();
      return true;
    }
    return false;
  }

  // --- EVIDENCE ---
  public async getEvidenceByCase(caseId: string): Promise<Evidence[]> {
    return Object.values(this.store.evidence).filter((e) => e.caseId === caseId);
  }

  public async saveEvidence(e: Evidence): Promise<Evidence> {
    this.store.evidence[e.id] = e;
    this.saveStoreToDisk();
    return e;
  }

  public async updateEvidence(id: string, updates: Partial<Evidence>): Promise<Evidence | null> {
    if (!this.store.evidence[id]) return null;
    this.store.evidence[id] = { ...this.store.evidence[id], ...updates };
    this.saveStoreToDisk();
    return this.store.evidence[id];
  }

  public async deleteEvidence(id: string): Promise<boolean> {
    if (this.store.evidence[id]) {
      delete this.store.evidence[id];
      this.saveStoreToDisk();
      return true;
    }
    return false;
  }

  // --- TIMELINE ---
  public async getTimelineByCase(caseId: string): Promise<TimelineEvent[]> {
    return Object.values(this.store.timeline).filter((t) => t.caseId === caseId);
  }

  public async saveTimelineEvent(t: TimelineEvent): Promise<TimelineEvent> {
    this.store.timeline[t.id] = t;
    this.saveStoreToDisk();
    return t;
  }

  // --- DOCUMENTS ---
  public async getDocumentsByCase(caseId: string): Promise<LegalDocument[]> {
    return Object.values(this.store.documents).filter((d) => d.caseId === caseId && !d.deletedAt);
  }

  public async getDocumentById(id: string): Promise<LegalDocument | null> {
    const doc = this.store.documents[id];
    if (doc && !doc.deletedAt) return doc;
    return null;
  }

  public async saveDocument(d: LegalDocument): Promise<LegalDocument> {
    this.store.documents[d.id] = d;
    this.saveStoreToDisk();
    return d;
  }

  public async deleteDocument(id: string): Promise<boolean> {
    if (this.store.documents[id]) {
      this.store.documents[id].deletedAt = new Date().toISOString();
      this.saveStoreToDisk();
      return true;
    }
    return false;
  }

  // --- GENERATED DOCUMENTS ---
  public async getGeneratedDocumentsByCase(caseId: string): Promise<GeneratedDocument[]> {
    return Object.values(this.store.generatedDocuments).filter((g) => g.caseId === caseId);
  }

  public async saveGeneratedDocument(g: GeneratedDocument): Promise<GeneratedDocument> {
    this.store.generatedDocuments[g.id] = g;
    this.saveStoreToDisk();
    return g;
  }
}

export const db = new DatabaseService();
