import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

/**
 * A small persistent repository boundary. Replace this implementation with a
 * Postgres/Mongo adapter in production without changing the article service.
 */
export class ArticleRepository {
  constructor(filePath) {
    this.filePath = resolve(filePath);
  }

  async read() {
    try {
      const data = JSON.parse(await readFile(this.filePath, 'utf8'));
      return { articles: Array.isArray(data.articles) ? data.articles : [], refreshedAt: data.refreshedAt || null };
    } catch (error) {
      if (error.code === 'ENOENT') return { articles: [], refreshedAt: null };
      throw new Error('The article cache could not be read.');
    }
  }

  async replace(articles) {
    await mkdir(dirname(this.filePath), { recursive: true });
    const temporaryPath = `${this.filePath}.tmp`;
    const payload = JSON.stringify({ articles, refreshedAt: new Date().toISOString() }, null, 2);
    await writeFile(temporaryPath, payload, 'utf8');
    await rename(temporaryPath, this.filePath);
    return this.read();
  }
}
