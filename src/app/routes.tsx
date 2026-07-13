import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Roster } from "./pages/Roster";
import { Promotion } from "./pages/Promotion";
import { WarpLoaderFallback } from "./components/Warp/WarpLoaderFallback";

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
      {
        path: "*",
        Component: () => (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 16 }}>
            <h2 style={{ color: "var(--primary)", margin: 0 }}>404 — SECTOR NOT FOUND</h2>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "var(--muted-foreground)", margin: 0 }}>
              Navigation target does not exist in registry.
            </p>
            <a
              href="/"
              style={{ color: "var(--primary)", fontFamily: "var(--font-display)", letterSpacing: "0.1em", fontSize: "0.88rem", border: "1px solid var(--primary)", padding: "8px 24px", textDecoration: "none" }}
            >
              ← RETURN TO BASE
            </a>
          </div>
        ),
      },
    ],
  },
]);