import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { WarpLoaderFallback } from "./components/warp/WarpLoaderFallback";
import rosterRaw from "../data/roster.json";

import { Home } from "./pages/Home";
import { Roster } from "./pages/Roster";
import { Promotion } from "./pages/Promotion";
import { MapViewer } from "./components/map/MapViewer";
import { Zergs } from "./pages/Zergs";
import { Droids } from "./pages/Droids";
import { Equipment } from "./pages/Equipment";
import { DatabaseLayout } from "./components/database/DatabaseLayout";
import { PromotionRulesPage } from "./pages/PromotionRulesPage";
import { ErrorPage } from "./pages/ErrorPage";

const MIN_LOADER_DURATION = 8000;

const CRITICAL_IMAGES = [
  "/logo.png",
  "/hero-bg.png",
  "/promotion-bg.png",
];

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function preloadImage(url: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve();
    img.onerror = () => resolve();
  });
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    loader: async () => {
await Promise.all([
        document.fonts.ready,
        document.fonts.load("1em Mandalorian"),
        ...CRITICAL_IMAGES.map((url) => preloadImage(url)),
        wait(MIN_LOADER_DURATION),
      ]);
      return { roster: rosterRaw };
    },
    HydrateFallback: WarpLoaderFallback,
    children: [
      { index: true, Component: Home },
      { path: "roster", Component: Roster },
      { path: "promotion", Component: Promotion },
      { path: "promotion/rules", Component: PromotionRulesPage },
      { path: "map", Component: MapViewer },
      { 
        Component: DatabaseLayout,
        children: [
          { path: "zergs", Component: Zergs },
          { path: "droids", Component: Droids },
          { path: "equipment", Component: Equipment },
        ],
      },
      { path: "*", Component: ErrorPage },
    ],
  },
]);