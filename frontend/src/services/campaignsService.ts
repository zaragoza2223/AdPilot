import type { Campaign, CampaignFilters, CampaignInput, CampaignStats } from "@/types";
import { channelsMockData } from "@/mocks/channels";
import { campaignsMockData } from "@/mocks/campaigns";

const STORAGE_KEY = "adpilot_campaigns";
const DELAY_MS = 400;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function readCampaignsFromStorage(): Campaign[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      console.warn("[campaignsService] localStorage содержит не массив, игнорируем");
      return null;
    }
    return parsed as Campaign[];
  } catch (err) {
    console.error("[campaignsService] Ошибка чтения localStorage:", err);
    return null;
  }
}

function writeCampaignsToStorage(campaigns: Campaign[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
  } catch (err) {
    console.error("[campaignsService] Ошибка записи localStorage:", err);
  }
}

let campaignsCache: Campaign[] | null = null;

function ensureInitialized(): Campaign[] {
  if (campaignsCache !== null) {
    return campaignsCache;
  }

  const stored = readCampaignsFromStorage();
  if (stored !== null) {
    campaignsCache = stored;
    return campaignsCache;
  }

  campaignsCache = [...campaignsMockData];
  writeCampaignsToStorage(campaignsCache);
  return campaignsCache;
}

function validateCampaignInput(
  input: CampaignInput
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!input.name || !input.name.trim()) {
    errors.push("Укажите название кампании");
  }

  if (!input.budget || input.budget <= 0) {
    errors.push("Бюджет должен быть больше нуля");
  }

  if (!input.selectedChannelIds || input.selectedChannelIds.length === 0) {
    errors.push("Выберите хотя бы один рекламный канал");
  }

  const channelIdsInCatalog = new Set(channelsMockData.map((c) => c.id));
  for (const channelId of input.selectedChannelIds) {
    if (!channelIdsInCatalog.has(channelId)) {
      errors.push(`Канал с ID ${channelId} не найден в каталоге`);
    }
  }

  if (input.budget > 0 && input.selectedChannelIds.length > 0) {
    const totalCost = input.selectedChannelIds.reduce((sum, channelId) => {
      const channel = channelsMockData.find((c) => c.id === channelId);
      return sum + (channel ? channel.placementCost : 0);
    }, 0);
    if (totalCost > input.budget) {
      errors.push("Стоимость размещений превышает бюджет кампании");
    }
  }

  if (input.startDate && input.endDate && input.endDate < input.startDate) {
    errors.push("Дата окончания не может быть раньше даты начала");
  }

  return { valid: errors.length === 0, errors };
}
export const campaignsService = {
  async getCampaigns(filters?: CampaignFilters): Promise<Campaign[]> {
    await delay(DELAY_MS);
    const campaigns = ensureInitialized();
    let result = [...campaigns];

    if (filters) {
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        result = result.filter((c) => c.name.toLowerCase().includes(query));
      }

      if (filters.selectedStatus) {
        result = result.filter((c) => c.status === filters.selectedStatus);
      }

      if (filters.sortBy) {
        result.sort((a, b) => {
          const aVal = a[filters.sortBy as keyof Campaign];
          const bVal = b[filters.sortBy as keyof Campaign];
          if (filters.sortDirection === "asc") {
            return String(aVal).localeCompare(String(bVal));
          }
          return String(bVal).localeCompare(String(aVal));
        });
      }
    }

    return result;
  },

  async getCampaignById(id: string): Promise<Campaign | undefined> {
    await delay(DELAY_MS);
    const campaigns = ensureInitialized();
    return campaigns.find((c) => c.id === id);
  },

  async createCampaign(input: CampaignInput): Promise<Campaign> {
    await delay(DELAY_MS);

    const validation = validateCampaignInput(input);
    if (!validation.valid) {
      throw new Error(validation.errors.join(". "));
    }

    const campaigns = ensureInitialized();

    const selectedChannels = input.selectedChannelIds.map((channelId) => {
      const channel = channelsMockData.find((c) => c.id === channelId);
      return {
        channelId,
        placementCostSnapshot: channel ? channel.placementCost : 0,
      };
    });

    const totalPlacementCost = selectedChannels.reduce(
      (sum, sc) => sum + sc.placementCostSnapshot,
      0
    );

    const now = new Date().toISOString().split("T")[0];

    const newCampaign: Campaign = {
      id: Date.now().toString(),
      name: input.name.trim(),
      description: input.description.trim(),
      budget: input.budget,
      startDate: input.startDate,
      endDate: input.endDate,
      status: "draft",
      selectedChannels,
      totalPlacementCost,
      remainingBudget: input.budget - totalPlacementCost,
      createdAt: now,
      updatedAt: now,
    };

    campaigns.push(newCampaign);
    writeCampaignsToStorage(campaigns);
    campaignsCache = campaigns;

    return newCampaign;
  },

  async updateCampaign(
    id: string,
    input: Partial<CampaignInput>
  ): Promise<Campaign> {
    await delay(DELAY_MS);

    const campaigns = ensureInitialized();
    const campaignIndex = campaigns.findIndex((c) => c.id === id);
    if (campaignIndex === -1) {
      throw new Error(`Кампания с ID ${id} не найдена`);
    }

    const existing = campaigns[campaignIndex];

    const mergedInput: CampaignInput = {
      name: input.name ?? existing.name,
      description: input.description ?? existing.description,
      budget: input.budget ?? existing.budget,
      startDate: input.startDate ?? existing.startDate,
      endDate: input.endDate ?? existing.endDate,
      selectedChannelIds:
        input.selectedChannelIds ?? existing.selectedChannels.map((sc) => sc.channelId),
    };

    const validation = validateCampaignInput(mergedInput);
    if (!validation.valid) {
      throw new Error(validation.errors.join(". "));
    }

    let selectedChannels = existing.selectedChannels;
    let totalPlacementCost = existing.totalPlacementCost;

    if (input.selectedChannelIds) {
      selectedChannels = input.selectedChannelIds.map((channelId) => {
        const channel = channelsMockData.find((c) => c.id === channelId);
        return {
          channelId,
          placementCostSnapshot: channel ? channel.placementCost : 0,
        };
      });
      totalPlacementCost = selectedChannels.reduce(
        (sum, sc) => sum + sc.placementCostSnapshot,
        0
      );
    }

    const now = new Date().toISOString().split("T")[0];

    const updatedCampaign: Campaign = {
      ...existing,
      name: input.name ?? existing.name,
      description: input.description ?? existing.description,
      budget: input.budget ?? existing.budget,
      startDate: input.startDate ?? existing.startDate,
      endDate: input.endDate ?? existing.endDate,
      selectedChannels,
      totalPlacementCost,
      remainingBudget: (input.budget ?? existing.budget) - totalPlacementCost,
      updatedAt: now,
    };

    campaigns[campaignIndex] = updatedCampaign;
    writeCampaignsToStorage(campaigns);
    campaignsCache = campaigns;

    return updatedCampaign;
  },

  async getCampaignStats(): Promise<CampaignStats> {
    await delay(DELAY_MS);
    const campaigns = ensureInitialized();

    const totalCampaigns = campaigns.length;
    const draftCampaigns = campaigns.filter((c) => c.status === "draft").length;
    const plannedCampaigns = campaigns.filter((c) => c.status === "planned").length;
    const activeCampaigns = campaigns.filter((c) => c.status === "active").length;
    const pausedCampaigns = campaigns.filter((c) => c.status === "paused").length;
    const completedCampaigns = campaigns.filter(
      (c) => c.status === "completed"
    ).length;
    const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
    const totalAllocatedBudget = campaigns.reduce(
      (sum, c) => sum + c.totalPlacementCost,
      0
    );

    return {
      totalCampaigns,
      draftCampaigns,
      plannedCampaigns,
      activeCampaigns,
      pausedCampaigns,
      completedCampaigns,
      totalAllocatedBudget,
      totalBudget,
    };
  },
};