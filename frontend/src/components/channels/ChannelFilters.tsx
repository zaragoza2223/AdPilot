import type { ChannelFilters } from "@/services/channelsService";
import { Search, RotateCcw } from "lucide-react";

interface ChannelFiltersProps {
  filters: ChannelFilters;
  onFiltersChange: (updates: Partial<ChannelFilters>) => void;
  topics: string[];
}

export function ChannelFilters({ filters, onFiltersChange, topics }: ChannelFiltersProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ searchQuery: e.target.value });
  };

  const handleTopicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({ selectedTopic: e.target.value || null });
  };

  const handleSortChange = (sortBy: ChannelFilters["sortBy"]) => {
    if (filters.sortBy === sortBy) {
      onFiltersChange({ sortDirection: filters.sortDirection === "asc" ? "desc" : "asc" });
    } else {
      onFiltersChange({ sortBy, sortDirection: "desc" });
    }
  };

  const handleReset = () => {
    onFiltersChange({ searchQuery: "", selectedTopic: null, sortBy: null, sortDirection: "asc" });
  };

  const hasActiveFilters =
    filters.searchQuery.trim() !== "" ||
    filters.selectedTopic !== null ||
    filters.sortBy !== null;

  return (
    <div className="card p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-primary">Поиск и фильтры</h3>
      </div>

      <div className="filter-grid">
        <div className="filter-col-2">
          <div className="search-input-container input-filter-height">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Поиск по названию канала…"
              value={filters.searchQuery}
              onChange={handleSearchChange}
              className="input-filter"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-secondary mb-1">Тематика</label>
          <select
            value={filters.selectedTopic || ""}
            onChange={handleTopicChange}
            className="select-filter"
          >
            <option value="">Все тематики</option>
            {topics.map((topic) => (
              <option key={topic} value={topic}>{topic}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-secondary mb-1">Сортировка</label>
          <select
            value={filters.sortBy || ""}
            onChange={(e) => handleSortChange(e.target.value as ChannelFilters["sortBy"])}
            className="select-filter"
          >
            <option value="">Без сортировки</option>
            <option value="subscribers">Подписчики</option>
            <option value="er">ER</option>
            <option value="cpm">CPM</option>
            <option value="placementCost">Стоимость размещения</option>
          </select>
        </div>

        <button
          onClick={handleReset}
          disabled={!hasActiveFilters}
          className="btn-secondary w-full sm:w-auto"
        >
          <RotateCcw size={16} className="mr-2" />
          Сбросить
        </button>
      </div>
    </div>
  );
}