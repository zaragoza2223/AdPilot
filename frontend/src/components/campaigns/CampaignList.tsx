import type { Campaign } from "@/types";
import { formatCurrency } from "@/utils/formatCurrency";

interface CampaignListProps {
  campaigns: Campaign[];
  onSelect: (campaign: Campaign) => void;
}

const statusLabels: Record<string, string> = {
  draft: "Черновик",
  planned: "Запланирована",
  active: "Активно",
  paused: "Приостановлено",
  completed: "Завершено",
};

const statusBadgeClasses: Record<string, string> = {
  draft: "badge-neutral",
  planned: "badge-warning",
  active: "badge-success",
  paused: "badge-error",
  completed: "badge-neutral",
};

export function CampaignList({ campaigns, onSelect }: CampaignListProps) {
  return (
    <div className="card">
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr className="border-b border-border bg-gray-50">
              <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider">Название</th>
              <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider text-center">ID</th>
              <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider">Статус</th>
              <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider text-center">Бюджет</th>
              <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider text-center">Размещения</th>
              <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider text-center">Остаток</th>
              <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider text-center">Каналы</th>
              <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider text-center">Даты</th>
              <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider text-center">Создана</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {campaigns.map((campaign) => (
              <tr
                key={campaign.id}
                onClick={() => onSelect(campaign)}
                className="hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                <td className="px-6 py-4 text-sm text-primary">{campaign.name}</td>
                <td className="px-6 py-4 text-sm text-secondary text-center font-mono">
                  #{campaign.id}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium badge ${statusBadgeClasses[campaign.status]}`}
                  >
                    {statusLabels[campaign.status]}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-primary text-center">
                  {formatCurrency(campaign.budget)}
                </td>
                <td className="px-6 py-4 text-sm text-primary text-center">
                  {formatCurrency(campaign.totalPlacementCost)}
                </td>
                <td className="px-6 py-4 text-sm text-primary text-center">
                  {formatCurrency(campaign.remainingBudget)}
                </td>
                <td className="px-6 py-4 text-sm text-secondary text-center">
                  {campaign.selectedChannels.length}
                </td>
                <td className="px-6 py-4 text-sm text-secondary text-center">
                  {campaign.startDate} – {campaign.endDate}
                </td>
                <td className="px-6 py-4 text-sm text-secondary text-center">
                  {campaign.createdAt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}