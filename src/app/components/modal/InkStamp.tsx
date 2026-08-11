import { STATUS_STYLES } from "./types";

interface InkStampProps {
    status?: string;
}

export function InkStamp({ status = "BANNED" }: InkStampProps) {
    const config = STATUS_STYLES[status] || STATUS_STYLES["BANNED"];

    return (
        <div
        className={`inline-block px-3 py-1 font-mono font-bold uppercase text-xs tracking-[0.15em] select-none border-2 -rotate-4 opacity-85 mix-blend-multiply mt-[0.2rem] ${config.textColor} ${config.borderColor}`}
        >
        {config.label}
        </div>
    );
}