import { useState } from "react";
import type { Campaign } from "@/types";
import { CampaignForm } from "@/components/campaigns/CampaignForm";
import { formatCurrency } from "@/utils/formatCurrency";
import { CheckCircle, AlertCircle } from "lucide-react";
import { activityService } from "@/services/activityService";

export function CampaignCreate() {
  const [savedCampaign, setSavedCampaign] = useState<Campaign | null>(null);
  const [activityError, setActivityError] = useState<string | null>(null);

  const handleSave = async (campaign: Campaign) => {
    setSavedCampaign(campaign);
    try {
      await activityService.createActivityEvent({
        type: "campaign_created",
        campaignId: campaign.id,
        campaignName: campaign.name,
        description: "Создана рекламная кампания",
        timestamp: new Date().toISOString(),
      });
      setActivityError(null);
    } catch (err) {
      setActivityError(
        "Кампания сохранена, но не удалось записать событие в журнал. Попробуйте позже."
      );
      console.error("[CampaignCreate] Ошибка регистрации события:", err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Создание кампании</h1>
          <p className="text-secondary text-sm">Настройте параметры новой рекламной кампании</p>
        </div>
      </div>

      {activityError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-red-600 mt-0.5" />
            <p className="text-sm text-red-800">{activityError}</p>
          </div>
        </div>
      )}

      {savedCampaign ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700">
              <CheckCircle size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-primary">Кампания создана</h3>
              <p className="text-xs text-secondary">{savedCampaign.name}</p>
            </div>
          </div>
          <div className="budget-grid gap-4 text-sm">
            <div>
              <p className="text-xs text-secondary uppercase">Бюджет</p>
              <p className="text-primary font-medium">{formatCurrency(savedCampaign.budget)}</p>
            </div>
            <div>
              <p className="text-xs text-secondary uppercase">Размещения</p>
              <p className="text-primary font-medium">{formatCurrency(savedCampaign.totalPlacementCost)}</p>
            </div>
            <div>
              <p className="text-xs text-secondary uppercase">Остаток</p>
              <p className="text-primary font-medium">{formatCurrency(savedCampaign.remainingBudget)}</p>
            </div>
          </div>
        </div>
      ) : (
        <CampaignForm
          mode="create"
          onSave={handleSave}
          onCancel={() => {
            // Остаёмся на странице создания
          }}
        />
      )}
    </div>
  );
}