const API_URL = import.meta.env.VITE_API_URL || '';

export async function getArticles(params = {}) {
  const query = new URLSearchParams(Object.entries(params).filter(([, value]) => value !== '' && value != null));
  const response = await fetch(`${API_URL}/api/articles?${query}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Unable to load articles.');
  return data;
}
