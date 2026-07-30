import { createHash } from 'node:crypto';

export const ARTICLE_CATEGORIES = [
  'Anxiety', 'Depression', 'Stress', 'Burnout', 'PTSD', 'OCD', 'ADHD', 'Therapy',
  'Self Care', 'Meditation', 'Psychology', 'Sleep', 'Relationships',
  'Workplace Mental Health', 'Research',
];

const CATEGORY_KEYWORDS = {
  Anxiety: ['anxiety', 'anxious', 'panic', 'worry'],
  Depression: ['depression', 'depressed', 'low mood', 'suicide prevention'],
  Stress: ['stress', 'stressed'], Burnout: ['burnout', 'exhaustion'],
  PTSD: ['ptsd', 'trauma', 'traumatic stress'], OCD: ['ocd', 'obsessive', 'compulsive'],
  ADHD: ['adhd', 'attention deficit', 'neurodiversity'], Therapy: ['therapy', 'therapist', 'counselling', 'counseling'],
  'Self Care': ['self care', 'self-care', 'wellbeing', 'mental wellness'],
  Meditation: ['meditation', 'mindfulness', 'breathing'], Psychology: ['psychology', 'psychological'],
  Sleep: ['sleep', 'insomnia'], Relationships: ['relationship', 'loneliness', 'social connection'],
  'Workplace Mental Health': ['workplace', 'work stress', 'work-life', 'employee'],
  Research: ['research', 'study finds', 'clinical trial', 'scientists'],
};
const SEARCH_QUERY = '("mental health" OR anxiety OR depression OR therapy OR stress OR psychology OR wellbeing OR burnout OR PTSD OR OCD OR ADHD OR mindfulness OR "emotional wellbeing" OR "suicide prevention" OR "mental wellness")';
const MENTAL_HEALTH_KEYWORDS = Object.values(CATEGORY_KEYWORDS).flat().concat(['mental health', 'mental wellness', 'emotional wellbeing', 'well-being']);
const TRUSTED_DOMAINS = 'bbc.com,psychologytoday.com,medicalnewstoday.com,healthline.com,nih.gov,who.int';
const CACHE_DURATION_MS = 30 * 60 * 1000;

const cleanText = (value = '') => String(value).replace(/<[^>]*>/g, ' ').split('').filter((character) => character.charCodeAt(0) >= 32 && character.charCodeAt(0) !== 127).join('').replace(/\s+/g, ' ').trim();
const summaryFor = (description, content) => {
  const text = cleanText(description || content);
  return text.length > 480 ? `${text.slice(0, 477).replace(/\s+\S*$/, '')}…` : text;
};
const categoryFor = (article) => {
  const haystack = `${article.title} ${article.description} ${article.content}`.toLowerCase();
  return ARTICLE_CATEGORIES.find((category) => CATEGORY_KEYWORDS[category].some((keyword) => haystack.includes(keyword))) || 'Psychology';
};
const readingTimeFor = (content) => Math.max(1, Math.ceil(cleanText(content).split(/\s+/).filter(Boolean).length / 200));
const articleId = (url) => createHash('sha256').update(url).digest('hex').slice(0, 20);
const isRelevant = (article) => MENTAL_HEALTH_KEYWORDS.some((keyword) => `${article.title} ${article.description} ${article.content}`.toLowerCase().includes(keyword));

export class ArticleService {
  constructor({ repository, apiKey, fetchImpl = fetch, now = () => Date.now() }) {
    this.repository = repository;
    this.apiKey = apiKey;
    this.fetch = fetchImpl;
    this.now = now;
    this.refreshPromise = null;
  }

  async list({ page = 1, limit = 12, category = '', search = '', sort = 'latest', date = '' } = {}) {
    const cache = await this.ensureFresh();
    const normalizedSearch = cleanText(search).toLowerCase().slice(0, 80);
    const filtered = cache.articles
      .filter(isRelevant)
      .filter((article) => !category || article.category.toLowerCase() === category.toLowerCase())
      .filter((article) => !normalizedSearch || `${article.title} ${article.summary} ${article.category} ${article.source}`.toLowerCase().includes(normalizedSearch))
      .filter((article) => this.matchesDate(article.publishedAt, date))
      .sort((a, b) => sort === 'oldest' ? Date.parse(a.publishedAt) - Date.parse(b.publishedAt) : Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
    const safeLimit = Math.min(Math.max(Number(limit) || 12, 1), 24);
    const safePage = Math.max(Number(page) || 1, 1);
    return {
      articles: filtered.slice((safePage - 1) * safeLimit, safePage * safeLimit),
      pagination: { page: safePage, limit: safeLimit, total: filtered.length, totalPages: Math.max(1, Math.ceil(filtered.length / safeLimit)) },
      refreshedAt: cache.refreshedAt,
      categories: ARTICLE_CATEGORIES,
    };
  }

  async refresh() {
    if (this.refreshPromise) return this.refreshPromise;
    this.refreshPromise = this.fetchAndCache().finally(() => { this.refreshPromise = null; });
    return this.refreshPromise;
  }

  async ensureFresh() {
    const cache = await this.repository.read();
    if (cache.articles.length && cache.refreshedAt && this.now() - Date.parse(cache.refreshedAt) < CACHE_DURATION_MS) return cache;
    try { return await this.refresh(); } catch (error) {
      if (cache.articles.length) return cache;
      throw error;
    }
  }

  async fetchAndCache() {
    if (!this.apiKey) throw new Error('Article service is not configured. Add NEWS_API_KEY on the server.');
    const from = new Date(this.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const url = new URL('https://newsapi.org/v2/everything');
    url.search = new URLSearchParams({ q: SEARCH_QUERY, domains: TRUSTED_DOMAINS, language: 'en', sortBy: 'publishedAt', pageSize: '100', from }).toString();
    let response;
    try {
      response = await this.fetch(url, { headers: { 'X-Api-Key': this.apiKey }, signal: AbortSignal.timeout(10_000) });
    } catch { throw new Error('Unable to reach the news provider.'); }
    let payload;
    try { payload = await response.json(); } catch { throw new Error('The news provider returned malformed data.'); }
    if (!response.ok || payload.status !== 'ok') {
      const code = payload.code === 'apiKeyInvalid' ? 'Invalid NewsAPI key.' : payload.code === 'rateLimited' ? 'News provider rate limit reached.' : 'News provider request failed.';
      throw new Error(code);
    }
    const seen = new Set();
    const articles = (payload.articles || []).map((article) => this.normalize(article)).filter(Boolean).filter(isRelevant).filter((article) => {
      if (seen.has(article.url)) return false;
      seen.add(article.url);
      return true;
    }).sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
    return this.repository.replace(articles);
  }

  normalize(article) {
    if (!article || !article.url || !article.urlToImage || !article.title || !article.publishedAt || article.title === '[Removed]') return null;
    try { new URL(article.url); new URL(article.urlToImage); } catch { return null; }
    const title = cleanText(article.title);
    const description = cleanText(article.description);
    const content = cleanText(article.content);
    if (!title || (!description && !content)) return null;
    return {
      id: articleId(article.url), title, description, content, summary: summaryFor(description, content),
      author: cleanText(article.author), source: cleanText(article.source?.name) || 'Trusted news source', image: article.urlToImage,
      url: article.url, publishedAt: new Date(article.publishedAt).toISOString(), category: categoryFor({ title, description, content }),
      readingTime: readingTimeFor(content || description), language: 'en', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
  }

  matchesDate(publishedAt, date) {
    if (!date) return true;
    const age = this.now() - Date.parse(publishedAt);
    return (date === 'today' && age <= 24 * 60 * 60 * 1000) || (date === 'week' && age <= 7 * 24 * 60 * 60 * 1000) || (date === 'month' && age <= 31 * 24 * 60 * 60 * 1000);
  }
}
