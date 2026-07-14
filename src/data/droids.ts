export interface DroidEntry {
    id: string;
    name: string;
    hp: number;
    weapon: string;
    defenseLevel: string;
    dangerLevel: string;
    tactics: string;
    features: string;
    image?: string;
}

export const droids: DroidEntry[] = [
    {
        id: "b1",
        name: "Дроид B1",
        hp: 250,
        weapon: "бластерная винтовка (карабин) E-5",
        defenseLevel: "низкий",
        dangerLevel: "низкий-средний",
        tactics: "Ликвидировать со средней-дальней дистанции, не допускать сближения данного дроида.",
        features:
        "Плохой ИИ, ввиду чего стрельба на дальние дистанции дается данному дроиду с трудом. Компенсируется их числом и дешевизной.",
        image: "/database/droids/b1.jpg",
    },
    {
        id: "b1-sniper",
        name: "Дроид B1-SNiper",
        hp: 250,
        weapon: "бластерная винтовка (карабин) E-5S",
        defenseLevel: "низкий",
        dangerLevel: "средний",
        tactics: "Ликвидировать со средней-дальней дистанции, не допускать сближения данного дроида.",
        features:
        'Более продвинутый ИИ, ввиду чего данный дроид "никогда" не промахивается, однако наведение происходит строго в тело клона.',
        image: "/database/droids/b1-sniper.jpg",
    },
];