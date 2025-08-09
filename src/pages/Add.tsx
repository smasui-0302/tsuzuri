import { createSignal, Show } from "solid-js";
import { lookupBook } from "../lib/api";
import { saveBook, type Book } from "../lib/store";

export default function Add() {
    const [isbn, setIsbn] = createSignal("");
    const [preview, setPreview] = createSignal<any>(null);
    const [loading, setLoading] = createSignal(false);

    const search = async () => {
        if (!isbn().trim() || loading()) return;
        setLoading(true);
        try {
            setPreview(await lookupBook(isbn().trim()));
        } catch (e: any) {
            setPreview(null);
            alert(e?.message ?? "not found");
        } finally {
            setLoading(false);
        }
    };

    const persist = () => {
        const p = preview(); if (!p) return;
        const b: Book = {
            id: p.isbn13 || crypto.randomUUID(),
            title: p.title,
            authors: p.authors ?? [],
            thumbnail: p.thumbnail,
            desc: p.desc,
            isbn13: p.isbn13
        };
        saveBook(b);
        alert("保存しました");
    };

    return (
        <div class="space-y-4">
            <h1 class="text-xl brand">本を追加</h1>
            <div class="flex flex-wrap gap-2">
                <input
                    value={isbn()}
                    onInput={(e) => setIsbn(e.currentTarget.value)}
                    class="border p-2 rounded w-64"
                    placeholder="ISBN-13"
                />
                <button class="btn btn-accent" onClick={search} disabled={loading()}>
                    {loading() ? "検索中..." : "検索"}
                </button>
            </div>

            <Show when={preview()}>
                {(p: any) => (
                    <div class="card flex gap-4">
                        <img
                            src={p().thumbnail ?? "https://placehold.co/96x128?text=No+Cover"}
                            alt="" width="96" height="128" class="rounded shrink-0" loading="lazy"
                        />
                        <div class="space-y-1">
                            <div class="font-semibold">{p().title}</div>
                            <div class="text-sm muted">{(p().authors || []).join(", ")}</div>
                            <p class="text-sm line-clamp-3">{p().desc}</p>
                            <div class="pt-2">
                                <button class="btn btn-primary" onClick={persist}>保存</button>
                            </div>
                        </div>
                    </div>
                )}
            </Show>
        </div>
    );
}
