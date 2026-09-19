import { Source, CaseCategory } from '../../../shared/types';
import legalSources from '../data/legalSources.json';

export class LegalRetrievalService {
  private sources: Source[] = legalSources as Source[];

  public getSources(): Source[] {
    return this.sources;
  }

  public getSourcesByCategory(category: CaseCategory | string, jurisdiction?: string): Source[] {
    let matches = this.sources.filter((s) => {
      if (s.topic.toLowerCase() === category.toLowerCase()) return true;
      if (category === 'rental' && s.id.includes('tenancy')) return true;
      if (category === 'employment' && s.id.includes('wages')) return true;
      if (category === 'consumer' && s.id.includes('consumer')) return true;
      if (category === 'cybercrime' && s.id.includes('cybercrime')) return true;
      return false;
    });

    // If jurisdiction includes Tamil Nadu, prioritize TN laws
    if (jurisdiction && jurisdiction.toLowerCase().includes('tamil nadu')) {
      matches = matches.sort((a, b) => {
        const aTN = a.jurisdiction.toLowerCase().includes('tamil nadu') ? 1 : 0;
        const bTN = b.jurisdiction.toLowerCase().includes('tamil nadu') ? 1 : 0;
        return bTN - aTN;
      });
    }

    // Always include NALSA legal aid source for public awareness
    const nalsa = this.sources.find((s) => s.id === 'src-nalsa-legal-aid-1987');
    if (nalsa && !matches.some((m) => m.id === nalsa.id)) {
      matches.push(nalsa);
    }

    return matches;
  }

  public getSourceById(id: string): Source | undefined {
    return this.sources.find((s) => s.id === id);
  }
}

export const legalRetrievalService = new LegalRetrievalService();
