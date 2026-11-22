import type { ActivityEvent, ActivityFilters, ActivityStats } from "@/types";
import { activitiesMockData } from "@/mocks/activity";

const STORAGE_KEY = "adpilot_activity";
const DELAY_MS = 400;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function readActivitiesFromStorage(): ActivityEvent[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      console.warn("[activityService] localStorage содержит не массив, игнорируем");
      return null;
    }
    return parsed as ActivityEvent[];
  } catch (err) {
    console.error("[activityService] Ошибка чтения localStorage:", err);
    return null;
  }
}

function writeActivitiesToStorage(activities: ActivityEvent[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
  } catch (err) {
    console.error("[activityService] Ошибка записи localStorage:", err);
  }
}

let activitiesCache: ActivityEvent[] | null = null;

function ensureInitialized(): ActivityEvent[] {
  if (activitiesCache !== null) {
    return activitiesCache;
  }

  const stored = readActivitiesFromStorage();
  if (stored !== null) {
    activitiesCache = stored;
    return activitiesCache;
  }

  activitiesCache = [...activitiesMockData];
  writeActivitiesToStorage(activitiesCache);
  return activitiesCache;
}

export const activityService = {
  async getActivities(filters?: ActivityFilters): Promise<ActivityEvent[]> {
    await delay(DELAY_MS);
    const activities = ensureInitialized();
    let result = [...activities];

    if (filters) {
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        result = result.filter(
          (a) =>
            a.campaignName.toLowerCase().includes(query) ||
            a.description.toLowerCase().includes(query)
        );
      }

      if (filters.selectedType && filters.selectedType !== "all") {
        result = result.filter((a) => a.type === filters.selectedType);
      }
    }

    // По умолчанию сортировка по убыванию даты (новые первыми)
    result.sort((a, b) => b.timestamp.localeCompare(a.timestamp));

    if (filters?.sortBy === "timestamp" && filters.sortDirection === "asc") {
      result.reverse();
    }

    return result;
  },

  async createActivityEvent(event: Omit<ActivityEvent, "id">): Promise<ActivityEvent> {
    await delay(DELAY_MS);
    const activities = ensureInitialized();
    const newEvent: ActivityEvent = {
      ...event,
      id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    };
    activities.unshift(newEvent);
    writeActivitiesToStorage(activities);
    activitiesCache = activities;
    return newEvent;
  },

  async getActivityStats(): Promise<ActivityStats> {
    await delay(DELAY_MS);
    const activities = ensureInitialized();

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    const totalEvents = activities.length;
    const eventsToday = activities.filter((a) => {
      const eventTime = new Date(a.timestamp);
      return eventTime >= startOfToday && eventTime < startOfTomorrow;
    }).length;
    const campaignsCreated = activities.filter(
      (a) => a.type === "campaign_created"
    ).length;
    const campaignsUpdated = activities.filter(
      (a) =>
        a.type === "campaign_updated" ||
        a.type === "campaign_budget_changed" ||
        a.type === "campaign_channels_changed"
    ).length;

    return {
      totalEvents,
      eventsToday,
      campaignsCreated,
      campaignsUpdated,
    };
  },
};
