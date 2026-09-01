import { useState, useCallback } from "react";
import { Clipboard, Check } from "lucide-react";

export function CopyButton({ value, label }: { value: string; label: string }) {
    const [copied, setCopied] = useState(false);
    const [failed, setFailed] = useState(false);

    const handleCopy = useCallback(() => {
        navigator.clipboard
        .writeText(value)
        .then(() => {
            setCopied(true);
            setFailed(false);
            setTimeout(() => setCopied(false), 1500);
        })
        .catch(() => {
            setFailed(true);
            setTimeout(() => setFailed(false), 2000);
        });
    }, [value]);

    return (
        <button
        onClick={handleCopy}
        className="flex items-center gap-2 px-3 py-1.5 font-mono text-xs tracking-[0.08em] transition-all border cursor-pointer rounded-xs"
        style={{
            background: copied ? "rgba(46,204,113,0.12)" : failed ? "rgba(231,76,60,0.12)" : "rgba(61,111,196,0.1)",
            borderColor: copied ? "rgba(46,204,113,0.35)" : failed ? "rgba(231,76,60,0.4)" : "rgba(61,111,196,0.25)",
            color: copied ? "#2ECC71" : failed ? "#E74C3C" : "var(--primary)",
        }}
        >
        {copied ? <Check size={13} /> : <Clipboard size={13} />}
        {copied ? "СКОПИРОВАНО ✓" : failed ? "ОШИБКА" : label}
        </button>
    );
}