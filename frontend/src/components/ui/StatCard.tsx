import type { StatCardData } from "@/types";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

interface StatCardProps {
  data: StatCardData;
}

export function StatCard({ data }: StatCardProps) {
  const TrendIcon = data.trend === "up" ? ArrowUpRight : data.trend === "down" ? ArrowDownRight : Minus;

  return (
    <div className="card stat-card">
      <div className="stat-card-header">
        <h3 className="stat-card-title">{data.title}</h3>
        <div className="w-8 h-8 rounded bg-accent-light flex items-center justify-center text-accent">
          <TrendIcon size={14} />
        </div>
      </div>
      <div className="stat-card-value">{data.value}</div>
      {data.change && (
        <p className={`stat-card-change ${data.trend}`}>
          {data.change}
        </p>
      )}
    </div>
  );
}