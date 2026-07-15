export type BannedStatus = "TRIALS" | "EXILED" | "BANNED";

export interface BannedEntry {
    cid: string;
    nickname: string;
    date: string;
    reason: string;
    status: BannedStatus;
}


export const BANNED_LIST: BannedEntry[] = [
    { 
        cid: "CT-6666", 
        nickname: "Slick", 
        date: "12.04.2026", 
        reason: "Предательство Республики, саботаж на Кристофсисе", 
        status: "TRIALS" 
    },
    { 
        cid: "CT-0404", 
        nickname: "Glitch", 
        date: "28.05.2026", 
        reason: "Неподчинение приказам, дезертирство с поля боя", 
        status: "EXILED" 
    },
    { 
        cid: "CT-9912", 
        nickname: "Rogue", 
        date: "30.06.2026", 
        reason: "Использование несанкционированных модификаций брони (читы)", 
        status: "BANNED" 
    },
];

export const STATUS_STYLES: Record<BannedStatus, { textColor: string; borderColor: string; label: string }> = {
    TRIALS: { 
        textColor: "text-[#9a6b1f]", 
        borderColor: "border-[#9a6b1f]", 
        label: "PENDING TRIAL" 
    },
    EXILED: { 
        textColor: "text-[#5a4a3a]", 
        borderColor: "border-[#5a4a3a]", 
        label: "EXILED" 
    },
    BANNED: { 
        textColor: "text-[#8b1a1a]", 
        borderColor: "border-[#8b1a1a]", 
        label: "PERMANENT BAN" 
    },
};