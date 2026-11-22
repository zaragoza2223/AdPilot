import { Bell, User, Plus } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="bg-white border-b border-border sticky top-0 z-40">
      <div className="header-grid px-6 py-4">
        {!subtitle ? null : (
          <div className="flex flex-col items-center text-center">
            <h2 className="text-lg font-semibold text-primary">{title}</h2>
            <p className="text-sm text-secondary">{subtitle}</p>
          </div>
        )}
        <div className="w-full" />

        <div className="flex items-center gap-6">
          <button className="relative p-2 text-gray-500 hover:text-accent transition-colors">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-error" />
          </button>
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent-light text-accent hover:bg-accent-hover hover:text-white transition-colors"
          >
            <Plus size={18} />
            <span className="text-sm font-medium hidden sm:block">Создать</span>
          </button>
          <div className="flex items-center gap-2 pl-4 border-l border-border ml-4">
            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-primary">
              U
            </div>
            <div className="hidden sm:flex flex-col">
              <p className="text-sm font-medium text-primary">Пользователь</p>
              <p className="text-xs text-secondary">admin@adpilot.local</p>
            </div>
            <User className="w-5 h-5 text-secondary" />
          </div>
        </div>
      </div>
    </header>
  );
}