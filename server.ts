import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Gemini API setup
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

// API Endpoint 1: Explain Mistake
app.post('/api/explain-mistake', async (req, res) => {
  try {
    const { questionText, options, studentAnswer, correctAnswer, topicName, subjectName } = req.body;

    const ai = getGenAI();
    if (!ai) {
      return res.json({
        success: true,
        source: 'fallback',
        explanation: `Here is why option "${studentAnswer}" is incorrect: In ${subjectName} (${topicName}), ${questionText} requires checking fundamental principles. The correct answer is "${correctAnswer}". Remember to double-check the formula or definition!`,
        keyTip: `Focus on reviewing key formulas in ${topicName}.`,
      });
    }

    const prompt = `You are a supportive, expert tutor for Pakistani board exam students (${subjectName} - ${topicName}).
A student attempted this MCQ and answered INCORRECTLY.

Question: "${questionText}"
Options: ${JSON.stringify(options)}
Student's Selected Answer: "${studentAnswer}"
Correct Answer: "${correctAnswer}"

Please provide a concise, encouraging, and crystal-clear explanation for the student.
Format your output as JSON with two fields:
"explanation": 2-3 short, student-friendly sentences explaining why their chosen answer was incorrect and why the correct answer is right.
"keyTip": 1 actionable study tip or rule to remember for this topic.

Return ONLY raw JSON, no markdown code blocks.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text || '';
    let parsed;
    try {
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleanJson);
    } catch {
      parsed = {
        explanation: text || `The correct answer is "${correctAnswer}". Make sure to review ${topicName} principles carefully.`,
        keyTip: `Revise ${topicName} concepts in your textbook.`,
      };
    }

    return res.json({
      success: true,
      source: 'gemini',
      explanation: parsed.explanation,
      keyTip: parsed.keyTip,
    });
  } catch (error: any) {
    console.error('Error calling Gemini for explanation:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate explanation',
    });
  }
});

// API Endpoint 2: Generate Similar Question
app.post('/api/generate-similar-question', async (req, res) => {
  try {
    const { questionText, topicName, subjectName, difficulty } = req.body;

    const ai = getGenAI();
    if (!ai) {
      return res.json({
        success: true,
        source: 'fallback',
        question: {
          id: `sim_${Date.now()}`,
          board: 'Federal Board',
          classLevel: '12',
          subjectId: 'sub_physics',
          chapterId: 'chap_phy_7',
          topicId: 'top_ac_gen',
          topicName: topicName || 'General',
          questionText: `Practice Question for ${topicName}: What is the key working principle behind ${topicName}?`,
          options: [
            'Electromagnetic Induction',
            'Electrostatic Attraction',
            'Gravitational Pull',
            'Photoelectric Effect',
          ],
          correctOptionIndex: 0,
          explanation: `Electromagnetic induction is the core operating mechanism for ${topicName}.`,
          difficulty: difficulty || 'Medium',
        },
      });
    }

    const prompt = `Generate a single new multiple-choice question (MCQ) similar in topic and difficulty to this original question:
Original Question: "${questionText}"
Topic: "${topicName}"
Subject: "${subjectName}"
Difficulty: "${difficulty || 'Medium'}"

Output raw JSON with these exact fields:
- "questionText": string
- "options": array of 4 distinct string choices
- "correctOptionIndex": integer 0, 1, 2, or 3
- "explanation": 1-2 sentence concise explanation
- "difficulty": "${difficulty || 'Medium'}"

Return ONLY raw JSON without markdown formatting.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text || '';
    let parsed;
    try {
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleanJson);
    } catch {
      parsed = {
        questionText: `Which factor directly influences ${topicName}?`,
        options: [
          'Rate of change of magnetic flux',
          'Temperature of the conductor',
          'Atmospheric pressure',
          'Static electric charge',
        ],
        correctOptionIndex: 0,
        explanation: `The rate of change of magnetic flux governs induced EMF in ${topicName}.`,
        difficulty: difficulty || 'Medium',
      };
    }

    return res.json({
      success: true,
      source: 'gemini',
      question: {
        id: `gen_${Date.now()}`,
        board: 'Federal Board',
        classLevel: '12',
        subjectId: 'sub_physics',
        chapterId: 'chap_phy_7',
        topicId: 'top_ac_gen',
        topicName: topicName || 'General',
        questionText: parsed.questionText,
        options: parsed.options,
        correctOptionIndex: parsed.correctOptionIndex,
        explanation: parsed.explanation,
        difficulty: parsed.difficulty || 'Medium',
      },
    });
  } catch (error: any) {
    console.error('Error generating similar question:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate similar question',
    });
  }
});

// Serve static assets in production
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
