const items = [
    "GAR 501 ELITE ASSAULT LEGION", 
    "WEBSITE BY FALCOLN", 
    "YARIK IS ADMIN", 
    "FALCOLN IS ADMIN", 
    "UNIT STRENGTH: FULL", 
    "COMMAND: SECURE", 
    "NET: ENCRYPTED",
    "COLOBOR UMER",
    "CRY MORE BABY, THIS IS 501ST",
];

export function InfoTicker() {
    const quadrupled = [...items, ...items, ...items, ...items];

    return (
        <div className="relative overflow-hidden border-t border-b border-[var(--border)] py-[5px] mb-0 flex w-full select-none bg-[#080d17]/10">

        <style>{`
            @keyframes ticker-slide {
            0% {
                transform: translate3d(0, 0, 0);
            }
            100% {
                transform: translate3d(-25%, 0, 0);
            }
            }
            .marquee-track-infinite {
                display: flex;
                width: max-content;
                animation: ticker-slide 36s linear infinite;
            }
            .marquee-track-infinite:hover {
                animation-play-state: paused;
            }
        `}</style>

        <div className="marquee-track-infinite">
            {quadrupled.map((item, i) => (
            <span 
                key={i} 
                className="font-['Mandalorian'] text-lg tracking-[0.2em] text-[rgba(143,163,192,0.5)] px-[28px] whitespace-nowrap flex items-center"
            >
                <span className="text-[rgba(61,111,196,0.6)] mr-[12px] select-none">▸</span>
                {item}
            </span>
            ))}
        </div>
        </div>
    );
}