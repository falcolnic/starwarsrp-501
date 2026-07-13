export interface NavLinkItem {
    to: string;
    label: string;
    end: boolean;
}

export const navLinks: NavLinkItem[] = [
    { to: "/", label: "Home Base", end: true },
    { to: "/roster", label: "Roster", end: false },
    { to: "/promotion", label: "Promotions", end: false },
];