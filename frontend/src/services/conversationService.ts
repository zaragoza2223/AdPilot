import type { AIMessage, Conversation } from "@/types";

const STORAGE_KEY = "adpilot_ai_conversations";
const DELAY_MS = 300;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function readConversationsFromStorage(): Conversation[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      console.warn("[conversationService] localStorage содержит не массив, игнорируем");
      return null;
    }
    return parsed as Conversation[];
  } catch (err) {
    console.error("[conversationService] Ошибка чтения localStorage:", err);
    return null;
  }
}

function writeConversationsToStorage(conversations: Conversation[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  } catch (err) {
    console.error("[conversationService] Ошибка записи localStorage:", err);
  }
}

let conversationsCache: Conversation[] | null = null;
let storageError: string | null = null;

function ensureInitialized(): Conversation[] {
  if (conversationsCache !== null) {
    return conversationsCache;
  }

  const stored = readConversationsFromStorage();
  if (stored !== null) {
    conversationsCache = stored;
    return conversationsCache;
  }

  conversationsCache = [];
  writeConversationsToStorage(conversationsCache);
  return conversationsCache;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function nowISO(): string {
  return new Date().toISOString();
}

export const conversationService = {
  async getConversations(): Promise<Conversation[]> {
    await delay(DELAY_MS);
    const conversations = ensureInitialized();
    return [...conversations].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  },

  async getStorageError(): Promise<string | null> {
    await delay(DELAY_MS);
    return storageError;
  },

  async setStorageError(error: string | null): Promise<void> {
    storageError = error;
  },

  async createConversation(): Promise<Conversation> {
    await delay(DELAY_MS);
    const conversations = ensureInitialized();
    const newConversation: Conversation = {
      id: generateId(),
      title: "Новый диалог",
      createdAt: nowISO(),
      updatedAt: nowISO(),
      messages: [],
    };
    conversations.unshift(newConversation);
    writeConversationsToStorage(conversations);
    conversationsCache = conversations;
    return newConversation;
  },

  async getConversation(id: string): Promise<Conversation | undefined> {
    await delay(DELAY_MS);
    const conversations = ensureInitialized();
    return conversations.find((c) => c.id === id);
  },

  async addMessage(
    conversationId: string,
    message: AIMessage
  ): Promise<void> {
    await delay(DELAY_MS);
    const conversations = ensureInitialized();
    const index = conversations.findIndex((c) => c.id === conversationId);
    if (index === -1) {
      throw new Error(`Диалог с ID ${conversationId} не найден`);
    }

    conversations[index].messages.push(message);
    conversations[index].updatedAt = nowISO();

    // Обновляем название по первому сообщению пользователя
    if (
      conversations[index].messages.length === 1 &&
      message.sender === "user"
    ) {
      conversations[index].title = message.content.length > 40
        ? message.content.slice(0, 40) + "..."
        : message.content;
    }

    writeConversationsToStorage(conversations);
    conversationsCache = conversations;
  },

  async deleteConversation(id: string): Promise<void> {
    await delay(DELAY_MS);
    const conversations = ensureInitialized();
    const filtered = conversations.filter((c) => c.id !== id);
    writeConversationsToStorage(filtered);
    conversationsCache = filtered;
  },
};