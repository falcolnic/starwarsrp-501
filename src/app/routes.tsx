import { createBrowserRouter, Navigate } from "react-router";
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
import { Positions } from "./pages/Positions";
import { DatabaseLayout } from "./components/database/DatabaseLayout";
import { PromotionRulesPage } from "./pages/PromotionRulesPage";
import { ErrorPage } from "./pages/ErrorPage";
import { Commanders } from "./pages/Commanders";

import { AdminAuthProvider } from "./admin/AdminAuthContext";
import { AdminLayout } from "./components/admin/AdminLayout";
import { AdminLogin } from "./pages/admin/AdminLogin";
import { AdminRanksPage } from "./pages/admin/AdminRanksPage";
import { AdminBlacklistPage } from "./pages/admin/AdminBlacklistPage";
import { AdminRosterPage } from "./pages/admin/AdminRosterPage";
import { AdminUsersPage } from "./pages/admin/AdminUsersPage";
import { AdminZergsPage } from "./pages/admin/AdminZergsPage";
import { AdminDroidsPage } from "./pages/admin/AdminDroidsPage";


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
    path: "admin",
    Component: AdminAuthProvider,
    children: [
      { path: "login", Component: AdminLogin },
      {
        Component: AdminLayout,
        children: [
          { index: true, element: <Navigate to="/admin/roster" replace /> },
          { path: "roster", Component: AdminRosterPage },
          { path: "ranks", Component: AdminRanksPage },
          { path: "blacklist", Component: AdminBlacklistPage },
          { path: "users", Component: AdminUsersPage },
          { path: "zergs", Component: AdminZergsPage },
          { path: "droids", Component: AdminDroidsPage },
        ],
      },
    ],
  },
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
      { path: "commanders", Component: Commanders },
      { path: "positions", Component: Positions },
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