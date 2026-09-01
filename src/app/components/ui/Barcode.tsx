function getBarcodeWidths(value: string): number[] {
    const safeValue = value && value.length > 0 ? value : "0";
    return Array.from({ length: 52 }, (_, i) => {
        const code = safeValue.charCodeAt(i % safeValue.length) ^ (i * 7);
        return ((code % 3) + 1) * 1.5;
    });
}

export function Barcode({ value }: { value: string }) {
    const widths = getBarcodeWidths(value);
    return (
        <div className="flex gap-[1.5px] items-end h-7 opacity-40">
        {widths.map((w, i) => (
            <div
            key={i}
            className="bg-[var(--primary)]"
            style={{ width: w, height: i % 5 === 0 ? "100%" : `${55 + (i % 4) * 12}%` }}
            />
        ))}
        </div>
    );
}