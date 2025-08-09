import { createSignal, onMount, onCleanup, Show, Switch, Match } from "solid-js";

function useMiniRouter() {
  const [path, setPath] = createSignal(window.location.pathname || "/");
  const onPop = () => setPath(window.location.pathname || "/");
  onMount(() => window.addEventListener("popstate", onPop));
  onCleanup(() => window.removeEventListener("popstate", onPop));

  const navigate = (to: string) => {
    if (to !== path()) {
      history.pushState(null, "", to);
      setPath(to);
    }
  };
  const link = (to: string) => (e: MouseEvent) => {
    e.preventDefault();
    navigate(to);
  };

  return { path, navigate, link };
}

function Home() {
  return <div class="p-2">Home</div>;
}

function Add() {
  let input!: HTMLInputElement;
  const lookup = async (isbn: string) => {
    const r = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${encodeURIComponent(isbn)}`
    );
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
  };
  const onSearch = async () => {
    try {
      const d = await lookup(input.value.trim());
      alert(`Title: ${d.title}\nAuthors: ${(d.authors || []).join(", ")}`);
    } catch (e: any) {
      alert(e?.message ?? "error");
    }
  };
  return (
    <div class="space-y-3">
      <h1 class="text-xl" style={{ "font-family": "var(--font-display)" }}>本を追加</h1>
      <div class="flex gap-2">
        <input ref={input} class="border p-2 rounded w-64" placeholder="ISBN-13" />
        <button class="bg-accent text-surface px-4 py-2 rounded hover:bg-primary" onClick={onSearch}>
          検索
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const { path, link } = useMiniRouter();

  return (
    <div class="bg-background text-ink min-h-screen">
      <header class="bg-primary text-surface">
        <div class="max-w-4xl mx-auto px-4 py-3 text-xl" style={{ "font-family": "var(--font-display)" }}>
          Tsuzuri
        </div>
      </header>

      <main class="max-w-4xl mx-auto px-4 py-6 space-y-4">
        <nav class="flex gap-4">
          <a href="/" onClick={link("/")} class="underline">Home</a>
          <a href="/add" onClick={link("/add")} class="underline">Add</a>
        </nav>

        <Switch>
          <Match when={path() === "/"}><Home /></Match>
          <Match when={path() === "/add"}><Add /></Match>
          <Match when={true}><div class="p-2">404</div></Match>
        </Switch>
      </main>
    </div>
  );
}
