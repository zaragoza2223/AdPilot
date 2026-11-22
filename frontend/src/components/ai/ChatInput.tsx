import { useState, useRef } from "react";
import type { KeyboardEvent } from "react";
import { Send } from "lucide-react";

export function ChatInput({
  onSend,
  isLoading,
  placeholder,
}: {
  onSend: (text: string) => void;
  isLoading: boolean;
  placeholder?: string;
}) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    // Shift+Enter allows new line (default textarea behaviour)
  };

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setText("");
    textareaRef.current?.focus();
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    // Auto-resize textarea
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div className="border-t border-border bg-white p-3" style={{ paddingBottom: 20 }}>
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "Напишите сообщение..."}
          className="flex-1 px-3 py-2 text-sm rounded-md border border-border bg-secondary focus:outline-none focus:border-accent resize-none min-h-[44px] max-h-[120px] min-w-[0]"
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={!text.trim() || isLoading}
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${
            (!text.trim() || isLoading)
              ? "bg-secondary text-muted cursor-not-allowed"
              : "bg-accent text-white hover:bg-accent-hover"
          }`}
        >
          <Send size={18} />
        </button>
      </div>
      {isLoading && (
        <p className="text-xs text-secondary mt-1">Ассистент отвечает...</p>
      )}
    </div>
  );
}