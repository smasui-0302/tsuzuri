export type Book = { id: string; title: string; authors: string[]; thumbnail?: string | null; desc?: string; isbn13?: string };
const KEY = "tsuzuri:books";

export function loadBooks(): Book[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
export function saveBook(b: Book) {
  const list = loadBooks();
  const i = list.findIndex(x => x.id === b.id);
  if (i >= 0) list[i] = b; else list.push(b);
  localStorage.setItem(KEY, JSON.stringify(list));
}
