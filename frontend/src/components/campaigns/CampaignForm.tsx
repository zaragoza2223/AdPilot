import { useState } from "react";
import type { Campaign, CampaignInput } from "@/types";
import { campaignsService } from "@/services/campaignsService";
import { ChannelSelector } from "./ChannelSelector";
import { formatCurrency } from "@/utils/formatCurrency";
import { AlertCircle, Save, X } from "lucide-react";

type FormMode = "create" | "edit";

interface CampaignFormProps {
  mode: FormMode;
  campaign?: Campaign;
  onSave: (campaign: Campaign) => void;
  onCancel: () => void;
}

interface FormErrors {
  name?: string;
  budget?: string;
  channels?: string;
  dates?: string;
  general?: string;
}

export function CampaignForm({ mode, campaign, onSave, onCancel }: CampaignFormProps) {
  const [form, setForm] = useState<CampaignInput>({
    name: campaign?.name || "",
    description: campaign?.description || "",
    budget: campaign?.budget || 0,
    startDate: campaign?.startDate || "",
    endDate: campaign?.endDate || "",
    selectedChannelIds: campaign?.selectedChannels.map((sc) => sc.channelId) || [],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleChange = (
    field: keyof CampaignInput,
    value: string | string[]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field as keyof FormErrors];
      return next;
    });
    setServerError(null);
  };

  const validateForm = (): boolean => {
    const next: FormErrors = {};
    let valid = true;

    if (!form.name || !form.name.trim()) {
      next.name = "Укажите название кампании";
      valid = false;
    }

    if (!form.budget || form.budget <= 0) {
      next.budget = "Бюджет должен быть больше нуля";
      valid = false;
    }

    if (!form.selectedChannelIds || form.selectedChannelIds.length === 0) {
      next.channels = "Выберите хотя бы один рекламный канал";
      valid = false;
    }

    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      next.dates = "Дата окончания не может быть раньше даты начала";
      valid = false;
    }

    setErrors(next);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      if (mode === "create") {
        const created = await campaignsService.createCampaign(form);
        onSave(created);
      } else if (mode === "edit" && campaign) {
        const updated = await campaignsService.updateCampaign(campaign.id, {
          name: form.name,
          description: form.description,
          budget: form.budget,
          startDate: form.startDate,
          endDate: form.endDate,
          selectedChannelIds: form.selectedChannelIds,
        });
        onSave(updated);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError("Произошла ошибка при сохранении кампании");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const currentPlacementCost = form.selectedChannelIds.reduce((sum, channelId) => {
    if (campaign) {
      const existing = campaign.selectedChannels.find((sc) => sc.channelId === channelId);
      if (existing) {
        return sum + existing.placementCostSnapshot;
      }
    }
    return sum;
  }, 0);

  const remainingBudget = form.budget - currentPlacementCost;
  const budgetExceeded = currentPlacementCost > form.budget;

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold text-primary">
          {mode === "create" ? "Создание кампании" : "Редактирование кампании"}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-secondary hover:text-accent transition-colors"
        >
          <X size={16} className="mr-1" /> Отмена
        </button>
      </div>

      {serverError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-red-600 mt-0.5" />
            <p className="text-sm text-red-800">{serverError}</p>
          </div>
        </div>
      )}

      <div className="form-grid gap-6">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-secondary uppercase tracking-wider">
            Название кампании
          </label>
          <input
            type="text"
            className={`input ${errors.name ? "border-error focus:ring-error" : ""}`}
            placeholder="Название кампании"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          {errors.name && <p className="text-xs text-error">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-secondary uppercase tracking-wider">
            Описание
          </label>
          <textarea
            className="input min-h-[80px] resize-y"
            placeholder="Описание рекламной кампании"
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-secondary uppercase tracking-wider">
            Бюджет (₽)
          </label>
          <input
            type="number"
            min="0"
            className={`input ${errors.budget ? "border-error focus:ring-error" : ""}`}
            placeholder="0"
            value={form.budget || ""}
            onChange={(e) => handleChange("budget", e.target.value)}
          />
          {errors.budget && <p className="text-xs text-error">{errors.budget}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-secondary uppercase tracking-wider">
            Дата начала
          </label>
          <input
            type="date"
            className={`input ${errors.dates ? "border-error focus:ring-error" : ""}`}
            value={form.startDate}
            onChange={(e) => handleChange("startDate", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-secondary uppercase tracking-wider">
            Дата окончания
          </label>
          <input
            type="date"
            className={`input ${errors.dates ? "border-error focus:ring-error" : ""}`}
            value={form.endDate}
            onChange={(e) => handleChange("endDate", e.target.value)}
          />
          {errors.dates && <p className="text-xs text-error">{errors.dates}</p>}
        </div>
        <div className="form-col-2">
          <ChannelSelector
            selectedChannelIds={form.selectedChannelIds}
            onChannelToggle={(channelId) => {
              const ids = form.selectedChannelIds.includes(channelId)
                ? form.selectedChannelIds.filter((id) => id !== channelId)
                : [...form.selectedChannelIds, channelId];
              handleChange("selectedChannelIds", ids);
            }}
          />
          {errors.channels && <p className="text-xs text-error mt-2">{errors.channels}</p>}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 border border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-primary">Расчёт бюджета</h3>
        </div>
        <div className="budget-grid gap-4 text-sm">
          <div>
            <p className="text-xs text-secondary uppercase">Бюджет кампании</p>
            <p className="text-primary font-medium">{formatCurrency(form.budget || 0)}</p>
          </div>
          <div>
            <p className="text-xs text-secondary uppercase">Стоимость размещений</p>
            <p className={`text-primary font-medium ${budgetExceeded ? "text-error" : ""}`}>
              {formatCurrency(currentPlacementCost)}
            </p>
          </div>
          <div>
            <p className="text-xs text-secondary uppercase">Остаток бюджета</p>
            <p className={`text-primary font-medium ${remainingBudget < 0 ? "text-error" : ""}`}>
              {formatCurrency(Math.max(0, remainingBudget))}
            </p>
          </div>
        </div>
        {budgetExceeded && (
          <p className="text-xs text-error mt-2">
            Стоимость размещений превышает бюджет кампании
          </p>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="btn-secondary"
        >
          Отмена
        </button>
        <button
          type="submit"
          disabled={submitting || Object.keys(errors).length > 0 || budgetExceeded}
          className="btn-primary"
        >
          {submitting ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Сохранение…
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Save size={16} />
              {mode === "create" ? "Создать кампанию" : "Сохранить изменения"}
            </span>
          )}
        </button>
      </div>
    </form>
  );
}