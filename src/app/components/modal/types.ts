export type BannedStatus = "BANNED" | "DECEASED" | "EXECUTED" | "TERMINATED";

export const STATUS_STYLES: Record<
    string,
    { textColor: string; borderColor: string; label: string }
    > = {
    BANNED: {
        textColor: "text-[#8b1a1a]",
        borderColor: "border-[#8b1a1a]",
        label: "ПРЕДАТЕЛЬ",
    },
    DECEASED: {
        textColor: "text-[#5a4d38]",
        borderColor: "border-[#5a4d38]",
        label: "ЛИКВИДИРОВАН",
    },
    EXECUTED: {
        textColor: "text-[#8b1a1a]",
        borderColor: "border-[#8b1a1a]",
        label: "РАССТРЕЛЯН",
    },
    TERMINATED: {
        textColor: "text-[#3c321e]",
        borderColor: "border-[#3c321e]",
        label: "ИЗГНАН",
    },
};
