import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Roster } from "./pages/Roster";
import { Promotion } from "./pages/Promotion";
import { WarpLoaderFallback } from "./components/warp/WarpLoaderFallback";
import { MapViewer } from "./components/map/MapViewer";

const MIN_LOADER_DURATION = 8000;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    loader: async () => {
      const [roster] = await Promise.all([
        fetch("/data/roster.json").then((r) => r.json()),
        document.fonts.ready,
        wait(MIN_LOADER_DURATION),
      ]);
      return { roster };
    },
    HydrateFallback: WarpLoaderFallback,
    children: [
      { index: true, Component: Home },
      { path: "roster", Component: Roster },
      { path: "promotion", Component: Promotion },
      { path: "map", Component: MapViewer },
      {
        path: "*",
        Component: () => (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <h2 className="text-[var(--primary)] m-0 font-display text-2xl tracking-[0.12em]">
              404 — SECTOR NOT FOUND
            </h2>
            <p className="font-mono text-[0.82rem] text-[var(--muted-foreground)] m-0">
              Navigation target does not exist in registry.
            </p>
            <a
              href="/"
              className="text-[var(--primary)] font-display tracking-[0.1em] text-[0.88rem] border border-[var(--primary)] px-6 py-2 no-underline hover:bg-[var(--primary)]/10 transition-all duration-150"
            >
              ← RETURN TO BASE
            </a>
          </div>
        ),
      },
    ],
  },
]);