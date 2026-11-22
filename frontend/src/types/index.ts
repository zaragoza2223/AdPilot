export interface Campaign {
  id: string;
  name: string;
  description: string;
  budget: number;
  startDate: string;
  endDate: string;
  status: "draft" | "planned" | "active" | "paused" | "completed";
  selectedChannels: Array<{
    channelId: string;
    placementCostSnapshot: number;
  }>;
  totalPlacementCost: number;
  remainingBudget: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CampaignInput {
  name: string;
  description: string;
  budget: number;
  startDate: string;
  endDate: string;
  selectedChannelIds: string[];
}

export interface CampaignStats {
  totalCampaigns: number;
  draftCampaigns: number;
  plannedCampaigns: number;
  activeCampaigns: number;
  pausedCampaigns: number;
  completedCampaigns: number;
  totalAllocatedBudget: number;
  totalBudget: number;
}

export interface CampaignFilters {
  searchQuery: string;
  selectedStatus: string | null;
  sortBy: "name" | "budget" | "totalPlacementCost" | "startDate" | "endDate" | "createdAt" | null;
  sortDirection: "asc" | "desc";
}

export interface Channel {
  id: string;
  name: string;
  topic: string;
  description: string;
  subscribers: number;
  er: number;
  cpm: number;
  placementCost: number;
  isActive: boolean;
  addedAt: string;
}

export type ActivityType =
  | "campaign_created"
  | "campaign_updated"
  | "campaign_budget_changed"
  | "campaign_channels_changed";

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  campaignId: string;
  campaignName: string;
  description: string;
  timestamp: string;
  details?: Record<string, unknown>;
}

export interface ActivityFilters {
  searchQuery: string;
  selectedType: ActivityType | "all" | null;
  sortBy: "timestamp" | null;
  sortDirection: "asc" | "desc";
}

export interface ActivityStats {
  totalEvents: number;
  eventsToday: number;
  campaignsCreated: number;
  campaignsUpdated: number;
}

export interface AIMessage {
  id: string;
  sender: "user" | "assistant";
  content: string;
  timestamp: string;
  toolCalls?: AssistantToolCall[];
}

export interface StatCardData {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
}

export interface DashboardData {
  totalCampaigns: number;
  activeCampaigns: number;
  totalSpend: number;
  totalPlacements: number;
  recentCampaigns: Campaign[];
  recentEvents: ActivityEvent[];
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: AIMessage[];
}

export interface AssistantToolCall {
  tool: "channels" | "budget" | "campaigns" | "create-campaign";
  input: Record<string, unknown>;
  output: unknown;
  demo: boolean;
}

export interface ChatResponse {
  message: AIMessage;
  toolCalls?: AssistantToolCall[];
  demoMode: boolean;
}