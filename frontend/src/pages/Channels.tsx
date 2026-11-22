import { useState, useEffect } from "react";
import { channelsService, type ChannelFilters, type ChannelStats } from "@/services/channelsService";
import { ChannelFilters as FiltersComponent } from "@/components/channels/ChannelFilters";
import { ChannelsTable } from "@/components/channels/ChannelsTable";
import { ChannelDetails } from "@/components/channels/ChannelDetails";
import { StatCard } from "@/components/ui/StatCard";
import { AlertCircle } from "lucide-react";
import type { Channel } from "@/types";

export function Channels() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [stats, setStats] = useState<ChannelStats | null>(null);
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
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
        const [data, statData, topicData] = await Promise.all([
          channelsService.getChannels(filters),
          channelsService.getStats(),
          channelsService.getUniqueTopics(),
        ]);
        if (!cancelled) {
          setChannels(data);
          setStats(statData);
          setTopics(topicData);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Не удалось загрузить данные о каналах. Попробуйте позже.");
          setLoading(false);
        }
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, [filters]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Channels</h1>
          <p className="text-secondary text-sm">Каталог рекламных Telegram-каналов</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <AlertCircle size={20} className="text-red-600 mt-0.5" />
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {!error && (
        <div className="space-y-8">
          {stats && (
            <div className="stat-grid mb-8">
              <StatCard data={{ title: "Всего каналов", value: stats.totalChannels, trend: "neutral" }} />
              <StatCard data={{ title: "Активные каналы", value: stats.activeChannels, trend: "neutral" }} />
              <StatCard
                data={{
                  title: "Средний ER",
                  value: stats.averageER.toFixed(1) + "%",
                  trend: "neutral",
                }}
              />
              <StatCard
                data={{
                  title: "Средний CPM",
                  value: stats.averageCPM.toLocaleString("ru-RU") + " ₽",
                  trend: "neutral",
                }}
              />
            </div>
          )}

          <FiltersComponent
            filters={filters}
            onFiltersChange={(updates) =>
              setFilters((prev) => ({ ...prev, ...updates }))
            }
            topics={topics}
          />

          <ChannelsTable
            channels={channels}
            onSelect={(channel) => setSelectedChannel(channel)}
            isLoading={loading}
          />
        </div>
      )}

      {selectedChannel && (
        <ChannelDetails channel={selectedChannel} onClose={() => setSelectedChannel(null)} />
      )}
    </div>
  );
}