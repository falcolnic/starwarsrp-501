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
            className={`relative ${className}`}
            style={{ width: divSize, height: divSize }}
        >
            <img
                src="/logo.svg"
                alt="Logo"
                className="absolute inset-0 m-auto"
                style={{ width: imgSize, height: imgSize }}
            />
            </div>
    );
}