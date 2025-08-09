import { Dynamic } from "solid-js/web";
import { createMiniRouter } from "./lib/mini-router";
import Add from "./pages/Add";
import Library from "./pages/Library";

function Home() { return <div class="p-2">Home</div>; }
function NotFound() { return <div class="p-2">404</div>; }

export default function App() {
  const { path, linkProps, isActive } = createMiniRouter();

  const routes: Record<string, () => JSX.Element> = {
    "/": Home,
    "/add": Add,
    "/library": Library,
  };
  const Current = () => routes[path()] ?? NotFound;

  return (
    <div class="bg-background text-ink min-h-screen">
      <header class="header-bar">
        <div class="container py-3 text-xl brand">Tsuzuri</div>
      </header>

      <main class="container py-6 space-y-4">
        <nav class="flex gap-4">
          <a {...linkProps("/")} class={`link ${isActive("/") ? "font-semibold" : ""}`}>Home</a>
          <a {...linkProps("/add")} class={`link ${isActive("/add") ? "font-semibold" : ""}`}>Add</a>
          <a {...linkProps("/library")} class={`link ${isActive("/library") ? "font-semibold" : ""}`}>Library</a>
        </nav>

        <Dynamic component={Current()} />
      </main>
    </div>
  );
}
