import { useEffect } from "react";
import type { Channel } from "@/types";
import { X, Users, Percent, DollarSign, CreditCard, Calendar, CheckCircle2, AlertCircle } from "lucide-react";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

interface ChannelDetailsProps {
  channel: Channel | null;
  onClose: () => void;
}

export function ChannelDetails({ channel, onClose }: ChannelDetailsProps) {
  if (!channel) return null;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-primary">Подробности канала</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <h4 className="text-xl font-bold text-primary">{channel.name}</h4>
            <p className="text-sm text-secondary">{channel.topic}</p>
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">Описание</p>
            <p className="text-sm text-primary">{channel.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Users size={16} className="text-primary" />
                <span className="text-xs font-semibold text-secondary uppercase">Подписчики</span>
              </div>
              <p className="text-2xl font-bold text-primary">{channel.subscribers.toLocaleString("ru-RU")}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Percent size={16} className="text-primary" />
                <span className="text-xs font-semibold text-secondary uppercase">ER</span>
              </div>
              <p className="text-2xl font-bold text-primary">{channel.er.toFixed(1)}%</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign size={16} className="text-primary" />
                <span className="text-xs font-semibold text-secondary uppercase">CPM</span>
              </div>
              <p className="text-2xl font-bold text-primary">{channel.cpm.toLocaleString("ru-RU")} ₽</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <CreditCard size={16} className="text-primary" />
                <span className="text-xs font-semibold text-secondary uppercase">Размещение</span>
              </div>
              <p className="text-2xl font-bold text-primary">{formatCurrency(channel.placementCost)}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mt-4">
            <div className="flex items-center gap-2 mb-1">
              <Calendar size={16} className="text-primary" />
              <span className="text-xs font-semibold text-secondary uppercase">Добавлен</span>
            </div>
            <p className="text-sm text-primary">{channel.addedAt}</p>
          </div>

          <div className="mt-6">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium ${
              channel.isActive ? "badge-success" : "badge-neutral"
            }`}>
              {channel.isActive ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
              {channel.isActive ? "Активно" : "Неактивно"}
            </span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <button
            onClick={onClose}
            disabled
            className="btn-secondary w-full"
          >
            Выбрать канал
          </button>
          <p className="text-xs text-muted mt-2 text-center">
            Возможность выбора канала появится на этапе реализации рекламных кампаний.
          </p>
        </div>
      </div>
    </div>
  );
}