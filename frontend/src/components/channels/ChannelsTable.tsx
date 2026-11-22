import type { Channel } from "@/types";
import { Users } from "lucide-react";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

interface ChannelsTableProps {
  channels: Channel[];
  onSelect: (channel: Channel) => void;
  isLoading: boolean;
}

export function ChannelsTable({ channels, onSelect, isLoading }: ChannelsTableProps) {
  return (
    <div className="card">
      {isLoading && (
        <div className="p-8 text-center">
          <div className="flex flex-col items-center gap-3 text-secondary">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            <p className="text-sm">Загрузка каналов…</p>
          </div>
        </div>
      )}

      {!isLoading && channels.length === 0 && (
        <div className="p-12 text-center">
          <Users size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-primary">Каналы не найдены</h3>
          <p className="text-secondary">Попробуйте изменить условия поиска или фильтры.</p>
        </div>
      )}

      {!isLoading && channels.length > 0 && (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr className="border-b border-border bg-gray-50">
                <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider">Канал</th>
                <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider">Тематика</th>
                <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider text-center">Подписчики</th>
                <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider text-center">ER</th>
                <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider text-center">CPM</th>
                <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider text-center">Стоимость</th>
                <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {channels.map((channel) => (
                <tr
                  key={channel.id}
                  tabIndex={0}
                  onClick={() => onSelect(channel)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelect(channel);
                    }
                  }}
                  className="hover:bg-gray-50 transition-colors cursor-pointer group focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                >
                  <td className="px-6 py-4 text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                        {channel.name[0]}
                      </div>
                      <div className="flex flex-col">
                        <p className="text-sm font-medium text-primary">{channel.name}</p>
                        <p className="text-xs text-secondary">{channel.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-secondary">{channel.topic}</td>
                  <td className="px-6 py-4 text-sm text-primary text-center">
                    {channel.subscribers.toLocaleString("ru-RU")}
                  </td>
                  <td className="px-6 py-4 text-sm text-primary text-center">
                    {channel.er.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 text-sm text-primary text-center">
                    {channel.cpm.toLocaleString("ru-RU")} ₽
                  </td>
                  <td className="px-6 py-4 text-sm text-primary text-center">
                    {formatCurrency(channel.placementCost)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`badge ${channel.isActive ? "badge-success" : "badge-neutral"}`}>
                      {channel.isActive ? "Активно" : "Неактивно"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}