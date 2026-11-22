import type { AIMessage, ChatResponse } from "@/types";
import { channelsService } from "./channelsService";
import { campaignsService } from "./campaignsService";

const DELAY_MS = 800;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function isTechnologyTopic(topic: string): boolean {
  const techKeywords = ["it", "технолог", "разработ", "ит", "цифр", "soft", "софт"];
  const lower = topic.toLowerCase();
  return techKeywords.some((kw) => lower.includes(kw));
}

function generateAssistantMessage(content: string, toolCalls?: AssistantToolCall[]): AIMessage {
  return {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2),
    sender: "assistant",
    content,
    timestamp: new Date().toISOString(),
    toolCalls,
  };
}

export interface AssistantToolCall {
  tool: "channels" | "budget" | "campaigns" | "create-campaign";
  input: Record<string, unknown>;
  output: unknown;
  demo: boolean;
}

export const assistantService = {
  async processMessage(
    userMessage: string
  ): Promise<ChatResponse> {
    await delay(DELAY_MS);

    const lower = userMessage.toLowerCase().trim();

    // Scenario 1: Channel selection by technology topic with budget
    const explicitBudgetMatch = lower.match(/(\d[\d\s]*)\s*руб/i);
    const hasTechnologyKeyword =
      isTechnologyTopic(lower) ||
      lower.includes("технолог") ||
      lower.includes("it") ||
      lower.includes("ит");

    if (
      (hasTechnologyKeyword ||
        lower.includes("подбери") ||
        lower.includes("подобрать")) &&
      explicitBudgetMatch
    ) {
      const budgetStr = explicitBudgetMatch[1].replace(/\s/g, "");
      const budget = parseInt(budgetStr, 10);

      if (isNaN(budget) || budget <= 0) {
        const msg = generateAssistantMessage(
          "Не удалось определить бюджет. Укажите сумму в рублях, например: «подберите каналы про технологии с бюджетом до 30 000 рублей»."
        );
        return { message: msg, demoMode: true };
      }

      try {
        const allChannels = await channelsService.getChannels({
          searchQuery: "",
          selectedTopic: null,
          sortBy: null,
          sortDirection: "desc",
        });

        const suitableChannels = allChannels.filter(
          (c) => c.placementCost <= budget && c.isActive
        );

        if (suitableChannels.length === 0) {
          const msg = generateAssistantMessage(
            "По вашему бюджету " +
              formatCurrency(budget) +
              " не найдено подходящих технологических каналов. Попробуйте увеличить бюджет или уточнить тематику.",
            [
              {
                tool: "channels",
                input: { topic: "технологии", maxBudget: budget },
                output: { channels: [], totalFound: 0 },
                demo: true,
              },
            ]
          );
          return { message: msg, toolCalls: [], demoMode: true };
        }

        const totalCost = suitableChannels.reduce(
          (sum, c) => sum + c.placementCost,
          0
        );

        const channelList = suitableChannels
          .map(
            (c) =>
              "- " +
              c.name +
              " (" +
              c.topic +
              ", " +
              formatCurrency(c.placementCost) +
              ")"
          )
          .join("\n");

        const msg = generateAssistantMessage(
          "Подобраны технологические каналы в рамках бюджета " +
            formatCurrency(budget) +
            ":\n\n" +
            channelList +
            "\n\nОбщая стоимость размещений: " +
            formatCurrency(totalCost) +
            ".\n\nВсе данные демонстрационные.",
          [
            {
              tool: "channels",
              input: { topic: "технологии", maxBudget: budget },
              output: { channels: suitableChannels, totalCost },
              demo: true,
            },
          ]
        );
        return { message: msg, toolCalls: [], demoMode: true };
      } catch (err) {
        const msg = generateAssistantMessage(
          "Не удалось получить данные о каналах. Попробуйте позже."
        );
        return { message: msg, demoMode: true };
      }
    }

    // Scenario 2: Budget calculation for selected platforms
    if (
      lower.includes("сколько стоит") ||
      lower.includes("стоимость рекламы") ||
      lower.includes("бюджет на")
    ) {
      try {
        const allChannels = await channelsService.getChannels({
          searchQuery: "",
          selectedTopic: null,
          sortBy: null,
          sortDirection: "desc",
        });

        const activeChannels = allChannels.filter((c) => c.isActive);
        const totalCost = activeChannels.reduce(
          (sum, c) => sum + c.placementCost,
          0
        );

        const msg = generateAssistantMessage(
          "Расчёт стоимости рекламы на активных площадках:\n\n" +
            activeChannels
              .map((c) => "- " + c.name + ": " + formatCurrency(c.placementCost))
              .join("\n") +
            "\n\nОбщая стоимость: " +
            formatCurrency(totalCost) +
            ".\n\nВсе данные демонстрационные.",
          [
            {
              tool: "budget",
              input: { scope: "all active channels" },
              output: { totalCost, channelCount: activeChannels.length },
              demo: true,
            },
          ]
        );
        return { message: msg, toolCalls: [], demoMode: true };
      } catch (err) {
        const msg = generateAssistantMessage(
          "Не удалось рассчитать бюджет. Попробуйте позже."
        );
        return { message: msg, demoMode: true };
      }
    }

    // Scenario 3: Create campaign
    if (
      lower.includes("создать кампанию") ||
      lower.includes("помоги создать") ||
      lower.includes("рекламную кампанию")
    ) {
      const msg = generateAssistantMessage(
        "Для создания рекламной кампании необходимо указать:\n\n• Название кампании\n• Описание\n• Бюджет (в рублях)\n• Дату начала и окончания\n• Выбор рекламных каналов из каталога\n\nВы можете создать кампанию в разделе Кампании → Создать кампанию.\n\nВсе данные демонстрационные.",
        [
          {
            tool: "create-campaign",
            input: { action: "redirect" },
            output: { route: "/campaigns/create" },
            demo: true,
          },
        ]
      );
      return { message: msg, toolCalls: [], demoMode: true };
    }

    // Scenario 4: Information about existing campaigns
    if (
      lower.includes("какие кампании") ||
      lower.includes("мои кампании") ||
      lower.includes("список кампаний") ||
      lower.includes("кампании у меня")
    ) {
      try {
        const campaigns = await campaignsService.getCampaigns();
        const active = campaigns.filter((c) => c.status === "active");
        const draft = campaigns.filter((c) => c.status === "draft");
        const completed = campaigns.filter((c) => c.status === "completed");

        const msg = generateAssistantMessage(
          "Ваши рекламные кампании (демонстрационные данные):\n\n• Всего: " +
            campaigns.length +
            "\n• Активных: " +
            active.length +
            "\n• Черновиков: " +
            draft.length +
            "\n• Завершённых: " +
            completed.length +
            "\n\n" +
            campaigns
              .map(
                (c) =>
                  "- " +
                  c.name +
                  " — " +
                  formatCurrency(c.budget) +
                  " (" +
                  c.status +
                  ")"
              )
              .join("\n") +
            "\n\nДля подробностей перейдите в раздел Кампании.",
          [
            {
              tool: "campaigns",
              input: { action: "list" },
              output: {
                campaigns,
                counts: {
                  total: campaigns.length,
                  active: active.length,
                  draft: draft.length,
                  completed: completed.length,
                },
              },
              demo: true,
            },
          ]
        );
        return { message: msg, toolCalls: [], demoMode: true };
      } catch (err) {
        const msg = generateAssistantMessage(
          "Не удалось получить список кампаний. Попробуйте позже."
        );
        return { message: msg, demoMode: true };
      }
    }

    // Scenario 5: Unrecognized request — clarifying question
    const msg = generateAssistantMessage(
      "Я работаю в демонстрационном режиме и могу помочь с:\n\n• Подбором рекламных каналов («подберите каналы про технологии с бюджетом до 30 000 рублей»)\n• Расчётом бюджета («сколько стоит реклама на выбранных площадках»)\n• Информацией о кампаниях («какие кампании у меня есть»)\n• Созданием кампании («помоги создать рекламную кампанию»)\n\nПожалуйста, уточните ваш запрос. Все ответы являются демонстрационными."
    );
    return { message: msg, toolCalls: [], demoMode: true };
  },
};