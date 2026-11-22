import { useState, useEffect } from "react";
import { Plus, Clock, Trash2, Activity, ChevronRight } from "lucide-react";
import type { Conversation } from "@/types";

export function ChatSidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onCreateConversation,
  onDeleteConversation,
  storageError,
}: {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onCreateConversation: () => Promise<void>;
  onDeleteConversation: (id: string) => Promise<void>;
  storageError: string | null;
}) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    // conversations are passed from parent, this is just for error checking
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeletingId(id);
    try {
      await onDeleteConversation(id);
      if (activeConversationId === id) {
        const next = conversations.find((c) => c.id !== id)?.id;
        if (next) {
          onSelectConversation(next);
        }
      }
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col h-full border-r border-border bg-white w-[260px] min-w-[260px] flex-shrink-0">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-accent" />
          <h1 className="font-bold text-lg text-primary">AdPilot AI</h1>
        </div>
        <p className="text-xs text-secondary mt-1">Demo Mode</p>
        <button
          onClick={onCreateConversation}
          className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 bg-accent text-white rounded-md text-sm font-medium hover:bg-accent-hover transition"
        >
          <Plus size={16} /> Новый диалог
        </button>
      </div>

      {storageError && (
        <div className="p-3 mb-3 bg-error-light border border-error text-error text-sm rounded-md">
          Ошибка загрузки истории: {storageError}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-secondary text-sm">
            Нет сохранённых диалогов
          </div>
        ) : (
          conversations.map((conv) => {
            const isActive = conv.id === activeConversationId;
            const lastMessage = conv.messages[conv.messages.length - 1];
            const preview = lastMessage
              ? lastMessage.content.length > 30
                ? lastMessage.content.slice(0, 30) + "..."
                : lastMessage.content
              : "Пустой диалог";
            return (
              <div
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition ${
                  isActive
                    ? "bg-accent-light text-primary"
                    : "text-secondary hover:bg-secondary"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium truncate">{conv.title}</span>
                    {deletingId === conv.id ? (
                      <Clock className="w-3 h-3 text-secondary animate-spin" />
                    ) : (
                      <ChevronRight className="w-3 h-3 text-muted" />
                    )}
                  </div>
                  <span className="text-xs text-muted truncate">{preview}</span>
                </div>
                <button
                  onClick={(e) => handleDelete(e, conv.id)}
                  className="p-1 text-muted hover:text-error hover:bg-error-light rounded transition opacity-0 group-hover:opacity-100"
                  aria-label="Удалить диалог"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}