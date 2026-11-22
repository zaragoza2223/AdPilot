import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { campaignsService } from "@/services/campaignsService";
import type { Campaign } from "@/types";
import { formatCurrency } from "@/utils/formatCurrency";
import { AlertCircle, Edit2, X } from "lucide-react";

const statusLabels: Record<string, string> = {
  draft: "Черновик",
  planned: "Запланирована",
  active: "Активно",
  paused: "Приостановлено",
  completed: "Завершено",
};

export function CampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCampaign() {
      try {
        setLoading(true);
        setError(null);
        if (!id) {
          setError("ID кампании не указан");
          setLoading(false);
          return;
        }
        const data = await campaignsService.getCampaignById(id);
        if (!cancelled) {
          if (data) {
            setCampaign(data);
          } else {
            setError("Кампания не найдена");
          }
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Не удалось загрузить кампанию. Попробуйте позже.");
          setLoading(false);
        }
      }
    }

    loadCampaign();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-400 mb-6">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-2xl font-bold text-primary mb-2">Ошибка</h2>
        <p className="text-secondary text-lg max-w-md mx-auto mb-8">{error}</p>
        <button
          onClick={() => navigate("/campaigns")}
          className="btn-secondary"
        >
          Вернуться к списку кампаний
        </button>
      </div>
    );
  }

  if (loading || !campaign) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-secondary mt-4">Загрузка кампании…</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">{campaign.name}</h1>
          <p className="text-secondary text-sm">Детали рекламной кампании</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/campaigns/${campaign.id}/edit`)}
            className="flex items-center gap-2 btn-secondary"
          >
            <Edit2 size={16} /> Редактировать
          </button>
          <button
            onClick={() => navigate("/campaigns")}
            className="text-sm text-secondary hover:text-accent transition-colors"
          >
            <X size={16} className="mr-1" /> Вернуться к списку
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div>
          <p className="text-xs font-semibold text-secondary uppercase tracking-wider">Статус</p>
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium badge ${
              campaign.status === "active"
                ? "badge-success"
                : campaign.status === "paused"
                ? "badge-error"
                : "badge-neutral"
            }`}
          >
            {statusLabels[campaign.status]}
          </span>
        </div>
        <div>
          <p className="text-xs font-semibold text-secondary uppercase tracking-wider">Бюджет</p>
          <p className="text-lg font-bold text-primary">{formatCurrency(campaign.budget)}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-secondary uppercase tracking-wider">Размещения</p>
          <p className="text-lg font-bold text-primary">{formatCurrency(campaign.totalPlacementCost)}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-secondary uppercase tracking-wider">Остаток</p>
          <p className="text-lg font-bold text-primary">{formatCurrency(campaign.remainingBudget)}</p>
        </div>
      </div>

      <div className="card">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold text-primary">Описание</h3>
          </div>
          <p className="text-sm text-secondary mb-6">{campaign.description}</p>

          <div className="form-grid gap-6">
            <div>
              <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">Даты кампании</p>
              <div className="space-y-2">
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-secondary">Начало:</span>
                  <span className="text-primary">{campaign.startDate}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-secondary">Окончание:</span>
                  <span className="text-primary">{campaign.endDate}</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">Каналы и размещения</p>
              <div className="space-y-3">
                {campaign.selectedChannels.map((sc) => (
                  <div key={sc.channelId} className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded border border-gray-50">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-secondary font-mono">#{sc.channelId}</span>
                      <span className="text-xs text-muted">• Размещение</span>
                    </div>
                    <span className="text-sm font-medium text-primary">{formatCurrency(sc.placementCostSnapshot)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-border">
        <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">Даты записи</p>
        <div className="space-y-1 text-sm text-secondary">
          <div className="flex items-center gap-2">
            <span className="font-medium">Создана:</span>
            <span>{campaign.createdAt}</span>
          </div>
          {campaign.updatedAt && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Обновлена:</span>
              <span>{campaign.updatedAt}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}