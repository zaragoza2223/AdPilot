import { useState } from "react";
import type { ActivityFilters, ActivityType } from "@/types";
import { Search, X, Clock } from "lucide-react";

interface ActivityFiltersProps {
  filters: ActivityFilters;
  onFiltersChange: (filters: ActivityFilters) => void;
  onReset: () => void;
}

export function ActivityFilters({
  filters,
  onFiltersChange,
  onReset,
}: ActivityFiltersProps) {
  const [searchQuery, setSearchQuery] = useState(filters.searchQuery);
  const [selectedType, setSelectedType] = useState(filters.selectedType);
  const [sortDirection, setSortDirection] = useState(
    filters.sortDirection ?? "desc"
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onFiltersChange({
      ...filters,
      searchQuery: value,
    });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as ActivityType | "all" | null;
    setSelectedType(value === "all" ? null : value);
    onFiltersChange({
      ...filters,
      selectedType: value === "all" ? null : value,
    });
  };

  const handleSortDirectionChange = () => {
    const next = sortDirection === "asc" ? "desc" : "asc";
    setSortDirection(next);
    onFiltersChange({
      ...filters,
      sortBy: "timestamp",
      sortDirection: next,
    });
  };

  const handleReset = () => {
    setSearchQuery("");
    setSelectedType(null);
    setSortDirection("desc");
    onFiltersChange({
      ...filters,
      searchQuery: "",
      selectedType: null,
      sortBy: "timestamp",
      sortDirection: "desc",
    });
    onReset();
  };

  const hasActiveFilters =
    filters.searchQuery.trim() !== "" ||
    filters.selectedType !== null ||
    filters.sortBy !== null;

  const typeLabels: Record<ActivityType, string> = {
    campaign_created: "Создание кампании",
    campaign_updated: "Изменение кампании",
    campaign_budget_changed: "Изменение бюджета",
    campaign_channels_changed: "Изменение каналов",
  };

  return (
    <div className="bg-white border border-border rounded-lg p-6">
      <div className="activity-filters">
        <div className="filter-group search-group">
          <div className="activity-search w-full">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Поиск по кампании и описанию события"
              value={searchQuery}
              onChange={handleSearchChange}
              className="activity-input"
              aria-label="Поиск по событиям"
            />
          </div>
        </div>

        <div className="filter-group type-group">
          <select
            value={selectedType ?? ""}
            onChange={handleTypeChange}
            className="select activity-input w-full"
            aria-label="Тип события"
          >
            <option value="">Все типы</option>
            {Object.entries(typeLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group sort-group">
          <button
            onClick={handleSortDirectionChange}
            className="btn-secondary activity-btn flex items-center gap-2"
          >
            <Clock size={16} />
            <span>
              {sortDirection === "desc" ? "Новые сверху" : "Старые сверху"}
            </span>
          </button>
        </div>

        <div className="filter-group reset-group">
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="btn-secondary activity-btn text-error hover:bg-error-light"
            >
              <X size={16} />
              <span>Сбросить фильтры</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
