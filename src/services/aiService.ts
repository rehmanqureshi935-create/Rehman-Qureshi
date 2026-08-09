import { Question } from '../types/exam';

export interface ExplainMistakeResult {
  success: boolean;
  explanation: string;
  keyTip: string;
  source: 'gemini' | 'fallback';
}

export interface GenerateSimilarQuestionResult {
  success: boolean;
  question: Question;
  source: 'gemini' | 'fallback';
}

export async function explainMistakeWithAI(
  question: Question,
  studentAnswer: string,
  subjectName: string
): Promise<ExplainMistakeResult> {
  const correctAnswer = question.options[question.correctOptionIndex];

  try {
    const response = await fetch('/api/explain-mistake', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        questionText: question.questionText,
        options: question.options,
        studentAnswer,
        correctAnswer,
        topicName: question.topicName,
        subjectName,
      }),
    });

    if (!response.ok) {
      throw new Error('Server returned non-ok status');
    }

    const data = await response.json();
    return {
      success: true,
      explanation: data.explanation || question.explanation,
      keyTip: data.keyTip || `Focus on reviewing key formulas in ${question.topicName}.`,
      source: data.source || 'fallback',
    };
  } catch (err) {
    console.warn('AI Explanation call error, using local fallback:', err);
    return {
      success: true,
      explanation: `You selected "${studentAnswer}". In ${question.topicName}, the correct answer is "${correctAnswer}". ${question.explanation}`,
      keyTip: `Review the core definitions and formulas in ${question.topicName}.`,
      source: 'fallback',
    };
  }
}

export async function generateSimilarQuestionWithAI(
  question: Question,
  subjectName: string
): Promise<GenerateSimilarQuestionResult> {
  try {
    const response = await fetch('/api/generate-similar-question', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        questionText: question.questionText,
        topicName: question.topicName,
        subjectName,
        difficulty: question.difficulty,
      }),
    });

    if (!response.ok) {
      throw new Error('Server returned non-ok status');
    }

    const data = await response.json();
    const genQ = data.question;

    return {
      success: true,
      question: {
        id: genQ.id || `sim_${Date.now()}`,
        board: question.board,
        classLevel: question.classLevel,
        subjectId: question.subjectId,
        chapterId: question.chapterId,
        topicId: question.topicId,
        topicName: question.topicName,
        questionText: genQ.questionText,
        options: genQ.options as [string, string, string, string],
        correctOptionIndex: genQ.correctOptionIndex ?? 0,
        explanation: genQ.explanation || 'Similar concept review question.',
        difficulty: question.difficulty,
      },
      source: data.source || 'fallback',
    };
  } catch (err) {
    console.warn('AI Similar Question call error, using local fallback:', err);
    return {
      success: true,
      question: {
        id: `sim_local_${Date.now()}`,
        board: question.board,
        classLevel: question.classLevel,
        subjectId: question.subjectId,
        chapterId: question.chapterId,
        topicId: question.topicId,
        topicName: question.topicName,
        questionText: `Follow-up Practice (${question.topicName}): Which factor primarily governs the magnitude of the outcome?`,
        options: [
          'The rate of change of the primary variable',
          'The constant baseline temperature',
          'The atmospheric pressure',
          'The ambient humidity',
        ],
        correctOptionIndex: 0,
        explanation: 'The rate of change directly governs the induced magnitude according to the fundamental law.',
        difficulty: question.difficulty,
      },
      source: 'fallback',
    };
  }
}
