const BASE = import.meta.env.VITE_API_BASE; // ない時はGoogle直叩き

export async function lookupBook(isbn: string) {
  if (!isbn) throw new Error("ISBN required");
  if (BASE) {
    const r = await fetch(`${BASE}/api/books/lookup?isbn=${encodeURIComponent(isbn)}`);
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  }
  // フォールバック: Google Books
  const r = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${encodeURIComponent(isbn)}`);
  const j = await r.json();
  const info = j.items?.[0]?.volumeInfo;
  if (!info) throw new Error("not found");
  return {
    title: info.title,
    authors: info.authors ?? [],
    thumbnail: info.imageLinks?.thumbnail ?? null,
    desc: info.description ?? "",
    isbn13: isbn,
  };
}
