import type { AIMessage } from "@/types";

export function MessageBubble({ message }: { message: AIMessage }) {
  const isUser = message.sender === "user";

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      } mb-2 max-w-[85%]`}
    >
      <div
        className={`px-4 py-3 rounded-lg rounded-tl-none ${
          isUser
            ? "bg-accent text-white rounded-tr-none"
            : "bg-white border border-border text-primary rounded-tr-none"
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        <span className={`text-[10px] mt-1 block ${
          isUser ? "text-accent-light" : "text-muted"
        }`}>
          {new Date(message.timestamp).toLocaleTimeString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}