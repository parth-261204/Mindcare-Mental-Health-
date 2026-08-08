import express from 'express';
import cors from 'cors';
import process from 'node:process';
import { resolve } from 'node:path';
import { ArticleRepository } from './server/articles/ArticleRepository.js';
import { ArticleService } from './server/articles/ArticleService.js';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*'
}));
app.use(express.json());

app.use((req, res, next) => {
  if (req.method === 'GET' && req.path.startsWith('/api/')) {
    res.set('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=600');
  }
  next();
});

// Initialize Article Service
const articles = new ArticleService({
  repository: new ArticleRepository(process.env.ARTICLES_DATABASE_PATH || resolve('data/articles.json')),
  apiKey: process.env.NEWS_API_KEY
});

// Refresh articles periodically
const timer = setInterval(() => { articles.refresh().catch(() => {}); }, 30 * 60 * 1000);
timer.unref();

// Articles Route
app.get('/api/articles', async (req, res) => {
  try {
    const query = req.query;
    const result = await articles.list(query);
    res.status(200).json(result);
  } catch (error) {
    res.status(503).json({ error: error.message || 'Unable to load articles.' });
  }
});

// Chatbot Route
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error('A message is required.');
    }

    let response;
    let data;
    for (const model of ['gemini-3.5-flash', 'gemini-3.5-flash-lite']) {
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': process.env.CHATBOT_API_KEY,
          },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{
                text: 'You are Mindcare, a supportive mental-health information chatbot. Answer the user\'s question directly and conversationally. Do not diagnose or replace a clinician. Encourage emergency services or a local crisis line if the user is in immediate danger, plans to harm themselves or someone else, or cannot stay safe. Keep replies concise, compassionate, and practical.',
              }],
            },
            contents: messages.map(({ role, text }) => ({
              role: role === 'bot' ? 'model' : 'user',
              parts: [{ text }],
            })),
            generationConfig: { temperature: 0.7, maxOutputTokens: 700 },
          }),
        },
      );
      data = await response.json();
      if (response.ok || ![429, 503].includes(response.status)) break;
    }
    if (!response.ok) {
      throw new Error(data?.error?.message || 'Gemini could not answer right now.');
    }

    const text = data?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || '')
      .join('')
      .trim();
    if (!text) throw new Error('Gemini returned an empty response.');

    res.status(200).json({ text });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Unable to answer right now.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
