import { useState, useEffect, useCallback } from "react";
import type { AIMessage, Conversation, Channel } from "@/types";
import { conversationService } from "@/services/conversationService";
import { assistantService } from "@/services/assistantService";
import { ChatSidebar } from "@/components/ai/ChatSidebar";
import { ChatWindow } from "@/components/ai/ChatWindow";
import { ChatInput } from "@/components/ai/ChatInput";
import { QuickPrompts } from "@/components/ai/QuickPrompts";
import { ChannelResultCard } from "@/components/ai/ChannelResultCard";
import { BudgetSummaryCard } from "@/components/ai/BudgetSummaryCard";

export function AIAssistant() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [quickPromptsVisible, setQuickPromptsVisible] = useState(true);
  const [toolResultCards, setToolResultCards] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const err = await conversationService.getStorageError();
      setStorageError(err);
      const convs = await conversationService.getConversations();
      setConversations(convs);
      if (convs.length > 0 && !activeConversationId) {
        setActiveConversationId(convs[0].id);
      }
    } catch (err) {
      setStorageError("Не удалось загрузить историю диалогов");
    }
  };

  const createConversation = async () => {
    const newConv = await conversationService.createConversation();
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
    setQuickPromptsVisible(true);
    setToolResultCards([]);
  };

  const selectConversation = async (id: string) => {
    setActiveConversationId(id);
    setQuickPromptsVisible(false);
    setToolResultCards([]);
    const conv = await conversationService.getConversation(id);
    setActiveConversation(conv || null);
  };

  const deleteConversation = async (id: string) => {
    await conversationService.deleteConversation(id);
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConversationId === id) {
      const remaining = conversations.filter((c) => c.id !== id);
      setActiveConversationId(remaining.length > 0 ? remaining[0].id : null);
      if (remaining.length > 0) {
        selectConversation(remaining[0].id);
      } else {
        setActiveConversation(null);
      }
    }
  };

  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!activeConversation) return;

      const userMessage: AIMessage = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2),
        sender: "user",
        content: text,
        timestamp: new Date().toISOString(),
      };

      await conversationService.addMessage(activeConversation.id, userMessage);
      setActiveConversation((prev) =>
        prev
          ? { ...prev, messages: [...prev.messages, userMessage] }
          : null
      );
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversation!.id
            ? { ...c, messages: [...c.messages, userMessage] }
            : c
        )
      );
      setIsLoading(true);
      setQuickPromptsVisible(false);
      setToolResultCards([]);

      try {
        const response = await assistantService.processMessage(text);

        await conversationService.addMessage(
          activeConversation.id,
          response.message
        );
        setActiveConversation((prev) =>
          prev
            ? { ...prev, messages: [...prev.messages, response.message] }
            : null
        );
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConversation!.id
              ? { ...c, messages: [...c.messages, response.message] }
              : c
          )
        );

        if (response.toolCalls && response.toolCalls.length > 0) {
          const cards: React.ReactNode[] = [];
          for (const tc of response.toolCalls) {
            if (tc.tool === "channels" && tc.output && typeof tc.output === "object" && "channels" in tc.output) {
              const chans = (tc.output as { channels: Channel[] }).channels;
              if (chans.length > 0) {
                cards.push(
                  <div key="channels-card" className="mb-4">
                    <h3 className="text-sm font-medium text-primary mb-2">Подобранные каналы</h3>
                    <div className="flex flex-wrap gap-2">
                      {chans.map((c) => (
                        <ChannelResultCard key={c.id} channel={c} />
                      ))}
                    </div>
                  </div>
                );
              }
            }
            if (tc.tool === "budget" && tc.output && typeof tc.output === "object" && "totalCost" in tc.output) {
              const budgetOut = tc.output as { totalCost: number; channelCount: number };
              cards.push(
                <div key="budget-card" className="mb-4">
                  <BudgetSummaryCard
                    totalCost={budgetOut.totalCost}
                    channelCount={budgetOut.channelCount}
                  />
                </div>
              );
            }
          }
          setToolResultCards(cards);
        }
      } catch (err) {
        console.error("Assistant error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [activeConversation]
  );

  const handlePromptSelect = useCallback(
    (text: string) => {
      handleSendMessage(text);
    },
    [handleSendMessage]
  );

  const currentMessages = activeConversation?.messages || [];

  return (
    <div className="flex flex-1 h-full overflow-hidden bg-secondary">
      <ChatSidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={selectConversation}
        onCreateConversation={createConversation}
        onDeleteConversation={deleteConversation}
        storageError={storageError}
      />
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <div className="border-b border-border bg-white p-4">
          <h2 className="text-lg font-bold text-primary">
            {activeConversation?.title || "Чат с ассистентом"}
          </h2>
          <p className="text-xs text-secondary">
            Режим демонстрации — все ответы являются тестовыми
          </p>
        </div>
        <div className="flex flex-1 overflow-y-auto p-4 min-h-0 flex-col">
          {quickPromptsVisible && currentMessages.length === 0 && (
            <QuickPrompts onSelectPrompt={handlePromptSelect} />
          )}
          <ChatWindow
            messages={currentMessages}
            isLoading={isLoading}
            emptyMessage="Выберите диалог или начните новый, чтобы пообщаться с ассистентом"
          />
          {toolResultCards.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-secondary mb-2 uppercase tracking-wider">
                Результаты
              </h3>
              <div className="space-y-3">{toolResultCards}</div>
            </div>
          )}
        </div>
        <ChatInput
          onSend={handleSendMessage}
          isLoading={isLoading}
          placeholder="Напишите сообщение ассистенту..."
        />
      </div>
    </div>
  );
}