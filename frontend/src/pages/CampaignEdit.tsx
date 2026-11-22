import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { campaignsService } from "@/services/campaignsService";
import { activityService } from "@/services/activityService";
import type { Campaign } from "@/types";
import { CampaignForm } from "@/components/campaigns/CampaignForm";
import { AlertCircle } from "lucide-react";

export function CampaignEdit() {
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
          <h1 className="text-2xl font-bold text-primary">Редактирование кампании</h1>
          <p className="text-secondary text-sm">Измените параметры кампании</p>
        </div>
        <button
          onClick={() => navigate(`/campaigns/${campaign.id}`)}
          className="text-sm text-secondary hover:text-accent transition-colors"
        >
          ← Вернуться к деталям
        </button>
      </div>

      <CampaignForm
        mode="edit"
        campaign={campaign}
        onSave={async (updated) => {
          if (!campaign) return;

          setCampaign(updated);

          try {
            const events: Array<{
              type:
                | "campaign_updated"
                | "campaign_budget_changed"
                | "campaign_channels_changed";
              campaignId: string;
              campaignName: string;
              description: string;
              timestamp: string;
              details?: Record<string, unknown>;
            }> = [];

            const now = new Date().toISOString();

            // Сравнение бюджета
            if (updated.budget !== campaign.budget) {
              events.push({
                type: "campaign_budget_changed",
                campaignId: updated.id,
                campaignName: updated.name,
                description: "Изменён бюджет кампании",
                timestamp: now,
                details: {
                  oldBudget: campaign.budget,
                  newBudget: updated.budget,
                },
              });
            }

            // Сравнение выбранных каналов (порядок не важен)
            const oldChannelIds = campaign.selectedChannels
              .map((sc) => sc.channelId)
              .sort();
            const newChannelIds = updated.selectedChannels
              .map((sc) => sc.channelId)
              .sort();
            const channelsChanged =
              oldChannelIds.length !== newChannelIds.length ||
              oldChannelIds.some((id, i) => id !== newChannelIds[i]);

            if (channelsChanged) {
              const added = newChannelIds.filter(
                (id) => !oldChannelIds.includes(id)
              );
              const removed = oldChannelIds.filter(
                (id) => !newChannelIds.includes(id)
              );
              events.push({
                type: "campaign_channels_changed",
                campaignId: updated.id,
                campaignName: updated.name,
                description: "Изменён список рекламных каналов",
                timestamp: now,
                details: {
                  addedChannelIds: added,
                  removedChannelIds: removed,
                },
              });
            }

            // Сравнение других полей
            const otherFieldsChanged =
              updated.name !== campaign.name ||
              updated.description !== campaign.description ||
              updated.startDate !== campaign.startDate ||
              updated.endDate !== campaign.endDate;

            if (otherFieldsChanged) {
              const changedFields: string[] = [];
              if (updated.name !== campaign.name) changedFields.push("name");
              if (
                updated.description !== campaign.description
              )
                changedFields.push("description");
              if (updated.startDate !== campaign.startDate)
                changedFields.push("startDate");
              if (updated.endDate !== campaign.endDate)
                changedFields.push("endDate");

              events.push({
                type: "campaign_updated",
                campaignId: updated.id,
                campaignName: updated.name,
                description: "Обновлены параметры кампании",
                timestamp: now,
                details: { changedFields },
              });
            }

            // Регистрируем все события
            for (const event of events) {
              try {
                await activityService.createActivityEvent(event);
              } catch (err) {
                console.error(
                  `[CampaignEdit] Ошибка регистрации события ${event.type}:`,
                  err
                );
              }
            }
          } catch (err) {
            console.error("[CampaignEdit] Ошибка при обработке обновления:", err);
          }
        }}
        onCancel={() => navigate(`/campaigns/${campaign.id}`)}
      />
    </div>
  );
}