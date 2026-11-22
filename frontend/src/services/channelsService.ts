import type { Channel } from "@/types";
import { channelsMockData } from "@/mocks/channels";

export interface ChannelFilters {
  searchQuery: string;
  selectedTopic: string | null;
  sortBy: "subscribers" | "er" | "cpm" | "placementCost" | null;
  sortDirection: "asc" | "desc";
}

export interface ChannelStats {
  totalChannels: number;
  activeChannels: number;
  averageER: number;
  averageCPM: number;
}

const DELAY_MS = 400;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const channelsService = {
  async getChannels(filters: ChannelFilters): Promise<Channel[]> {
    await delay(DELAY_MS);
    let result = [...channelsMockData];

    // Поиск по названию (регистронезависимо)
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase().trim();
      result = result.filter((c) => c.name.toLowerCase().includes(query));
    }

    // Фильтр по тематике
    if (filters.selectedTopic) {
      result = result.filter((c) => c.topic === filters.selectedTopic);
    }

    // Сортировка
    if (filters.sortBy) {
      result.sort((a, b) => {
        const sortBy = filters.sortBy as keyof Channel;
        const aVal = a[sortBy] as number;
        const bVal = b[sortBy] as number;
        if (filters.sortDirection === "asc") {
          return aVal - bVal;
        }
        return bVal - aVal;
      });
    }

    return result;
  },

  async getChannelById(id: string): Promise<Channel | undefined> {
    await delay(DELAY_MS);
    return channelsMockData.find((c) => c.id === id);
  },

  async getStats(): Promise<ChannelStats> {
    await delay(DELAY_MS);
    const total = channelsMockData.length;
    const active = channelsMockData.filter((c) => c.isActive).length;
    const avgER = channelsMockData.reduce((sum, c) => sum + c.er, 0) / total;
    const avgCPM = channelsMockData.reduce((sum, c) => sum + c.cpm, 0) / total;

    return {
      totalChannels: total,
      activeChannels: active,
      averageER: Math.round(avgER * 100) / 100,
      averageCPM: Math.round(avgCPM),
    };
  },

  async getUniqueTopics(): Promise<string[]> {
    await delay(DELAY_MS);
    const topics = new Set(channelsMockData.map((c) => c.topic));
    return Array.from(topics).sort();
  },
};