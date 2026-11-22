import { useEffect, useRef } from "react";
import type { AIMessage } from "@/types";
import { MessageBubble } from "./MessageBubble";

export function ChatWindow({
  messages,
  isLoading,
  emptyMessage,
}: {
  messages: AIMessage[];
  isLoading: boolean;
  emptyMessage: string;
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-secondary">
        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <p className="text-sm font-medium text-primary">{emptyMessage}</p>
        <p className="text-xs text-muted mt-1">Начните с любого вопроса выше</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 p-4 space-y-4">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      {isLoading && (
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <div className="flex flex-col gap-1">
            <div className="w-32 h-3 bg-secondary rounded animate-pulse" />
            <div className="w-24 h-3 bg-secondary rounded animate-pulse" />
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}