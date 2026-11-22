import { useEffect, useState } from "react";
import { campaignsService } from "@/services/campaignsService";
import type { CampaignFilters, CampaignStats } from "@/types";
import { CampaignList } from "@/components/campaigns/CampaignList";
import { StatCard } from "@/components/ui/StatCard";
import { formatCurrency } from "@/utils/formatCurrency";
import { AlertCircle, Filter, Search, X } from "lucide-react";

type CampaignType = {
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
};

export function Campaigns() {
  const [campaigns, setCampaigns] = useState<CampaignType[]>([]);
  const [stats, setStats] = useState<CampaignStats | null>(null);
  const [filters, setFilters] = useState<CampaignFilters>({
    searchQuery: "",
    selectedStatus: null,
    sortBy: null,
    sortDirection: "asc",
  });
  const [error, setError] = useState<string | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignType | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        setError(null);
        const [data, statData] = await Promise.all([
          campaignsService.getCampaigns(filters),
          campaignsService.getCampaignStats(),
        ]);
        if (!cancelled) {
          setCampaigns(data);
          setStats(statData);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Не удалось загрузить кампании. Попробуйте позже.");
        }
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, [filters]);

  const statusLabels: Record<string, string> = {
    draft: "Черновик",
    planned: "Запланирована",
    active: "Активно",
    paused: "Приостановлено",
    completed: "Завершено",
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Кампании</h1>
          <p className="text-secondary text-sm">Управление рекламными кампаниями</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-red-600 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}
      {!error && stats && (
        <div className="space-y-8">
          <div className="stat-grid mb-8">
            <StatCard
              data={{
                title: "Всего кампаний",
                value: stats.totalCampaigns,
                trend: "neutral",
              }}
            />
            <StatCard
              data={{
                title: "Активные",
                value: stats.activeCampaigns,
                trend: "neutral",
              }}
            />
            <StatCard
              data={{
                title: "Завершённые",
                value: stats.completedCampaigns,
                trend: "neutral",
              }}
            />
            <StatCard
              data={{
                title: "Общий бюджет",
                value: formatCurrency(stats.totalBudget),
                trend: "neutral",
              }}
            />
            <StatCard
              data={{
                title: "На размещения",
                value: formatCurrency(stats.totalAllocatedBudget),
                trend: "neutral",
              }}
            />
          </div>

          <div className="flex items-end justify-between">
            <div className="flex items-end gap-4">
              <div className="search-input-container search-campaigns">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  placeholder="Поиск кампании по названию…"
                  value={filters.searchQuery}
                  onChange={(e) =>
                    setFilters((prev: CampaignFilters) => ({
                      ...prev,
                      searchQuery: e.target.value,
                    }))
                  }
                  style={{ height: 44 }}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-secondary mb-1">
                  Статус
                </label>
                <select
                  value={filters.selectedStatus || ""}
                  onChange={(e) =>
                    setFilters((prev: CampaignFilters) => ({
                      ...prev,
                      selectedStatus: e.target.value || null,
                    }))
                  }
                  className="select w-full max-w-md"
                  style={{ height: 44 }}
                >
                  <option value="">Все статусы</option>
                  <option value="draft">Черновик</option>
                  <option value="planned">Запланирована</option>
                  <option value="active">Активно</option>
                  <option value="paused">Приостановлено</option>
                  <option value="completed">Завершено</option>
                </select>
              </div>
            </div>
            <button
              onClick={() =>
                setFilters({
                  searchQuery: "",
                  selectedStatus: null,
                  sortBy: null,
                  sortDirection: "asc",
                })
              }
              className="btn-secondary"
              disabled={
                !filters.searchQuery &&
                !filters.selectedStatus &&
                !filters.sortBy
              }
            >
              <Filter size={16} className="mr-2" />
              Сбросить фильтры
            </button>
          </div>

          <CampaignList
            campaigns={campaigns}
            onSelect={(campaign) => setSelectedCampaign(campaign)}
          />
        </div>
      )}
      {selectedCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedCampaign(null)}
          />
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-primary">
                {selectedCampaign.name}
              </h3>
              <button
                onClick={() => setSelectedCampaign(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-xs font-semibold text-secondary uppercase tracking-wider">Статус</p>
                <p className="text-sm text-primary">{statusLabels[selectedCampaign.status]}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-secondary uppercase tracking-wider">Бюджет</p>
                <p className="text-sm text-primary">{formatCurrency(selectedCampaign.budget)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-secondary uppercase tracking-wider">Размещения</p>
                <p className="text-sm text-primary">{formatCurrency(selectedCampaign.totalPlacementCost)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-secondary uppercase tracking-wider">Остаток</p>
                <p className="text-sm text-primary">{formatCurrency(selectedCampaign.remainingBudget)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-secondary uppercase tracking-wider">Начало</p>
                <p className="text-sm text-primary">{selectedCampaign.startDate}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-secondary uppercase tracking-wider">Окончание</p>
                <p className="text-sm text-primary">{selectedCampaign.endDate}</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">Описание</p>
              <p className="text-sm text-secondary">{selectedCampaign.description}</p>
            </div>

            <div className="mb-6">
              <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">Каналы</p>
              <div className="space-y-2">
                {selectedCampaign.selectedChannels.map((sc) => {
                  return (
                    <div
                      key={sc.channelId}
                      className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded border border-gray-50"
                    >
                      <span className="text-sm text-secondary font-mono">#{sc.channelId}</span>
                      <span className="text-sm text-primary">{formatCurrency(sc.placementCostSnapshot)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">Даты</p>
              <p className="text-sm text-secondary">
                Создана: {selectedCampaign.createdAt}
                {selectedCampaign.updatedAt && (
                  <span className="ml-4">Обновлена: {selectedCampaign.updatedAt}</span>
                )}
              </p>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => {
                  setSelectedCampaign(null);
                }}
                className="btn-secondary"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}