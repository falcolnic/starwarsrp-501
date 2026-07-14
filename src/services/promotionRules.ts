export const RANK_LADDER = [
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

export type Rank = typeof RANK_LADDER[number];

export interface AutoRequirement {
  id: string;
  label: string;
  type: "auto";
  metric: "totalHours" | "sessions" | "daysAtRank" | "unitLevel";
  threshold: number;
}

export interface ManualRequirement {
  id: string;
  label: string;
  type: "manual";
}

export type Requirement = AutoRequirement | ManualRequirement;

export interface RequirementStatus {
  requirement: Requirement;
  completed: boolean;
  current?: number;
  target?: number;
}

export const RANK_REQUIREMENTS: Record<string, Requirement[]> = {
  "Рядовой": [
    { id: "unit_lvl_2", label: "Получить 2 уровень подразделения", type: "auto", metric: "unitLevel", threshold: 2 },
    { id: "kmb", label: "Успешно пройти КМБ (у Специалиста и выше)", type: "manual" },
    { id: "any_training_1", label: "Принять участие в любой тренировке (1 раз)", type: "manual" },
    { id: "drill_training_1", label: "Принять участие в строевой тренировке (1 раз)", type: "manual" },
    { id: "terrain_training_1", label: "Принять участие в тренировке ориентирования на местности (1 раз)", type: "manual" },
    { id: "trial_24h", label: "Испытательный срок на звании — 1 день (24 часа)", type: "auto", metric: "daysAtRank", threshold: 1 },
    { id: "oath", label: "Принять присягу легиона через микрофон при повышении", type: "manual" },
  ],
  "Старший рядовой": [
    { id: "unit_lvl_3", label: "Получить 3 уровень подразделения", type: "auto", metric: "unitLevel", threshold: 3 },
    { id: "assault_school_1", label: "Принять участие в Школе Штурма (1 раз)", type: "manual" },
    { id: "any_training_2", label: "Принять участие в любой тренировке (2 раза)", type: "manual" },
    { id: "spec_training_1", label: "Участвовать в специальной тренировке (1 раз)", type: "manual" },
    { id: "spec_ops_zerg_droid_2", label: "Участвовать в спец. операции по ликвидации зергов или дроидов (2 раза)", type: "manual" },
    { id: "zerg_combat_1", label: "Принять участие в тренировке по работе с зергами (1 раз)", type: "manual" },
    { id: "qualification_passing_1", label: "Принять участие в квалификации на стороне проходящего (1 раз)", type: "manual" },
  ],
  "Специалист": [
    { id: "unit_lvl_4", label: "Получить 4 уровень подразделения", type: "auto", metric: "unitLevel", threshold: 4 },
    { id: "specialist_school", label: "Пройти Школу Специалиста (у Штаб-Сержанта и выше): 1 лекция и 2 практики", type: "manual" },
    { id: "assault_school_2", label: "Участвовать в Школе Штурма (2 раза)", type: "manual" },
    { id: "spec_training_1", label: "Участвовать в специальной тренировке (1 раз)", type: "manual" },
    { id: "surf_training_1", label: "Участвовать в тренировке по сёрфу (1 раз)", type: "manual" },
    { id: "qualification_passing_1", label: "Принять участие в квалификации на стороне проходящего (1 раз)", type: "manual" },
    { id: "exam_spec", label: "Успешно сдать экзамен", type: "manual" },
    { id: "theory_training_1", label: "Принять участие в теоретической тренировке (1 раз)", type: "manual" },
  ],
  "Капрал": [
    { id: "unit_lvl_5", label: "Получить 5 уровень подразделения", type: "auto", metric: "unitLevel", threshold: 5 },
    { id: "corporal_school", label: "Пройти Школу Капрала (у Сержанта 1-го класса и выше): 1 лекция и 2 практики", type: "manual" },
    { id: "train_cadets_4", label: "Обучить 4-х кадетов", type: "manual" },
    { id: "service_2d", label: "Срок выслуги на звании — не менее 2 дней", type: "auto", metric: "daysAtRank", threshold: 2 },
    { id: "lead_assault_1", label: "Вести отряд на Школе Штурма (1 раз)", type: "manual" },
    { id: "lead_spec_op_success", label: "Вести успешно отряд на спец. операции (с оценкой 4/5+ от Сержанта 1-го класса)", type: "manual" },
    { id: "theory_training_2", label: "Принять участие в теоретической тренировке (2 раза)", type: "manual" },
  ],
  "Сержант": [
    { id: "unit_lvl_6", label: "Получить 6 уровень подразделения", type: "auto", metric: "unitLevel", threshold: 6 },
    { id: "sergeant_school", label: "Пройти Школу Сержанта (у Первого сержанта и выше): 3 лекции и 3 практики", type: "manual" },
    { id: "lead_assault_2", label: "Вести отряд на Школе Штурма (2 раза)", type: "manual" },
    { id: "lead_spec_op_1", label: "Вести отряд на спец. операции (1 раз)", type: "manual" },
    { id: "exam_sgt", label: "Успешно сдать экзамен", type: "manual" },
    { id: "personal_target_frozen", label: "Выполнить личный критерий от CSM/SMA (Заморожено)", type: "manual" },
    { id: "interview_file_frozen", label: "Пройти собеседование с составлением личного дела (Заморожено)", type: "manual" },
    { id: "service_5d", label: "Срок выслуги на звании — не менее 5 дней", type: "auto", metric: "daysAtRank", threshold: 5 },
    { id: "theory_training_2", label: "Принять участие в теоретической тренировке (2 раза)", type: "manual" },
  ],
  "Штаб-сержант": [
    { id: "unit_lvl_7", label: "Получить 7 уровень подразделения", type: "auto", metric: "unitLevel", threshold: 7 },
    { id: "service_5d", label: "Срок выслуги на звании — не менее 5 дней", type: "auto", metric: "daysAtRank", threshold: 5 },
    { id: "conduct_trainings_4", label: "Провести самостоятельно 4 тренировки", type: "manual" },
    { id: "conduct_ind_training_csm", label: "Провести 1 индивидуальную тренировку под присмотром CSM/SMA", type: "manual" },
    { id: "lead_spec_op_2", label: "Вести отряд на спец. операции (2 раза)", type: "manual" },
    { id: "lead_assault_2", label: "Вести отряд на Школе Штурма (2 раза)", type: "manual" },
    { id: "join_department", label: "Официально вступить в один из отделов: RD / INT / COM / DSD", type: "manual" },
    { id: "pass_tso_qualification", label: "Пройти квалификацию ТСО (принимает Первый Сержант и выше)", type: "manual" },
    { id: "submit_tso_plot", label: "Написать продуманный сюжет квалификации и отправить на одобрение CSM/SMA", type: "manual" },
  ],
  "Сержант первого класса": [
    { id: "unit_lvl_8", label: "Получить 8 уровень подразделения", type: "auto", metric: "unitLevel", threshold: 8 },
    { id: "service_6d", label: "Срок выслуги на звании — не менее 6 дней", type: "auto", metric: "daysAtRank", threshold: 6 },
    { id: "conduct_trainings_5", label: "Провести самостоятельно 5 тренировок", type: "manual" },
    { id: "conduct_ind_training_csm", label: "Провести 1 индивидуальную тренировку под присмотром CSM/SMA", type: "manual" },
    { id: "conduct_specialist_school_2", label: "Провести школу Специалиста (2 раза)", type: "manual" },
    { id: "conduct_assault_school_csm", label: "Провести 1 школу штурма под присмотром CSM/SMA", type: "manual" },
    { id: "dept_active_service", label: "Исправно выполнять задачи в отделе RD / INT / COM / DSD", type: "manual" },
    { id: "pass_tso_higher", label: "Пройти квалификацию ТСО (принимает Сержант-Майор и выше)", type: "manual" },
    { id: "lead_spec_op_3", label: "Вести отряд на спец. операции (3 раза)", type: "manual" },
    { id: "submit_tso_plot", label: "Написать сюжет квалификации (ТСО) и отправить на рассмотрение CSM/SMA", type: "manual" },
  ],
  "Первый сержант": [
    { id: "unit_lvl_9", label: "Получить 9 уровень подразделения", type: "auto", metric: "unitLevel", threshold: 9 },
    { id: "service_7d", label: "Срок выслуги на звании — не менее 7 дней", type: "auto", metric: "daysAtRank", threshold: 7 },
    { id: "conduct_trainings_6", label: "Провести самостоятельно 6 тренировок", type: "manual" },
    { id: "personal_task_csm", label: "Выполнить персональную задачу от CSM/SMA", type: "manual" },
    { id: "conduct_spec_trainings_2", label: "Провести 2 специальные тренировки", type: "manual" },
    { id: "conduct_assault_schools_2", label: "Провести 2 Школы Штурма", type: "manual" },
    { id: "dept_active_service", label: "Исправно выполнять задачи в отделе RD / INT / COM / DSD", type: "manual" },
    { id: "conduct_corporal_qualification", label: "Провести Квалификацию школы Капрала", type: "manual" },
    { id: "lead_spec_op_3", label: "Вести отряд на спец. операции (3 раза)", type: "manual" },
    { id: "submit_tso_plot", label: "Написать сюжет квалификации (ТСО) и отправить на рассмотрение CSM/SMA", type: "manual" },
    { id: "pass_tso_csm_above", label: "Успешно пройти квалификацию (принимает Команд сержант-майор и выше)", type: "manual" },
  ],
  "Сержант-майор": [
    { id: "unit_lvl_10", label: "Получить 10 уровень подразделения", type: "auto", metric: "unitLevel", threshold: 10 },
    { id: "service_8d", label: "Срок выслуги на звании — не менее 8 дней", type: "auto", metric: "daysAtRank", threshold: 8 },
    { id: "conduct_trainings_6", label: "Провести самостоятельно 6 тренировок", type: "manual" },
    { id: "personal_task_sma", label: "Выполнить персональную задачу от SMA", type: "manual" },
    { id: "conduct_spec_trainings_4", label: "Провести 4 специальные тренировки", type: "manual" },
    { id: "conduct_assault_schools_3", label: "Провести 3 Школы Штурма", type: "manual" },
    { id: "dept_active_service", label: "Исправно выполнять задачи в отделе RD / INT / COM / DSD", type: "manual" },
    { id: "conduct_qualification_2", label: "Провести самостоятельно 2 Квалификации", type: "manual" },
    { id: "interview_sma", label: "Пройти устное собеседование с SMA", type: "manual" },
    { id: "submit_tso_plot", label: "Написать сюжет квалификации (ТСО) и отправить на рассмотрение CSM/SMA", type: "manual" },
    { id: "pass_tso_csm_sma", label: "Успешно пройти квалификацию у CSM/SMA", type: "manual" },
  ],
  "Команд сержант-майор": [
    { id: "sgt_service_7d", label: "Общая выслуга на звании Сержант+ не менее 7 дней", type: "auto", metric: "daysAtRank", threshold: 7 },
    { id: "co_approval", label: "Решение и назначение Командирского состава 501-го Э.Ш.Л.", type: "manual" },
  ],
  "Сержант-майор сухопутных войск": [
    { id: "sgt_service_7d", label: "Общая выслуга на звании Сержант+ не менее 7 дней", type: "auto", metric: "daysAtRank", threshold: 7 },
    { id: "co_approval", label: "Решение и назначение Командирского состава 501-го Э.Ш.Л.", type: "manual" },
  ],
  "Младший лейтенант": [
    { id: "officer_school_3_3", label: "Пройти Школу Офицеров (у Капитана и выше): 3 лекции и 3 практики", type: "manual" },
    { id: "service_14d", label: "Срок выслуги на звании — не менее 14 дней", type: "auto", metric: "daysAtRank", threshold: 14 },
    { id: "first_aid_course", label: "Пройти расширенный курс Первой Помощи", type: "manual" },
    { id: "co_approval", label: "Решение и утверждение Командирского состава 501-го Э.Ш.Л.", type: "manual" },
  ],
  "Лейтенант": [
    { id: "officer_school_3_3", label: "Пройти Школу Офицеров (у Капитана и выше): 3 лекции и 3 практики", type: "manual" },
    { id: "service_14d", label: "Срок выслуги на звании — не менее 14 дней", type: "auto", metric: "daysAtRank", threshold: 14 },
    { id: "first_aid_course", label: "Пройти расширенный курс Первой Помощи", type: "manual" },
    { id: "co_approval", label: "Решение и утверждение Командирского состава 501-го Э.Ш.Л.", type: "manual" },
  ],
  "Капитан": [
    { id: "officer_academy", label: "Успешно пройти Академию Офицеров", type: "manual" },
    { id: "service_flexible", label: "Срок выслуги: 14 дней (из Мл. Лейтенанта+) или 28 дней (из Сержанта-майора+)", type: "auto", metric: "daysAtRank", threshold: 14 },
    { id: "first_aid_course", label: "Пройти курс Первой Помощи", type: "manual" },
    { id: "co_approval", label: "Решение и утверждение Командирского состава 501-го Э.Ш.Л.", type: "manual" },
  ],
  // All ranks above Captain are direct Command Staff assignments based on merit
  "Майор": [
    { id: "co_approval", label: "Решение Командирского состава 501-го Э.Ш.Л.", type: "manual" },
    { id: "hc_nomination", label: "Назначение / Одобрение Высшего руководства Легиона", type: "manual" },
  ],
  "Подполковник": [
    { id: "co_approval", label: "Решение Командирского состава 501-го Э.Ш.Л.", type: "manual" },
    { id: "hc_nomination", label: "Назначение / Одобрение Высшего руководства Легиона", type: "manual" },
  ],
  "Полковник": [
    { id: "co_approval", label: "Решение Командирского состава 501-го Э.Ш.Л.", type: "manual" },
    { id: "hc_nomination", label: "Назначение / Одобрение Высшего руководства Легиона", type: "manual" },
  ],
  "Командир": [
    { id: "co_approval", label: "Решение Командирского состава 501-го Э.Ш.Л.", type: "manual" },
    { id: "hc_nomination", label: "Назначение / Одобрение Высшего руководства Легиона", type: "manual" },
  ],
  "Командир первого класса": [
    { id: "co_approval", label: "Решение Командирского состава 501-го Э.Ш.Л.", type: "manual" },
    { id: "hc_nomination", label: "Назначение / Одобрение Высшего руководства Легиона", type: "manual" },
  ],
  "Клон Коммандер": [
    { id: "co_approval", label: "Решение Командирского состава 501-го Э.Ш.Л.", type: "manual" },
    { id: "hc_nomination", label: "Назначение / Одобрение Высшего руководства Легиона", type: "manual" },
  ],
  "Клон Маршал": [
    { id: "co_approval", label: "Решение Командирского состава 501-го Э.Ш.Л.", type: "manual" },
    { id: "hc_nomination", label: "Назначение / Одобрение Высшего руководства Легиона", type: "manual" },
  ],
};

export function getNextRank(currentRank: string): Rank | null {
  const idx = RANK_LADDER.indexOf(currentRank as Rank);
  if (idx === -1 || idx === RANK_LADDER.length - 1) return null;
  return RANK_LADDER[idx + 1];
}

export function getRankIndex(rank: string): number {
  return RANK_LADDER.indexOf(rank as Rank);
}

export function evaluateRequirements(
  nextRank: Rank,
  botData: { totalHours: number; sessions: number; daysAtRank: number; unitLevel?: number },
  manualCompleted: string[]
): RequirementStatus[] {
  const reqs = RANK_REQUIREMENTS[nextRank] ?? [];
  return reqs.map((req) => {
    if (req.type === "auto") {
      const current = botData[req.metric] ?? 0;
      return { 
        requirement: req, 
        completed: current >= req.threshold, 
        current, 
        target: req.threshold 
      };
    }
    return { 
      requirement: req, 
      completed: manualCompleted.includes(req.id) 
    };
  });
}
