import { useState, type ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

interface MainLayoutProps {
  children: ReactNode;
  fullHeight?: boolean;
}

export function MainLayout({ children, fullHeight = false }: MainLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex flex-1 overflow-hidden">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden relative" style={{ marginLeft: collapsed ? 72 : 260 }}>
        <Header title="AdPilot" subtitle="Панель управления рекламными кампаниями" />
        <main className={fullHeight ? "flex-1 flex flex-col min-h-0 overflow-hidden bg-secondary" : "flex-1 overflow-y-auto bg-secondary p-6"}>
          {children}
        </main>
      </div>
    </div>
  );
}