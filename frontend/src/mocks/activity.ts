import type { ActivityEvent } from "@/types";

/**
 * Демонстрационные события журнала активности.
 * ВНИМАНИЕ: все события являются вымышленными тестовыми данными.
 * Они не отражают реальные действия пользователей и созданы только для демонстрации интерфейса.
 */
export const activitiesMockData: ActivityEvent[] = [
  {
    id: "a1",
    type: "campaign_created",
    campaignId: "1",
    campaignName: "Весенняя акция 2026",
    description: "Создана рекламная кампания",
    timestamp: "2026-10-25T10:30:00.000Z",
  },
  {
    id: "a2",
    type: "campaign_created",
    campaignId: "2",
    campaignName: "Летний розыгрыш",
    description: "Создана рекламная кампания",
    timestamp: "2026-10-23T14:15:00.000Z",
  },
  {
    id: "a3",
    type: "campaign_created",
    campaignId: "3",
    campaignName: "Осенний запуск",
    description: "Создана рекламная кампания",
    timestamp: "2026-10-20T09:45:00.000Z",
  },
  {
    id: "a4",
    type: "campaign_created",
    campaignId: "4",
    campaignName: "Чёрная пятница — Vorbereitung",
    description: "Создана рекламная кампания",
    timestamp: "2026-10-18T16:20:00.000Z",
  },
  {
    id: "a5",
    type: "campaign_created",
    campaignId: "5",
    campaignName: "Брендовый охват",
    description: "Создана рекламная кампания",
    timestamp: "2026-10-15T11:10:00.000Z",
  },
  {
    id: "a6",
    type: "campaign_created",
    campaignId: "6",
    campaignName: "Технологический обзор",
    description: "Создана рекламная кампания",
    timestamp: "2026-11-01T08:00:00.000Z",
  },
  {
    id: "a7",
    type: "campaign_budget_changed",
    campaignId: "1",
    campaignName: "Весенняя акция 2026",
    description: "Изменён бюджет кампании",
    timestamp: "2026-11-10T12:00:00.000Z",
    details: { oldBudget: 45000, newBudget: 50000 },
  },
  {
    id: "a8",
    type: "campaign_channels_changed",
    campaignId: "5",
    campaignName: "Брендовый охват",
    description: "Изменён список рекламных каналов",
    timestamp: "2026-11-12T09:30:00.000Z",
    details: {
      addedChannelIds: ["8"],
      removedChannelIds: [],
    },
  },
  {
    id: "a9",
    type: "campaign_updated",
    campaignId: "3",
    campaignName: "Осенний запуск",
    description: "Обновлены параметры кампании",
    timestamp: "2026-12-01T14:45:00.000Z",
    details: { changedFields: ["endDate", "status"] },
  },
];
