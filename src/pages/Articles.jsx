import { useEffect, useMemo, useState } from 'react';
import { getArticles } from '../lib/articlesApi';

const dates = [['', 'Any time'], ['today', 'Today'], ['week', 'This week'], ['month', 'This month']];
const relativeDate = (value) => new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(value));

export default function Articles() {
  const [filters, setFilters] = useState({ page: 1, limit: 12, category: '', search: '', sort: 'latest', date: '' });
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState(() => JSON.parse(localStorage.getItem('mindcare-bookmarks') || '[]'));

  useEffect(() => {
    const controller = new AbortController();
    getArticles(filters).then((result) => { if (!controller.signal.aborted) setData(result); }).catch((reason) => { if (!controller.signal.aborted) setError(reason.message); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [filters]);

  const categories = useMemo(() => data?.categories || [], [data]);
  const update = (changes) => {
    setLoading(true); setError('');
    setFilters((current) => ({ ...current, ...changes, page: changes.page ?? 1 }));
  };
  const toggleBookmark = (id) => setBookmarks((current) => {
    const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
    localStorage.setItem('mindcare-bookmarks', JSON.stringify(next)); return next;
  });
  const share = async (article) => {
    if (navigator.share) { await navigator.share({ title: article.title, text: article.summary, url: article.url }); return; }
    await navigator.clipboard.writeText(article.url); window.alert('Article link copied to your clipboard.');
  };

  return <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <header className="max-w-3xl"><p className="text-sm font-semibold text-rose-600">Trusted sources, refreshed every 30 minutes</p><h1 className="mt-2 text-3xl font-semibold text-black">Latest mental health articles</h1><p className="mt-3 text-gray-800">Explore recent reporting and research from curated news sources. Articles open on the publisher’s website.</p></header>
    <div className="mt-8 rounded-xl border border-pink-200 bg-white p-4 shadow-sm"><div className="flex flex-col gap-3 md:flex-row"><input value={filters.search} onChange={(event) => update({ search: event.target.value })} placeholder="Search stress, sleep, therapy…" className="min-w-0 flex-1 rounded-lg border border-pink-300 px-4 py-2.5 text-black" /><select value={filters.sort} onChange={(event) => update({ sort: event.target.value })} className="rounded-lg border border-pink-300 px-3 py-2.5 text-black"><option value="latest">Latest first</option><option value="oldest">Oldest first</option></select><select value={filters.date} onChange={(event) => update({ date: event.target.value })} className="rounded-lg border border-pink-300 px-3 py-2.5 text-black">{dates.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1"><button onClick={() => update({ category: '' })} className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm ${!filters.category ? 'bg-rose-400 text-white' : 'bg-pink-50 text-black'}`}>All</button>{categories.map((category) => <button key={category} onClick={() => update({ category })} className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm ${filters.category === category ? 'bg-rose-400 text-white' : 'bg-pink-50 text-black'}`}>{category}</button>)}</div></div>
    {loading && <Skeleton />}
    {!loading && error && <section className="mt-8 rounded-xl border border-red-200 bg-red-50 p-6 text-red-900"><h2 className="font-semibold">Articles are unavailable right now</h2><p className="mt-2 text-sm">{error}</p><button onClick={() => update({})} className="mt-4 rounded-lg border border-red-300 px-4 py-2 font-medium">Try again</button></section>}
    {!loading && !error && data?.articles.length === 0 && <section className="mt-8 rounded-xl border border-pink-200 bg-white p-8 text-center"><h2 className="text-xl font-semibold">No matching articles</h2><p className="mt-2 text-gray-700">Try another search term, category, or date range.</p></section>}
    {!loading && !error && data?.articles.length > 0 && <><section className="mt-8"><Featured article={data.articles[0]} bookmarked={bookmarks.includes(data.articles[0].id)} onBookmark={toggleBookmark} onShare={share} /></section><section className="mt-10"><div className="flex items-end justify-between"><div><h2 className="text-2xl font-semibold">Latest articles</h2><p className="mt-1 text-sm text-gray-700">{data.pagination.total} results{data.refreshedAt ? ` · updated ${relativeDate(data.refreshedAt)}` : ''}</p></div><p className="hidden text-sm font-medium text-gray-700 sm:block">Trending: {data.articles.slice(1, 4).map((article) => article.category).filter((value, index, list) => list.indexOf(value) === index).join(' · ')}</p></div><div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{data.articles.slice(1).map((article) => <ArticleCard key={article.id} article={article} bookmarked={bookmarks.includes(article.id)} onBookmark={toggleBookmark} onShare={share} />)}</div></section><Pagination pagination={data.pagination} onPage={(page) => update({ page })} /></>}</div>;
}

function Featured({ article, bookmarked, onBookmark, onShare }) { return <article className="grid overflow-hidden rounded-2xl border border-pink-200 bg-white shadow-sm md:grid-cols-2"><img src={article.image} alt="" loading="eager" className="h-64 w-full object-cover md:h-full" /><div className="p-6"><p className="text-sm font-semibold text-rose-600">Featured · {article.category}</p><h2 className="mt-2 text-2xl font-semibold text-black">{article.title}</h2><p className="mt-3 text-sm leading-relaxed text-gray-800">{article.summary}</p><Meta article={article} /><Actions article={article} bookmarked={bookmarked} onBookmark={onBookmark} onShare={onShare} /></div></article>; }
function ArticleCard({ article, bookmarked, onBookmark, onShare }) { return <article className="overflow-hidden rounded-xl border border-pink-200 bg-white shadow-sm"><img src={article.image} alt="" loading="lazy" className="h-44 w-full object-cover" /><div className="p-5"><p className="text-xs font-semibold uppercase tracking-wide text-rose-600">{article.category}</p><h3 className="mt-2 text-lg font-semibold leading-snug text-black">{article.title}</h3><p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-800">{article.summary}</p><Meta article={article} /><Actions article={article} bookmarked={bookmarked} onBookmark={onBookmark} onShare={onShare} compact /></div></article>; }
function Meta({ article }) { return <p className="mt-4 text-xs text-gray-600">{article.source} · {relativeDate(article.publishedAt)} · {article.readingTime} min read</p>; }
function Actions({ article, bookmarked, onBookmark, onShare, compact }) { return <div className="mt-4 flex items-center gap-2"><a href={article.url} target="_blank" rel="noreferrer" className="rounded-lg bg-rose-400 px-3 py-2 text-sm font-medium text-white hover:bg-rose-500">Read more</a><button onClick={() => onBookmark(article.id)} aria-label="Bookmark article" className="rounded-lg border border-pink-300 px-3 py-2 text-sm text-black">{bookmarked ? '★' : '☆'}</button><button onClick={() => onShare(article)} aria-label="Share article" className="rounded-lg border border-pink-300 px-3 py-2 text-sm text-black">↗</button>{!compact && <span className="sr-only">{article.description}</span>}</div>; }
function Pagination({ pagination, onPage }) { return <nav aria-label="Article pages" className="mt-10 flex items-center justify-center gap-3"><button disabled={pagination.page === 1} onClick={() => onPage(pagination.page - 1)} className="rounded-lg border border-pink-300 px-4 py-2 disabled:opacity-40">Previous</button><span className="text-sm text-gray-700">Page {pagination.page} of {pagination.totalPages}</span><button disabled={pagination.page === pagination.totalPages} onClick={() => onPage(pagination.page + 1)} className="rounded-lg border border-pink-300 px-4 py-2 disabled:opacity-40">Next</button></nav>; }
function Skeleton() { return <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{[1, 2, 3, 4, 5, 6].map((item) => <div key={item} className="h-80 animate-pulse rounded-xl bg-pink-100" />)}</div>; }
