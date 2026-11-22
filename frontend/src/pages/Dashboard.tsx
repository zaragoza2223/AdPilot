import type { Campaign, ActivityEvent } from "@/types";
import type { ElementType as ReactElementType } from "react";
import { dashboardMockData } from "@/mocks/dashboard";
import { StatCard } from "@/components/ui/StatCard";
import { BarChart2, Send, Plus, Edit, TrendingUp, Link } from "lucide-react";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function StatGrid() {
  return (
    <div className="stat-grid mb-8">
      <StatCard data={{ title: "Всего кампаний", value: dashboardMockData.totalCampaigns, trend: "up", change: "+3 с прошлого месяца" }} />
      <StatCard data={{ title: "Активные кампании", value: dashboardMockData.activeCampaigns, trend: "up", change: "+2 с прошлого месяца" }} />
      <StatCard data={{ title: "Общие расходы", value: formatCurrency(dashboardMockData.totalSpend), trend: "down", change: "-5% с прошлого месяца" }} />
      <StatCard data={{ title: "Рекламных размещений", value: dashboardMockData.totalPlacements, trend: "up", change: "+12 с прошлого месяца" }} />
    </div>
  );
}

function ActivityChart() {
  const data = [45, 62, 58, 75, 68, 90, 85, 110, 100, 130, 120, 150];
  const maxValue = Math.max(...data);
  const width = 400;
  const height = 200;
  const padding = 40;

  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - (value / maxValue) * (height - padding * 2);
    return `${x},${y}`;
  }).join(" ");

  const areaPoints = [
    `0,${height}`,
    ...data.map((value, index) => {
      const x = padding + (index / (data.length - 1)) * (width - padding * 2);
      const y = height - padding - (value / maxValue) * (height - padding * 2);
      return `${x},${y}`;
    }),
    `${width},${height}`,
  ].join(" ");

  return (
    <div className="card mb-8">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-semibold text-primary">Активность кампаний</h3>
            <p className="text-xs text-secondary">Последние 12 недель</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-secondary">
            <BarChart2 size={16} /> График активности
          </div>
        </div>
        <div className="h-64 w-full relative">
        <svg width={width} height={height} className="w-full h-full" viewBox={`0 0 ${width} ${height}`}>
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={`M${areaPoints} Z`}
            fill="url(#gradient)"
          />
          <polyline
            points={points}
            fill="none"
            stroke="#2563eb"
            strokeWidth={2}
          />
          {data.map((value, index) => (
            <circle
              key={index}
              cx={padding + (index / (data.length - 1)) * (width - padding * 2)}
              cy={height - padding - (value / maxValue) * (height - padding * 2)}
              r={3}
              fill="#2563eb"
            />
          ))}
        </svg>
        <div className="flex justify-between text-xs text-secondary mt-4 px-2">
          {data.map((_, index) => (
            <span key={index} className="text-center w-full">{index % 3 === 0 ? `Нед ${index + 1}` : ""}</span>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}

function RecentEvents() {
  return (
    <div className="card">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-primary">Последние события</h3>
        </div>
        <div className="space-y-4">
          {dashboardMockData.recentEvents.map((event: ActivityEvent) => {
          const typeColors: Record<string, string> = {
            campaign_created: "text-success",
            campaign_updated: "text-secondary",
            campaign_budget_changed: "text-warning",
            campaign_channels_changed: "text-accent",
          };
          const typeIcons: Record<string, ReactElementType> = {
            campaign_created: Plus,
            campaign_updated: Edit,
            campaign_budget_changed: TrendingUp,
            campaign_channels_changed: Link,
          };
          const TypeIcon = typeIcons[event.type] || Send;
          return (
            <div key={event.id} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
              <TypeIcon size={18} className={typeColors[event.type] || "text-secondary"} />
              <div className="flex-1">
                <p className="text-sm text-primary">{event.campaignName}</p>
                <p className="text-xs text-secondary">{event.description}</p>
                <p className="text-xs text-muted">
                  {new Date(event.timestamp).toLocaleString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
}

function RecentCampaigns() {
  return (
    <div className="card">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-semibold text-primary">Последние кампании</h3>
            <p className="text-xs text-secondary">Обзор последних рекламных кампаний</p>
          </div>
        </div>
        <div className="table-wrapper">
          <table className="table">
          <thead>
            <tr className="border-b border-border">
              <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider">Название</th>
              <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider text-center">Бюджет</th>
              <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider text-center">Размещения</th>
              <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider text-center">Остаток</th>
              <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider">Статус</th>
            </tr>
          </thead>
          <tbody>
            {dashboardMockData.recentCampaigns.map((campaign: Campaign) => {
              return (
                <tr key={campaign.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-primary">{campaign.name}</td>
                  <td className="px-6 py-4 text-sm text-primary text-center">{formatCurrency(campaign.budget)}</td>
                  <td className="px-6 py-4 text-sm text-primary text-center">{formatCurrency(campaign.totalPlacementCost)}</td>
                  <td className="px-6 py-4 text-sm text-primary text-center">{formatCurrency(campaign.remainingBudget)}</td>
                  <td className="px-6 py-4">
                    <span className={`badge ${campaign.status === "active" ? "badge-success" : campaign.status === "paused" ? "badge-error" : "badge-neutral"}`}>
                      {campaign.status === "active" ? "Активно" : campaign.status === "paused" ? "Приостановлено" : campaign.status === "completed" ? "Завершено" : campaign.status === "planned" ? "Запланирована" : "Черновик"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
}

export function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
          <p className="text-secondary text-sm">Обзор состояния рекламных кампаний</p>
        </div>
      </div>

      <StatGrid />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ActivityChart />
        </div>
        <div>
          <RecentEvents />
        </div>
      </div>

      <RecentCampaigns />
    </div>
  );
}