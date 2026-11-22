import { useEffect, useState } from "react";
import type { Channel } from "@/types";
import { channelsService, type ChannelFilters } from "@/services/channelsService";
import { Search } from "lucide-react";

interface ChannelSelectorProps {
  selectedChannelIds: string[];
  onChannelToggle: (channelId: string) => void;
}

export function ChannelSelector({ selectedChannelIds, onChannelToggle }: ChannelSelectorProps) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [filters, setFilters] = useState<ChannelFilters>({
    searchQuery: "",
    selectedTopic: null,
    sortBy: null,
    sortDirection: "asc",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const [data, topicData] = await Promise.all([
          channelsService.getChannels(filters),
          channelsService.getUniqueTopics(),
        ]);
        if (!cancelled) {
          setChannels(data);
          setTopics(topicData);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Не удалось загрузить каналы. Попробуйте позже.");
          setLoading(false);
        }
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, [filters]);

  const isSelected = (channelId: string) => selectedChannelIds.includes(channelId);

  const handleToggle = (channelId: string) => {
    onChannelToggle(channelId);
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-sm text-red-800">{error}</p>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-primary">Выберите рекламные каналы</h3>
        <p className="text-xs text-secondary">
          Выбрано: {selectedChannelIds.length}
        </p>
      </div>

      <div className="space-y-4">
        <div className="search-input-container">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Поиск канала по названию…"
            value={filters.searchQuery}
            onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="text-xs font-medium text-secondary">Тематика:</label>
          <select
            value={filters.selectedTopic || ""}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, selectedTopic: e.target.value || null }))
            }
            className="select w-full max-w-xs"
          >
            <option value="">Все тематики</option>
            {topics.map((topic) => (
              <option key={topic} value={topic}>{topic}</option>
            ))}
          </select>
        </div>

        {loading && (
          <div className="flex flex-col items-center gap-3 py-8 text-secondary">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            <p className="text-sm">Загрузка каналов…</p>
          </div>
        )}

        {!loading && channels.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-secondary">Каналы не найдены. Попробуйте изменить поиск или фильтры.</p>
          </div>
        )}

        {!loading && channels.length > 0 && (
          <div className="space-y-2 max-h-[400px] overflow-y-auto border border-border rounded-lg">
            {channels.map((channel) => {
              const selected = isSelected(channel.id);
              return (
                <div
                  key={channel.id}
                  className={`flex items-center justify-between px-4 py-3 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50 transition-colors group ${selected ? "bg-blue-50" : ""}`}
                  onClick={() => handleToggle(channel.id)}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={(e) => e.stopPropagation()}
                      className="w-4 h-4 text-accent rounded border-gray-300"
                    />
                    <div>
                      <p className="text-sm font-medium text-primary">{channel.name}</p>
                      <p className="text-xs text-secondary">{channel.topic}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-secondary">
                    <span>{channel.subscribers.toLocaleString("ru-RU")} подпис.</span>
                    <span>ER {channel.er.toFixed(1)}%</span>
                    <span>
                      {new Intl.NumberFormat("ru-RU", {
                        style: "currency",
                        currency: "RUB",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(channel.placementCost)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}