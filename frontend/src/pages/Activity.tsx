import { useEffect, useState } from "react";
import { activityService } from "@/services/activityService";
import type { ActivityEvent, ActivityFilters, ActivityStats } from "@/types";
import { ActivityFilters as ActivityFiltersComponent } from "@/components/activity/ActivityFilters";
import { ActivityTable } from "@/components/activity/ActivityTable";
import { StatCard } from "@/components/ui/StatCard";
import { AlertCircle } from "lucide-react";

export function Activity() {
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [stats, setStats] = useState<ActivityStats | null>(null);
  const [filters, setFilters] = useState<ActivityFilters>({
    searchQuery: "",
    selectedType: null,
    sortBy: "timestamp",
    sortDirection: "desc",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(
    null
  );

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);
        const [data, statData] = await Promise.all([
          activityService.getActivities(filters),
          activityService.getActivityStats(),
        ]);
        if (!cancelled) {
          setActivities(data);
          setStats(statData);
          setIsLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            "Не удалось загрузить события. Попробуйте позже."
          );
          setIsLoading(false);
        }
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, [filters]);

  const handleCampaignClick = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
  };

  if (selectedCampaignId) {
    // В реальном приложении здесь был бы переход на /campaigns/:id
    // Для демонстрации просто сбрасываем выделение
    // Навигация будет реализована через react-router на этапе интеграции
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Журнал событий</h1>
          <p className="text-secondary text-sm">
            История действий с рекламными кампаниями
          </p>
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
                title: "Всего событий",
                value: stats.totalEvents,
                trend: "neutral",
              }}
            />
            <StatCard
              data={{
                title: "События за сегодня",
                value: stats.eventsToday,
                trend: "neutral",
              }}
            />
            <StatCard
              data={{
                title: "Создано кампаний",
                value: stats.campaignsCreated,
                trend: "neutral",
              }}
            />
            <StatCard
              data={{
                title: "Изменений кампаний",
                value: stats.campaignsUpdated,
                trend: "neutral",
              }}
            />
          </div>

          <ActivityFiltersComponent
            filters={filters}
            onFiltersChange={setFilters}
            onReset={() => {}}
          />

          <ActivityTable
            activities={activities}
            isLoading={isLoading}
            error={error}
            onCampaignClick={handleCampaignClick}
          />
        </div>
      )}
    </div>
  );
}
