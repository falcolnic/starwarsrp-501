import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { Lock, ChevronDown, ChevronUp } from "lucide-react";
import { useAdminAuth } from "../../admin/AdminAuthContext";

const ERROR_MESSAGES: Record<string, string> = {
    not_authorized: "Ваш Steam аккаунт не имеет прав администратора.",
    steam_failed: "Ошибка проверки подлинности Steam.",
    invalid_steam: "Некорректный Steam ID.",
    server_error: "Внутренняя ошибка сервера авторизации.",
};

export function AdminLogin() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { refresh } = useAdminAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    const urlError = searchParams.get("error");
    const displayError = error || (urlError ? ERROR_MESSAGES[urlError] ?? "Ошибка авторизации" : "");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ username, password }),
        });

        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            setError(data.error ?? "Неверный логин или пароль");
            return;
        }
        await refresh();
        navigate("/admin");
        } catch {
        setError("Не удалось связаться с сервером");
        } finally {
        setSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#080d17] px-4">
        <div className="w-full max-w-sm bg-[var(--card)] border border-[var(--border)] p-6">
            <div className="flex items-center gap-2 mb-6">
            <Lock size={18} className="text-[var(--primary)]" />
            <h1 className="text-lg font-bold tracking-[0.08em] uppercase m-0 text-white">Панель управления</h1>
            </div>

            {displayError && (
            <div className="mb-5 px-3 py-2 border border-red-500/40 bg-red-500/10 text-red-400 font-mono text-xs">
                {displayError}
            </div>
            )}

            <a href="/api/auth/steam"
                className="flex items-center justify-center gap-3 w-full py-3 bg-[#171a21] hover:bg-[#2a475e] border border-[#2a475e] text-white font-mono text-sm tracking-[0.08em] uppercase transition-colors mb-5 cursor-pointer shadow-md"
            >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.03 4.524 4.524s-2.03 4.524-4.524 4.524h-.105l-4.076 2.911c.002.052.006.105.006.158 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 12-5.373 12-12s-5.373-12-12-12z" />
            </svg>
                Войти через Steam
            </a>

            <div className="border-t border-[var(--border)] pt-4">
            <button
                type="button"
                onClick={() => setShowPasswordForm((v) => !v)}
                className="flex items-center justify-between w-full font-mono text-xs text-[var(--muted-foreground)] hover:text-white transition-colors cursor-pointer py-1"
            >
                <span>Вход по логину и паролю</span>
                {showPasswordForm ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {showPasswordForm && (
                <form onSubmit={handleSubmit} className="mt-4">
                <label className="block mb-4">
                    <span className="font-mono text-xs text-[var(--muted-foreground)] tracking-[0.1em] uppercase">
                    Логин
                    </span>
                    <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full mt-1 px-3 py-2 bg-black/30 border border-[var(--border)] focus:border-[var(--primary)] text-[var(--foreground)] font-mono text-sm outline-none"
                    />
                </label>

                <label className="block mb-5">
                    <span className="font-mono text-xs text-[var(--muted-foreground)] tracking-[0.1em] uppercase">
                    Пароль
                    </span>
                    <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full mt-1 px-3 py-2 bg-black/30 border border-[var(--border)] focus:border-[var(--primary)] text-[var(--foreground)] font-mono text-sm outline-none"
                    />
                </label>

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-2.5 bg-[var(--primary)]/15 border border-[var(--primary)]/50 hover:bg-[var(--primary)]/25 text-[var(--primary)] font-mono text-sm tracking-[0.1em] uppercase transition-colors disabled:opacity-50 cursor-pointer"
                >
                    {submitting ? "Вход..." : "Войти"}
                </button>
                </form>
            )}
            </div>
        </div>
        </div>
    );
}