import { BannedStatus, STATUS_STYLES } from "./types";

interface InkStampProps {
    status: BannedStatus;
}

export function InkStamp({ status }: InkStampProps) {
    const { textColor, borderColor, label } = STATUS_STYLES[status];

    return (
        <div
        className={`inline-block px-3 py-1 font-mono font-bold uppercase text-[10px] tracking-[0.15em] select-none border-2 -rotate-4 opacity-85 mix-blend-multiply mt-[0.9rem] ${textColor} ${borderColor}`}
        >
        {label}
        </div>
    );
}