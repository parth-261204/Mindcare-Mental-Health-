import { resolve } from 'node:path';
import { ArticleRepository } from './articles/ArticleRepository.js';
import { ArticleService } from './articles/ArticleService.js';

const sendJson = (res, status, value) => { res.statusCode = status; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(value)); };

export function createApiPlugin(env) {
  const articles = new ArticleService({ repository: new ArticleRepository(env.ARTICLES_DATABASE_PATH || resolve('data/articles.json')), apiKey: env.NEWS_API_KEY });
  return {
    name: 'mindcare-api',
    configureServer(server) {
      server.middlewares.use('/api/articles', async (req, res) => {
        if (req.method !== 'GET') return sendJson(res, 405, { error: 'Method not allowed.' });
        try {
          const query = new URL(req.url, 'http://localhost').searchParams;
          const result = await articles.list(Object.fromEntries(query));
          sendJson(res, 200, result);
        } catch (error) { sendJson(res, 503, { error: error.message || 'Unable to load articles.' }); }
      });
      const timer = setInterval(() => { articles.refresh().catch(() => {}); }, 30 * 60 * 1000);
      timer.unref();
    },
  };
}
