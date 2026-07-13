import { Outlet } from "react-router";
import { Navbar } from "./layout/Navbar";
import { Footer } from "./layout/Footer";

export function Layout() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}