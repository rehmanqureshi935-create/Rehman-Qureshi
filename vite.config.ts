import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { GoogleGenAI } from '@google/genai';

function expressApiPlugin() {
  return {
    name: 'express-api-plugin',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (req.url === '/api/explain-mistake' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => (body += chunk));
          req.on('end', async () => {
            let data: any = {};
            try {
              data = JSON.parse(body);
              const apiKey = process.env.GEMINI_API_KEY;
              if (!apiKey) {
                res.setHeader('Content-Type', 'application/json');
                return res.end(
                  JSON.stringify({
                    success: true,
                    source: 'fallback',
                    explanation: `Here is why option "${data.studentAnswer}" is incorrect: In ${data.subjectName} (${data.topicName}), ${data.questionText} requires checking fundamental principles. The correct answer is "${data.correctAnswer}".`,
                    keyTip: `Focus on reviewing key formulas in ${data.topicName}.`,
                  })
                );
              }

              const ai = new GoogleGenAI({ apiKey });
              const prompt = `You are a supportive, expert tutor for Pakistani board exam students (${data.subjectName} - ${data.topicName}).
A student attempted this MCQ and answered INCORRECTLY.

Question: "${data.questionText}"
Options: ${JSON.stringify(data.options)}
Student's Selected Answer: "${data.studentAnswer}"
Correct Answer: "${data.correctAnswer}"

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
              const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
              const parsed = JSON.parse(cleanJson);

              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  success: true,
                  source: 'gemini',
                  explanation: parsed.explanation,
                  keyTip: parsed.keyTip,
                })
              );
            } catch (err: any) {
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  success: true,
                  source: 'fallback',
                  explanation: `In ${data?.subjectName || 'this subject'} (${data?.topicName || 'this topic'}), the correct answer is "${data?.correctAnswer}". Double-check the fundamental concepts in your textbook.`,
                  keyTip: `Review ${data?.topicName || 'topic'} key definitions and solved examples.`,
                })
              );
            }
          });
          return;
        }

        if (req.url === '/api/generate-similar-question' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => (body += chunk));
          req.on('end', async () => {
            let data: any = {};
            try {
              data = JSON.parse(body);
              const apiKey = process.env.GEMINI_API_KEY;
              if (!apiKey) {
                res.setHeader('Content-Type', 'application/json');
                return res.end(
                  JSON.stringify({
                    success: true,
                    source: 'fallback',
                    question: {
                      id: `sim_${Date.now()}`,
                      board: 'Federal Board',
                      classLevel: '12',
                      subjectId: 'sub_physics',
                      chapterId: 'chap_phy_7',
                      topicId: 'top_ac_gen',
                      topicName: data.topicName || 'General',
                      questionText: `Similar practice question for ${data.topicName}: What is the primary governing factor in ${data.topicName}?`,
                      options: [
                        'Rate of change of magnetic flux',
                        'Static capacitance',
                        'Direct current resistance',
                        'Thermal dissipation',
                      ],
                      correctOptionIndex: 0,
                      explanation: `Rate of change of magnetic flux governs induced EMF in ${data.topicName}.`,
                      difficulty: data.difficulty || 'Medium',
                    },
                  })
                );
              }

              const ai = new GoogleGenAI({ apiKey });
              const prompt = `Generate a single new multiple-choice question (MCQ) similar in topic and difficulty to this original question:
Original Question: "${data.questionText}"
Topic: "${data.topicName}"
Subject: "${data.subjectName}"
Difficulty: "${data.difficulty || 'Medium'}"

Output raw JSON with these exact fields:
- "questionText": string
- "options": array of 4 distinct string choices
- "correctOptionIndex": integer 0, 1, 2, or 3
- "explanation": 1-2 sentence concise explanation
- "difficulty": "${data.difficulty || 'Medium'}"

Return ONLY raw JSON without markdown formatting.`;

              const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
              });

              const text = response.text || '';
              const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
              const parsed = JSON.parse(cleanJson);

              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  success: true,
                  source: 'gemini',
                  question: {
                    id: `gen_${Date.now()}`,
                    board: 'Federal Board',
                    classLevel: '12',
                    subjectId: 'sub_physics',
                    chapterId: 'chap_phy_7',
                    topicId: 'top_ac_gen',
                    topicName: data.topicName || 'General',
                    questionText: parsed.questionText,
                    options: parsed.options,
                    correctOptionIndex: parsed.correctOptionIndex,
                    explanation: parsed.explanation,
                    difficulty: parsed.difficulty || 'Medium',
                  },
                })
              );
            } catch (err: any) {
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  success: true,
                  source: 'fallback',
                  question: {
                    id: `sim_err_${Date.now()}`,
                    board: 'Federal Board',
                    classLevel: '12',
                    subjectId: 'sub_physics',
                    chapterId: 'chap_phy_7',
                    topicId: 'top_ac_gen',
                    topicName: 'Topic Practice',
                    questionText: `Practice Question: Which condition optimizes efficiency in ${data?.topicName || 'this topic'}?`,
                    options: [
                      'Operating at resonance frequency',
                      'Increasing internal resistance',
                      'Reducing magnetic field strength',
                      'Decreasing wire cross-section',
                    ],
                    correctOptionIndex: 0,
                    explanation: 'Resonance minimizes impedance and optimizes efficiency.',
                    difficulty: 'Medium',
                  },
                })
              );
            }
          });
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), expressApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
