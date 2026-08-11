import "dotenv/config";
import { db } from "./client.js";
import { ranks, rankRequirements } from "./schema.js";

const RANK_LADDER = [
    "Рядовой-рекрут",
    "Рядовой",
    "Старший рядовой",
    "Специалист",
    "Капрал",
    "Сержант",
    "Штаб-сержант",
    "Сержант первого класса",
    "Мастер сержант",
    "Первый сержант",
    "Сержант-майор",
    "Команд сержант-майор",
    "Сержант-майор сухопутных войск",
    "Младший лейтенант",
    "Лейтенант",
    "Капитан",
    "Майор",
    "Подполковник",
    "Полковник",
    "Командир",
    "Командир первого класса",
    "Клон Коммандер",
    "Клон Маршал",
] as const;

type AutoReq = { label: string; type: "auto"; metric: "unitLevel" | "daysAtRank"; threshold: number };
type ManualReq = { label: string; type: "manual" };
type Req = AutoReq | ManualReq;

const RANK_REQUIREMENTS: Record<string, Req[]> = {
    "Рядовой": [
        { label: "Получить 2 уровень подразделения", type: "auto", metric: "unitLevel", threshold: 2 },
        { label: "Пройти КМБ (Курс Молодого Бойца, проходится у Специалиста и выше)", type: "manual" },
        { label: "Принять участие в любой Тренировке [1] раз", type: "manual" },
        { label: "Принять участие в Тренировке ориентирования на базе [1] раз", type: "manual" },
        { label: "Принять участие в Тренировке ориентирования на местности [1] раз", type: "manual" },
        { label: "Испытательный срок — 1 день (24 часа)", type: "auto", metric: "daysAtRank", threshold: 1 },
        { label: "Принять присягу легиона (Через микрофон, при повышении)", type: "manual" },
    ],
    "Старший рядовой": [
        { label: "Получить 3 уровень подразделения", type: "auto", metric: "unitLevel", threshold: 3 },
        { label: "Принять участие в Школе Штурма [1] раз", type: "manual" },
        { label: "Принять участие в Строевой тренировке [1] раз", type: "manual" },
        { label: "Принять участие в Тренировке по работе с зергами [1] раз", type: "manual" },
        { label: "Принять участие в Теоретической тренировке", type: "manual" },
    ],
    "Специалист": [
        { label: "Получить 4 уровень подразделения", type: "auto", metric: "unitLevel", threshold: 4 },
        { label: "Пройти Школу Специалиста (проходить у Штаб-Сержанта и выше): 1 лекция и 2 практики", type: "manual" },
        { label: "Участвовать в Школе Штурма [2] раза", type: "manual" },
        { label: "Участвовать в Тренировке по сёрфу [1] раз", type: "manual" },
        { label: "Принять участие в Квалификации на стороне проходящего [1] раз", type: "manual" },
        { label: "Пройти Экзамен", type: "manual" },
    ],
    "Капрал": [
        { label: "Получить 5 уровень подразделения", type: "auto", metric: "unitLevel", threshold: 5 },
        { label: "Пройти Школу Капрала (проходить у Сержанта первого класса и выше): 1 лекция и 2 практики", type: "manual" },
        { label: "Обучить 4-х кадетов", type: "manual" },
        { label: "Срок службы на звании — 2 дня", type: "auto", metric: "daysAtRank", threshold: 2 },
        { label: "Пройти Курс командования малым составом", type: "manual" },
        { label: "Обладать навыками проведения Курса Молодого Бойца", type: "manual" },
        { label: "Обладать навыками ведения строя на Спец. Операции", type: "manual" },
    ],
    "Сержант": [
        { label: "Получить 6 уровень подразделения", type: "auto", metric: "unitLevel", threshold: 6 },
        { label: "Пройти Школу Сержанта (проходить у Первого сержанта и выше): 3 лекции и 3 практики", type: "manual" },
        { label: "Обладать навыками проведения Школы Штурма", type: "manual" },
        { label: "Обладать навыками и умением проводить различные тренировки", type: "manual" },
        { label: "Обладать навыками и умением вести строй бойцов", type: "manual" },
        { label: "Пройти Экзамен", type: "manual" },
    ],
    "Штаб-сержант": [
        { label: "Получить 7 уровень подразделения", type: "auto", metric: "unitLevel", threshold: 7 },
        { label: "Обладать знаниями про все отделы и отряды 501-го Э.Ш.Л.", type: "manual" },
        { label: "Обладать знаниями о механиках Кристаллов и Топлива", type: "manual" },
    ],
    "Сержант первого класса": [
        { label: "Получить 8 уровень подразделения", type: "auto", metric: "unitLevel", threshold: 8 },
        { label: "Провести 1 Школу Штурма под присмотром CSM/SMA", type: "manual" },
        { label: "Пройти Квалификацию (ТСО у Сержант-майора и выше)", type: "manual" },
    ],
    "Первый сержант": [
        { label: "Получить 9 уровень подразделения", type: "auto", metric: "unitLevel", threshold: 9 },
        { label: "Выслуга на звании — 7 дней", type: "auto", metric: "daysAtRank", threshold: 7 },
        { label: "Обладать навыками и умениями проведения 'Ведения строя'", type: "manual" },
        { label: "Обладать навыками и умениями проведения 'Школ'", type: "manual" },
        { label: "Обладать навыками и умениями проведения 'Серфов'", type: "manual" },
        { label: "Обладать навыками и умениями 'Реагировать на критические ситуации'", type: "manual" },
        { label: "Провести Квалификацию бойцу Младшего Сержантского состава [1] раз", type: "manual" },
    ],
    "Сержант-майор": [
        { label: "Получить 10 уровень подразделения", type: "auto", metric: "unitLevel", threshold: 10 },
        { label: "Обладать навыками и умениями проводить 'Квалификации'", type: "manual" },
        { label: "Пройти опрос у CSM/SMA", type: "manual" },
        { label: "Пройти квалификацию (Проходить у CSM/SMA)", type: "manual" },
        { label: "Пройти индивидуальное занятие у представителя Командирского состава", type: "manual" },
    ],
    "Команд сержант-майор": [
        { label: "Срок выслуги на звании Сержант+ не менее 7 дней", type: "auto", metric: "daysAtRank", threshold: 7 },
        { label: "Назначение по решению Командирского состава 501-го Э.Ш.Л.", type: "manual" },
    ],
    "Сержант-майор сухопутных войск": [
        { label: "Срок выслуги на звании Сержант+ не менее 7 дней", type: "auto", metric: "daysAtRank", threshold: 7 },
        { label: "Назначение по решению Командирского состава 501-го Э.Ш.Л.", type: "manual" },
    ],
    "Младший лейтенант": [
        { label: "Пройти Школу Офицеров (проходить у Капитана и выше): 3 лекции и 3 практики", type: "manual" },
        { label: "Выслуга на звании — 14 дней", type: "auto", metric: "daysAtRank", threshold: 14 },
        { label: "Пройти курс Первой помощи", type: "manual" },
        { label: "Решение Командирского состава 501-го Э.Ш.Л.", type: "manual" },
    ],
    "Лейтенант": [
        { label: "Пройти Школу Офицеров (проходить у Капитана и выше): 3 лекции и 3 практики", type: "manual" },
        { label: "Выслуга на звании — 14 дней", type: "auto", metric: "daysAtRank", threshold: 14 },
        { label: "Пройти курс Первой помощи", type: "manual" },
        { label: "Решение Командирского состава 501-го Э.Ш.Л.", type: "manual" },
    ],
    "Капитан": [
        { label: "Пройти Академию Офицеров", type: "manual" },
        { label: "Выслуга на звании — не менее 14 дней", type: "auto", metric: "daysAtRank", threshold: 14 },
        { label: "Пройти курс Первой помощи", type: "manual" },
        { label: "Решение Командирского состава 501-го Э.Ш.Л.", type: "manual" },
    ],
    "Майор": [
        { label: "Решение Командирского состава 501-го Э.Ш.Л.", type: "manual" },
        { label: "Назначение / Одобрение Высшего руководства Легиона", type: "manual" },
    ],
    "Подполковник": [
        { label: "Решение Командирского состава 501-го Э.Ш.Л.", type: "manual" },
        { label: "Назначение / Одобрение Высшего руководства Легиона", type: "manual" },
    ],
    "Полковник": [
        { label: "Решение Командирского состава 501-го Э.Ш.Л.", type: "manual" },
        { label: "Назначение / Одобрение Высшего руководства Легиона", type: "manual" },
    ],
    "Командир": [
        { label: "Решение Командирского состава 501-го Э.Ш.Л.", type: "manual" },
        { label: "Назначение / Одобрение Высшего руководства Легиона", type: "manual" },
    ],
    "Командир первого класса": [
        { label: "Решение Командирского состава 501-го Э.Ш.Л.", type: "manual" },
        { label: "Назначение / Одобрение Высшего руководства Легиона", type: "manual" },
    ],
    "Клон Коммандер": [
        { label: "Решение Командирского состава 501-го Э.Ш.Л.", type: "manual" },
        { label: "Назначение / Одобрение Высшего руководства Легиона", type: "manual" },
    ],
    "Клон Маршал": [
        { label: "Решение Командирского состава 501-го Э.Ш.Л.", type: "manual" },
        { label: "Назначение / Одобрение Высшего руководства Легиона", type: "manual" },
    ],
};

async function seedRanks() {
    console.log("Очистка устаревших званий и критериев...");
    await db.delete(rankRequirements);
    await db.delete(ranks);

    console.log("Заполнение званий и регламентированных критериев...");

    for (let i = 0; i < RANK_LADDER.length; i++) {
        const rankName = RANK_LADDER[i];
        const order = i + 1;

        const [inserted] = await db.insert(ranks).values({
        name: rankName,
        order,
        });

        const rankId = inserted.insertId;

        const reqList = RANK_REQUIREMENTS[rankName];
        if (reqList && reqList.length > 0) {
        const formattedReqs = reqList.map((req) => ({
            rankId,
            description: req.label,
            type: req.type,
            metric: req.type === "auto" ? req.metric : null,
            threshold: req.type === "auto" ? req.threshold : null,
        }));

        await db.insert(rankRequirements).values(formattedReqs);
        }
    }

    console.log("База данных успешно обновлена!");
    process.exit(0);
    }

    seedRanks().catch((err) => {
    console.error("Ошибка обновления:", err);
    process.exit(1);
});