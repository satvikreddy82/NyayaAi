import { Question, CaseCategory } from '../../../shared/types';
import questionTemplates from '../data/questionTemplates.json';

export class AdaptiveQuestionService {
  private templates: Record<string, Question[]> = questionTemplates as any;

  public getQuestionsForCategory(category: CaseCategory): Question[] {
    const questions = this.templates[category] || this.templates['other'] || [];
    return questions.map((q, idx) => ({
      ...q,
      stepIndex: idx + 1,
      totalSteps: questions.length
    }));
  }

  public getNextQuestion(
    category: CaseCategory,
    existingAnswers: Record<string, string>
  ): Question | null {
    const list = this.getQuestionsForCategory(category);
    for (const q of list) {
      if (!existingAnswers[q.id]) {
        return q;
      }
    }
    return null; // All answered
  }
}

export const adaptiveQuestionService = new AdaptiveQuestionService();
