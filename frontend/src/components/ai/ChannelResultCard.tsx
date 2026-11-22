import type { Channel } from "@/types";

export function ChannelResultCard({ channel }: { channel: Channel }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-white border border-border rounded-lg">
      <div className="w-10 h-10 rounded-lg bg-accent-light flex items-center justify-center shrink-0">
        <span className="text-primary font-medium text-sm">{channel.name[0]}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-primary">{channel.name}</h3>
        <p className="text-xs text-secondary">{channel.topic}</p>
        <p className="text-xs text-muted truncate">{channel.description}</p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="text-xs font-medium text-accent">{channel.placementCost.toLocaleString("ru-RU")} ₽</span>
        <span className="text-[10px] text-muted">{channel.subscribers.toLocaleString("ru-RU")} подписчиков</span>
      </div>
    </div>
  );
}