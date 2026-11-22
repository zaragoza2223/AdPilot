import type { ActivityEvent } from "@/types";
import {
  ArrowUpRight,
  Plus,
  Edit,
  TrendingUp,
  Link,
} from "lucide-react";

type LucideIcon = React.ComponentType<any>;

const typeConfig: Record<
  ActivityEvent["type"],
  { label: string; icon: LucideIcon; color: string }
> = {
  campaign_created: {
    label: "Создание кампании",
    icon: Plus,
    color: "text-success",
  },
  campaign_updated: {
    label: "Изменение кампании",
    icon: Edit,
    color: "text-secondary",
  },
  campaign_budget_changed: {
    label: "Изменение бюджета",
    icon: TrendingUp,
    color: "text-warning",
  },
  campaign_channels_changed: {
    label: "Изменение каналов",
    icon: Link,
    color: "text-accent",
  },
};

interface ActivityTableProps {
  activities: ActivityEvent[];
  isLoading: boolean;
  error: string | null;
  onCampaignClick: (campaignId: string) => void;
}

export function ActivityTable({
  activities,
  isLoading,
  error,
  onCampaignClick,
}: ActivityTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white border border-border rounded-lg p-8 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-secondary">Загрузка событий…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-8 flex flex-col items-center justify-center text-center">
        <p className="text-sm text-red-800 mb-4">{error}</p>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="bg-white border border-border rounded-lg p-8 flex flex-col items-center justify-center text-center">
        <p className="text-secondary mb-4">Событий не найдено</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-border rounded-lg overflow-hidden">
      <table className="table activity-table w-full">
        <thead>
          <tr>
            <th className="px-6 py-3 text-xs font-semibold text-secondary uppercase tracking-wider">
              Время
            </th>
            <th className="px-6 py-3 text-xs font-semibold text-secondary uppercase tracking-wider">
              Тип события
            </th>
            <th className="px-6 py-3 text-xs font-semibold text-secondary uppercase tracking-wider">
              Кампания
            </th>
            <th className="px-6 py-3 text-xs font-semibold text-secondary uppercase tracking-wider">
              Описание
            </th>
            <th className="px-6 py-3 text-xs font-semibold text-secondary uppercase tracking-wider">
              Детали
            </th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity) => {
            const config = typeConfig[activity.type];
            const time = new Date(activity.timestamp).toLocaleString(
              "ru-RU",
              {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }
            );

            return (
              <tr key={activity.id} className="border-b border-border last:border-0">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                  {time}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 w-full justify-center">
                    <div className={`w-2 h-2 rounded-full ${config.color}`} />
                    <span className="text-sm font-medium text-primary">
                      {config.label}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onCampaignClick(activity.campaignId)}
                    className="text-sm text-accent hover:underline flex items-center gap-1 w-full justify-center"
                  >
                    {activity.campaignName}
                    <ArrowUpRight size={12} className="text-secondary" />
                  </button>
                </td>
                <td className="px-6 py-4 text-sm text-secondary">
                  {activity.description}
                </td>
                <td className="px-6 py-4">
                  {activity.details && (
                    <div className="flex w-full justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(
                          `Детали события:\n${JSON.stringify(
                            activity.details,
                            null,
                            2
                          )}`
                        );
                      }}
                      className="text-xs text-muted hover:text-primary underline hover:decoration-accent"
                    >
                      Подробнее
                    </button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
