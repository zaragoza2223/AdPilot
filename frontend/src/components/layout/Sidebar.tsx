import { useNavigate } from "react-router";
import type { ElementType as ReactElementType } from "react";
import {
  LayoutDashboard,
  Server,
  Ad,
  MessageCircle,
  Activity,
  Settings,
  LogOut,
  Menu,
  ChevronLeft,
} from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: ReactElementType;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { id: "channels", label: "Channels", icon: Server, href: "/channels" },
  { id: "campaigns", label: "Campaigns", icon: Ad, href: "/campaigns" },
  { id: "ai", label: "AI Assistant", icon: MessageCircle, href: "/ai" },
  { id: "activity", label: "Activity", icon: Activity, href: "/activity" },
];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const navigate = useNavigate();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 ${
        collapsed
          ? `w-${"--sidebar-width-collapsed"}` // placeholder, will use inline style
          : ""
      } bg-sidebar text-white`}
      style={{
        width: collapsed ? 72 : 260,
      }}
    >
      <div className="flex flex-col h-full">
        {/* Верхняя часть: логотип и навигация */}
        <div className="flex flex-col">
          {/* Логотип */}
          <div
            className="flex items-center gap-3 px-6 py-4 border-b border-white/10"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          >
            <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center text-white">
              <span className="font-bold text-xs">A</span>
            </div>
            <div>
              {!collapsed && (
                <h2 className="text-lg font-bold tracking-tight">AdPilot</h2>
              )}
              {collapsed && <span className="font-bold text-xs">A</span>}
            </div>
          </div>

          {/* Навигация */}
          <nav className="flex-1 py-4 overflow-y-auto">
            <ul className="space-y-1 px-2">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = window.location.pathname === item.href;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => navigate(item.href)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-blue-900 text-white shadow-lg"
                          : "text-gray-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Icon size={20} />
                      {!collapsed && <span>{item.label}</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Нижняя часть: пользователь и настройки */}
        <div className="border-t border-white/10 p-4">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-md transition-colors"
          >
            {collapsed ? <ChevronLeft size={20} /> : <Menu size={20} />}
            {!collapsed && <span>Меню</span>}
          </button>
          <div className="mt-4 flex items-center gap-3 px-4 py-3 text-sm text-gray-400">
            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs font-semibold">
              U
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <p className="text-white font-medium text-sm leading-tight">Пользователь</p>
                <p className="text-xs text-gray-400 leading-tight">admin@adpilot.local</p>
              </div>
            )}
          </div>
          <div className="mt-4 px-4">
            <button
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"
            >
              <Settings size={18} />
              {!collapsed && <span>Настройки</span>}
            </button>
          </div>
          <div className="mt-2 px-4">
            <button
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
            >
              <LogOut size={18} />
              {!collapsed && <span>Выйти</span>}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}