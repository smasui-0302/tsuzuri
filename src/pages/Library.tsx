import { loadBooks } from "../lib/store";

export default function Library() {
    const list = loadBooks();

    if (list.length === 0) {
        return (
            <div class="card">
                <div class="font-semibold">保存した本はまだありません</div>
                <div class="muted text-sm">「Add」からISBN検索して保存してみてください。</div>
            </div>
        );
    }

    return (
        <div class="space-y-4">
            <h1 class="text-xl brand">保存した本</h1>
            <ul class="grid gap-3">
                {list.map((b) => (
                    <li class="card flex gap-4" id={b.id}>
                        <img
                            src={b.thumbnail ?? "https://placehold.co/72x96?text=No+Cover"}
                            alt="" width="72" height="96" class="rounded shrink-0" loading="lazy"
                        />
                        <div>
                            <div class="font-semibold">{b.title}</div>
                            <div class="text-sm muted">{b.authors.join(", ")}</div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
