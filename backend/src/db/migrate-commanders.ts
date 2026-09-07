import "dotenv/config";
import { db } from "./client.js";
import { commandersRegistry } from "./schema.js";

const ARCHIVE_DATA = {
    "Клон Командер": [
        {
            "period": "2017-2018",
            "entries": [
            { "order": 1, "idNumber": "1552", "callsign": "NightGlade", "km": "Raide" },
            { "order": 2, "idNumber": "-", "callsign": "-", "km": "Van9" },
            { "order": 3, "idNumber": "7583", "callsign": "Tom", "km": "Volche, TequilaBoom" },
            { "order": 4, "idNumber": "1331", "callsign": "LENIN", "km": "TyP60" },
            { "order": 5, "idNumber": "1926", "callsign": "Charlie", "km": "LENIN" },
            { "order": 6, "idNumber": "2806", "callsign": "Kupa", "km": "PiNGviN" },
            { "order": 7, "idNumber": "1302", "callsign": "KOT", "km": "PiNGviN" }
            ]
        },
        {
            "period": "2019-2020",
            "entries": [
            { "order": 8, "idNumber": "5937", "callsign": "Sky", "km": "KOT" },
            { "order": 9, "idNumber": "05573", "callsign": "Mia", "km": "Sky" },
            { "order": 10, "idNumber": "09477", "callsign": "Heisenberg", "km": "Mia" },
            { "order": 11, "idNumber": "16051", "callsign": "Ладислав Сладенький", "km": "Pisy4" },
            { "order": 12, "idNumber": "09533", "callsign": "ProTagOn1st", "km": "Pisy4" },
            { "order": 13, "idNumber": "2806", "callsign": "Kupa", "km": "ProTagOn1st" },
            { "order": 14, "idNumber": "6084", "callsign": "Qteon", "km": "Kupa" },
            { "order": 15, "idNumber": "02712", "callsign": "Даймё Кухулин", "km": "Qteon" }
            ]
        },
        {
            "period": "2021-2022",
            "entries": [
            { "order": 17, "idNumber": "07348", "callsign": "payn", "km": "Vitia Tachka" },
            { "order": 18, "idNumber": "49394", "callsign": "Barmaley", "km": "Vitia Tachka" },
            { "order": 19, "idNumber": "60022", "callsign": "Laggy", "km": "Vitia Tachka" },
            { "order": 20, "idNumber": "39816", "callsign": "PiNGviN", "km": "Vitia Tachka" },
            { "order": 21, "idNumber": "60955", "callsign": "Alpha", "km": "PiNGviN" }
            ]
        },
        {
            "period": "2023-2024",
            "entries": [
            { "order": 22, "idNumber": "8652", "callsign": "Crack", "km": "Alpha" },
            { "order": 23, "idNumber": "47850", "callsign": "Bibok", "km": "Crack" },
            { "order": 24, "idNumber": "-", "callsign": "-", "km": "NightGlade" }
            ]
        },
        {
            "period": "2024-2025",
            "entries": [
            { "order": 25, "idNumber": "0032", "callsign": "Takeda", "km": "Vitia Tachka" },
            { "order": 26, "idNumber": "0245", "callsign": "ProTagOn1st", "km": "Vitia Tachka" },
            { "order": 27, "idNumber": "0306", "callsign": "Sky", "km": "doctor, Takeda" },
            { "order": 29, "idNumber": "0002", "callsign": "Flogger", "km": "Flogger" },
            { "order": 30, "idNumber": "0018", "callsign": "Ving", "km": "Flogger" },
            { "order": 31, "idNumber": "0403", "callsign": "ARTORIA", "km": "Flogger" },
            { "order": 32, "idNumber": "0217", "callsign": "Admentai", "km": "Takeda" }
            ]
        },
        {
            "period": "2025-2026",
            "entries": [
            { "order": 33, "idNumber": "0268", "callsign": "Острый", "km": "Admentai" },
            { "order": 34, "idNumber": "2164", "callsign": "Undertaker", "km": "Острый" },
            { "order": 35, "idNumber": "0030", "callsign": "Fortune", "km": "Undertaker" },
            { "order": 36, "idNumber": "0018", "callsign": "Ving", "km": "Barsik" },
            { "order": 38, "idNumber": "14228", "callsign": "Перега Сират", "km": "Ving" },
            { "order": 39, "idNumber": "0641", "callsign": "Sorry", "km": "Ving" }
            ]
        },
        {
            "period": "2026-2027",
            "entries": [
            { "order": 41, "idNumber": "1656", "callsign": "Feyken", "km": "Sorry" },
            { "order": 42, "idNumber": "0896", "callsign": "Роскомнадзор", "km": "Sorry" }
            ]
        }
        ],
    "Командир первого класса": [
        {
            "period": "2017-2018",
            "entries": [
            { "order": 1, "idNumber": "1552", "callsign": "NightGlade", "km": "Raide" },
            { "order": 2, "idNumber": "9129", "callsign": "Golden", "km": "Raide" },
            { "order": 3, "idNumber": "7583", "callsign": "Tom", "km": "Van9" },
            { "order": 4, "idNumber": "7804", "callsign": "SaiRaz", "km": "Volche" },
            { "order": 5, "idNumber": "2487", "callsign": "TyP60", "km": "TequilaBoom" },
            { "order": 6, "idNumber": "1926", "callsign": "Spartacus", "km": "TyP60" },
            { "order": 7, "idNumber": "5267", "callsign": "PiNGviN", "km": "LENIN" },
            { "order": 8, "idNumber": "8774", "callsign": "Werex", "km": "PiNGviN" },
            { "order": 9, "idNumber": "3535", "callsign": "CSV", "km": "PiNGviN" }
            ]
        },
        {
            "period": "2019-2020",
            "entries": [
            { "order": 10, "idNumber": "8652", "callsign": "Crack", "km": "KOT" },
            { "order": 11, "idNumber": "09477", "callsign": "Walter White", "km": "Sky" },
            { "order": 12, "idNumber": "9312", "callsign": "Pisy4", "km": "Mia" },
            { "order": 13, "idNumber": "09533", "callsign": "ProTagOn1st", "km": "Pisy4" },
            { "order": 14, "idNumber": "2806", "callsign": "KupchakoV", "km": "Pisy4" },
            { "order": 15, "idNumber": "07745", "callsign": "Caines Ceno", "km": "ProTagOn1st" },
            { "order": 16, "idNumber": "6084", "callsign": "Qteon", "km": "ProTagOn1st" },
            { "order": 17, "idNumber": "02712", "callsign": "Граф Кухулин", "km": "Kupa" },
            { "order": 18, "idNumber": "29685", "callsign": "Vitia Tachka", "km": "Qteon" },
            { "order": 19, "idNumber": "07348", "callsign": "payn", "km": "Mia" }
            ]
        },
        {
            "period": "2021-2022",
            "entries": [
            { "order": 20, "idNumber": "49394", "callsign": "Barmaley", "km": "Vitia Tachka" },
            { "order": 21, "idNumber": "60022", "callsign": "Laggy", "km": "Vitia Tachka" },
            { "order": 22, "idNumber": "5937", "callsign": "Sky", "km": "Vitia Tachka" },
            { "order": 23, "idNumber": "39816", "callsign": "PiNGviN", "km": "Vitia Tachka" },
            { "order": 24, "idNumber": "60955", "callsign": "Alpha", "km": "Vitia Tachka" },
            { "order": 25, "idNumber": "8652", "callsign": "Crack", "km": "PiNGviN" }
            ]
        },
        {
            "period": "2023-2024",
            "entries": [
            { "order": 26, "idNumber": "87207", "callsign": "Mrak", "km": "Alpha" },
            { "order": 27, "idNumber": "6677", "callsign": "Takeda", "km": "Crack" },
            { "order": 28, "idNumber": "10717", "callsign": "luvti", "km": "Crack" },
            { "order": 29, "idNumber": "6677", "callsign": "Takeda", "km": "NightGlade" }
            ]
        },
        {
            "period": "2024-2025",
            "entries": [
            { "order": 30, "idNumber": "0326", "callsign": "Mia", "km": "Vitia Tachka" },
            { "order": 31, "idNumber": "0045", "callsign": "doctor", "km": "Vitia Tachka" },
            { "order": 32, "idNumber": "0038", "callsign": "Adam Jey", "km": "doctor" },
            { "order": 33, "idNumber": "0078", "callsign": "TyP60", "km": "Takeda" },
            { "order": 34, "idNumber": "0263", "callsign": "Noisy", "km": "Flogger" },
            { "order": 35, "idNumber": "0217", "callsign": "Admentai", "km": "Flogger" },
            { "order": 36, "idNumber": "0002", "callsign": "Flogger", "km": "Takeda" }
            ]
        },
        {
            "period": "2025-2026",
            "entries": [
            { "order": 37, "idNumber": "0268", "callsign": "Острый", "km": "Admentai" },
            { "order": 38, "idNumber": "2164", "callsign": "Undertaker", "km": "Admentai" },
            { "order": 39, "idNumber": "4305", "callsign": "Margon", "km": "Admentai" },
            { "order": 40, "idNumber": "0127", "callsign": "MeGa", "km": "Острый" },
            { "order": 41, "idNumber": "0030", "callsign": "Fortune", "km": "Острый" },
            { "order": 42, "idNumber": "0018", "callsign": "Ving", "km": "Undertaker" },
            { "order": 43, "idNumber": "14228", "callsign": "Перега Сират", "km": "Barsik" },
            { "order": 44, "idNumber": "0641", "callsign": "Sorry", "km": "Ving" },
            { "order": 45, "idNumber": "11699", "callsign": "Wilory", "km": "Ving" }
            ]
        },
        {
            "period": "2026-2027",
            "entries": [
            { "order": 46, "idNumber": "0896", "callsign": "Роскомнадзор", "km": "Sorry" },
            { "order": 47, "idNumber": "15322", "callsign": "Nimitz", "km": "Sorry" }
            ]
        }
        ],
    "Командир": [
        {
            "period": "2017-2018",
            "entries": [
            { "order": 1, "idNumber": "1552", "callsign": "NightGlade", "km": "Raide" },
            { "order": 2, "idNumber": "9129", "callsign": "Golden", "km": "Raide" },
            { "order": 3, "idNumber": "7804", "callsign": "SaiRaz", "km": "Van9" },
            { "order": 4, "idNumber": "6769", "callsign": "Gyl", "km": "Volche" },
            { "order": 5, "idNumber": "1332", "callsign": "LENIN", "km": "TequilaBoom" },
            { "order": 6, "idNumber": "5267", "callsign": "PiNGviN", "km": "TyP60" },
            { "order": 7, "idNumber": "8774", "callsign": "Werex", "km": "LENIN" },
            { "order": 8, "idNumber": "2806", "callsign": "Kupa", "km": "LENIN" },
            { "order": 9, "idNumber": "4268", "callsign": "Sergey", "km": "LENIN" },
            { "order": 10, "idNumber": "1302", "callsign": "KOT", "km": "PiNGviN" },
            { "order": 11, "idNumber": "5937", "callsign": "Sky", "km": "PiNGviN" }
            ]
        },
        {
            "period": "2019-2020",
            "entries": [
            { "order": 12, "idNumber": "4931", "callsign": "ZloDiaN", "km": "KOT" },
            { "order": 13, "idNumber": "05573", "callsign": "Mia", "km": "Sky" },
            { "order": 14, "idNumber": "9312", "callsign": "Pisy4", "km": "Sky" },
            { "order": 15, "idNumber": "16051", "callsign": "Ладислав Сладенький", "km": "Mia" },
            { "order": 16, "idNumber": "2806", "callsign": "KupchakoV", "km": "Pisy4" },
            { "order": 17, "idNumber": "07745", "callsign": "Caines Ceno", "km": "Pisy4" },
            { "order": 18, "idNumber": "6084", "callsign": "Qteon", "km": "ProTagOn1st" },
            { "order": 19, "idNumber": "02712", "callsign": "Кун Агеро Агнис", "km": "ProTagOn1st" },
            { "order": 20, "idNumber": "29685", "callsign": "Vitia Tachka", "km": "Kupa" },
            { "order": 21, "idNumber": "07348", "callsign": "payn", "km": "Qteon" },
            { "order": 22, "idNumber": "49394", "callsign": "Barmaley", "km": "Mia" }
            ]
        },
        {
            "period": "2021-2022",
            "entries": [
            { "order": 23, "idNumber": "60022", "callsign": "Laggy", "km": "Vitia Tachka" },
            { "order": 24, "idNumber": "5937", "callsign": "Sky", "km": "Vitia Tachka" },
            { "order": 25, "idNumber": "39816", "callsign": "PiNGviN", "km": "Vitia Tachka" },
            { "order": 26, "idNumber": "60955", "callsign": "Alpha", "km": "Vitia Tachka" },
            { "order": 27, "idNumber": "8652", "callsign": "Crack", "km": "Vitia Tachka" },
            { "order": 28, "idNumber": "87207", "callsign": "Mrak", "km": "PiNGviN" }
            ]
        },
        {
            "period": "2023-2024",
            "entries": [
            { "order": 29, "idNumber": "51552", "callsign": "ByxouBarash", "km": "Alpha" },
            { "order": 30, "idNumber": "47850", "callsign": "Bibok", "km": "Alpha" },
            { "order": 31, "idNumber": "6677", "callsign": "Takeda", "km": "Crack" },
            { "order": 32, "idNumber": "10717", "callsign": "luvti", "km": "Crack" },
            { "order": 33, "idNumber": "48327", "callsign": "Skyline", "km": "Crack" },
            { "order": 34, "idNumber": "51552", "callsign": "ByxouBarash", "km": "NightGlade" },
            { "order": 35, "idNumber": "60811", "callsign": "laLala Лоля", "km": "NightGlade" }
            ]
        },
        {
            "period": "2024-2025",
            "entries": [
            { "order": 36, "idNumber": "0245", "callsign": "ProTagOn1st", "km": "Vitia Tachka" },
            { "order": 37, "idNumber": "0038", "callsign": "Adam Jey", "km": "Vitia Tachka" },
            { "order": 38, "idNumber": "0306", "callsign": "Sky", "km": "Vitia Tachka" },
            { "order": 39, "idNumber": "0078", "callsign": "TyP60", "km": "doctor" },
            { "order": 40, "idNumber": "0038", "callsign": "Adam Jey", "km": "Takeda" },
            { "order": 41, "idNumber": "0403", "callsign": "ARTORIA", "km": "Flogger" },
            { "order": 42, "idNumber": "0217", "callsign": "Admentai", "km": "Flogger" },
            { "order": 43, "idNumber": "0268", "callsign": "Острый", "km": "Takeda" }
            ]
        },
        {
            "period": "2025-2026",
            "entries": [
            { "order": 44, "idNumber": "0038", "callsign": "Adam Jey", "km": "Admentai" },
            { "order": 45, "idNumber": "0262", "callsign": "Mamba out", "km": "Admentai" },
            { "order": 46, "idNumber": "7014", "callsign": "Авангардист", "km": "Admentai" },
            { "order": 47, "idNumber": "0030", "callsign": "Fortune", "km": "Острый" },
            { "order": 48, "idNumber": "0273", "callsign": "Чувашский Король", "km": "Острый" },
            { "order": 49, "idNumber": "0173", "callsign": "Barsik", "km": "Undertaker" },
            { "order": 50, "idNumber": "0641", "callsign": "Sorry", "km": "Barsik" },
            { "order": 51, "idNumber": "11699", "callsign": "Wilory", "km": "Ving" },
            { "order": 52, "idNumber": "1656", "callsign": "Feyken", "km": "Ving" }
            ]
        },
        {
            "period": "2026-2027",
            "entries": [
            { "order": 53, "idNumber": "0045", "callsign": "doctor", "km": "Sorry" },
            { "order": 54, "idNumber": "15322", "callsign": "Nimitz", "km": "Sorry" },
            { "order": 55, "idNumber": "7884", "callsign": "Roberto", "km": "Sorry" },
            { "order": 56, "idNumber": "8903", "callsign": "Boggi", "km": "Sorry" },
            { "order": 57, "idNumber": "0326", "callsign": "Mia", "km": "Sorry" },
            { "order": 58, "idNumber": "0018", "callsign": "Ving", "km": "Sorry" }
            ]
        }
    ],
}; 

async function run() {
    console.log("Начинаем перенос реестра КМД...");
    const insertData = [];
    const marshalsByPeriod: Record<string, Set<string>> = {};

    for (const [oldRank, eras] of Object.entries(ARCHIVE_DATA)) {
        const newRank = oldRank === "Клон Командер" ? "Коммандер" : oldRank;

        for (const era of eras) {
            if (!marshalsByPeriod[era.period]) {
                marshalsByPeriod[era.period] = new Set();
            }

            for (const entry of era.entries) {
                if (entry.km && entry.km !== "-") {
                    const kms = entry.km.split(",").map(s => s.trim());
                    kms.forEach(k => marshalsByPeriod[era.period].add(k));
                }

                insertData.push({
                    rank: newRank,
                    period: era.period,
                    orderNum: entry.order,
                    idNumber: entry.idNumber || "-",
                    callsign: entry.callsign || "-",
                });
            }
        }
    }

    for (const [period, marshals] of Object.entries(marshalsByPeriod)) {
        let marshalOrder = 1;
        for (const marshal of marshals) {
            insertData.push({
                rank: "Маршал",
                period: period,
                orderNum: marshalOrder++,
                idNumber: "—", 
                callsign: marshal,
            });
        }
    }

    if (insertData.length > 0) {
        await db.insert(commandersRegistry).values(insertData);
    }
    
    console.log("✅ Реестр успешно перенесен в БД, включая отдельную вкладку Маршалов!");
    process.exit(0);
}

run().catch((err) => {
    console.error("❌ Ошибка:", err);
    process.exit(1);
});