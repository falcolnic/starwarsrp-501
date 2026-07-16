export interface NavLinkItem {
    to: string;
    label: string;
    end: boolean;
}

export const navLinks: NavLinkItem[] = [
    { to: "/", label: "Главная", end: true },
    { to: "/roster", label: "Состав", end: false },
    { to: "/promotion", label: "Продвижение", end: false },
    { to: "/map", label: "Карта", end: false },
];