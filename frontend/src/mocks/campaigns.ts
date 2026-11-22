import type { Campaign } from "@/types";

/**
 * Демонстрационные данные рекламных кампаний.
 * ВНИМАНИЕ: все кампании и показатели являются вымышленными тестовыми данными.
 * Они не относятся к реальным рекламным кампаниям и не отражают действительные метрики.
 */
export const campaignsMockData: Campaign[] = [
  {
    id: "1",
    name: "Весенняя акция 2026",
    description: "Рекламная кампания для продвижения весенней коллекции товаров.",
    budget: 50000,
    startDate: "2026-03-01",
    endDate: "2026-03-31",
    status: "active",
    selectedChannels: [
      { channelId: "1", placementCostSnapshot: 17500 },
      { channelId: "4", placementCostSnapshot: 14400 },
    ],
    totalPlacementCost: 31900,
    remainingBudget: 18100,
    createdAt: "2026-10-25",
    updatedAt: "2026-11-10",
  },
  {
    id: "2",
    name: "Летний розыгрыш",
    description: "Кампания с розыгрышем призов среди подписчиков партнёрских каналов.",
    budget: 30000,
    startDate: "2026-06-01",
    endDate: "2026-06-30",
    status: "active",
    selectedChannels: [
      { channelId: "6", placementCostSnapshot: 13200 },
    ],
    totalPlacementCost: 13200,
    remainingBudget: 16800,
    createdAt: "2026-10-23",
    updatedAt: "2026-11-05",
  },
  {
    id: "3",
    name: "Осенний запуск",
    description: "Запуск нового продукта на осенний сезон.",
    budget: 75000,
    startDate: "2026-09-01",
    endDate: "2026-11-30",
    status: "completed",
    selectedChannels: [
      { channelId: "3", placementCostSnapshot: 33600 },
      { channelId: "10", placementCostSnapshot: 18000 },
    ],
    totalPlacementCost: 51600,
    remainingBudget: 23400,
    createdAt: "2026-10-20",
    updatedAt: "2026-12-01",
  },
  {
    id: "4",
    name: "Чёрная пятница — Vorbereitung",
    description: "Подготовительная кампания перед Чёрной пятницей.",
    budget: 100000,
    startDate: "2026-11-01",
    endDate: "2026-11-30",
    status: "draft",
    selectedChannels: [
      { channelId: "5", placementCostSnapshot: 30000 },
      { channelId: "12", placementCostSnapshot: 27000 },
    ],
    totalPlacementCost: 57000,
    remainingBudget: 43000,
    createdAt: "2026-10-18",
  },
  {
    id: "5",
    name: "Брендовый охват",
    description: "Повышение узнаваемости бренда в целевой аудитории.",
    budget: 40000,
    startDate: "2026-10-01",
    endDate: "2026-10-31",
    status: "paused",
    selectedChannels: [
      { channelId: "2", placementCostSnapshot: 9800 },
      { channelId: "8", placementCostSnapshot: 10800 },
    ],
    totalPlacementCost: 20600,
    remainingBudget: 19400,
    createdAt: "2026-10-15",
    updatedAt: "2026-11-12",
  },
  {
    id: "6",
    name: "Технологический обзор",
    description: "Обзор новых технологий и гаджетов в партнёрских каналах.",
    budget: 60000,
    startDate: "2026-12-01",
    endDate: "2026-12-31",
    status: "planned",
    selectedChannels: [
      { channelId: "1", placementCostSnapshot: 17500 },
      { channelId: "7", placementCostSnapshot: 16500 },
      { channelId: "11", placementCostSnapshot: 20150 },
    ],
    totalPlacementCost: 54150,
    remainingBudget: 5850,
    createdAt: "2026-11-01",
  },
];