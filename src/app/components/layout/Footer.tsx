export function Footer() {
    return (
        <footer
        className="border-t px-6 py-4 text-center"
        style={{ borderColor: "var(--border)", background: "#080d17" }}
        >
        <div
            className="text-[0.8rem] tracking-[0.12em]"
            style={{ fontFamily: "var(--font-mono)", color: "var(--muted-foreground)" }}
        >
            501ST ELITE ASSAULT LEGION — CLASSIFIED INTERNAL NETWORK — GAR-501-NET v2.4.1
            <span className="ml-6" style={{ color: "rgba(61,111,196,0.5)" }}>
            ████████ ENCRYPTED ████████
            </span>
        </div>
        </footer>
    );
}