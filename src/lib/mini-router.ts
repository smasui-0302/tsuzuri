import { createSignal, onMount, onCleanup } from "solid-js";

type NavigateOpts = { replace?: boolean };

export function createMiniRouter() {
    const [path, setPath] = createSignal(normalizePath(location.pathname));

    const onPop = () => setPath(normalizePath(location.pathname));
    onMount(() => addEventListener("popstate", onPop));
    onCleanup(() => removeEventListener("popstate", onPop));

    function navigate(to: string, opts: NavigateOpts = {}) {
        const next = normalizePath(to);
        if (next === path()) return;
        if (opts.replace) history.replaceState(null, "", next);
        else history.pushState(null, "", next);
        setPath(next);
        requestAnimationFrame(() => scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }));
    }

function linkProps(to: string) {
    const href = normalizePath(to);
    const onClick = (e: MouseEvent) => {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (new URL(href, location.origin).origin !== location.origin) return;
        e.preventDefault();
        navigate(href);
    };
    return { href, onClick };
}

    const isActive = (to: string) => path() === normalizePath(to);
    return { path, navigate, linkProps, isActive };
}

const normalizePath = (p: string) => (p || "/").replace(/\/+$/, "") || "/";
