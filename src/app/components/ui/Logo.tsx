export function Logo({
    imgSize = 70,
    divSize = 70,
    className = "",
}: {
    imgSize?: number;
    divSize?: number;
    className?: string;
}) {
    return (
        <div
            className={`flex items-center justify-center shrink-0 ${className}`}
            style={{ width: divSize, height: divSize }}
        >
            <img
                src="/logo.png"
                alt="Logo"
                style={{ width: imgSize, height: imgSize }}
            />
            </div>
    );
}