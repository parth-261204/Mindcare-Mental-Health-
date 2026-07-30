export async function getArticles(params = {}) {
  const query = new URLSearchParams(Object.entries(params).filter(([, value]) => value !== '' && value != null));
  const response = await fetch(`/api/articles?${query}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Unable to load articles.');
  return data;
}
