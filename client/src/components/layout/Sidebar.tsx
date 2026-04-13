import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutGrid,
  Terminal,
  Activity,
  Database,
  ShieldAlert,
  Settings,
  FileText,
  Box,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { UserDropdown } from "./UserDropdown";
import { useAuthStore } from "@/stores/auth.store";
import { ThemeToggle } from "./ThemeToggle";
import { useUIStore } from "@/stores/ui.store";
import { SidebarItem } from "./sidebar/SidebarItem";
import { SidebarSection } from "./sidebar/SidebarSection";

const sidebarItems = [
  {
    icon: LayoutGrid,
    label: "Overview",
    href: "/dashboard",
    section: "WORKSPACE",
  },
  { icon: Terminal, label: "Doos", href: "/doo", section: "WORKSPACE" },
  {
    icon: Activity,
    label: "Requests",
    href: "/requests",
    section: "WORKSPACE",
    badge: "3",
    badgeColor: "bg-text text-bg",
  },
  { icon: Database, label: "DooBox", href: "/doobox", section: "WORKSPACE" },
  {
    icon: ShieldAlert,
    label: "Secrets",
    href: "/secrets",
    section: "WORKSPACE",
    disabled: true,
  },
  {
    icon: Settings,
    label: "Settings",
    href: "/settings",
    section: "PROJECT",
    disabled: true,
  },
  {
    icon: FileText,
    label: "Docs",
    href: "https://docs.doospace.com",
    section: "PROJECT",
  },
];

export function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { isSidebarCollapsed, toggleSidebar } = useUIStore();

  const renderSection = (sectionName: string) => (
    <SidebarSection title={sectionName} isCollapsed={isSidebarCollapsed}>
      {sidebarItems
        .filter((i) => i.section === sectionName)
        .map((item) => {
          const isActive =
            location.pathname === item.href ||
            (item.href === "/doo" &&
              location.pathname === "/doo" &&
              !(location.search as any).view);
          return (
            <SidebarItem
              key={item.label}
              {...item}
              isActive={isActive}
              isCollapsed={isSidebarCollapsed}
            />
          );
        })}
    </SidebarSection>
  );

  return (
    <aside
      className={cn(
        "border-r border-border bg-surface flex flex-col h-full shrink-0 transition-[width] duration-200 ease-in-out will-change-[width] relative z-20 overflow-hidden",
        isSidebarCollapsed ? "w-[68px]" : "w-[240px]",
      )}
    >
      <div
        className={cn(
          "flex flex-col h-full",
          !isSidebarCollapsed ? "min-w-[240px]" : "min-w-[68px]",
        )}
      >
        {/* Header / Logo */}
        <div
          className={cn(
            "flex shrink-0 p-5 transition-all duration-200",
            isSidebarCollapsed
              ? "justify-center"
              : "justify-between items-center",
          )}
        >
          {!isSidebarCollapsed && (
            <Link
              to="/"
              className="flex items-center gap-2 group px-2 shrink-0 animate-in fade-in duration-200"
            >
              <Box size={24} className="text-brand shrink-0" />
              <span className="font-semibold text-xl tracking-tight text-text whitespace-nowrap">
                DooSpace
              </span>
            </Link>
          )}

          <div
            className={cn(
              "flex items-center gap-1",
              isSidebarCollapsed ? "flex-col" : "flex-row",
            )}
          >
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-md hover:bg-surface-lighter transition-all group border border-transparent hover:border-border text-text-muted hover:text-text cursor-pointer"
              title={isSidebarCollapsed ? "Expand Sidebar" : "Minimize Sidebar"}
            >
              {isSidebarCollapsed ? (
                <PanelLeft size={18} />
              ) : (
                <PanelLeftClose size={18} />
              )}
            </button>
            {!isSidebarCollapsed && <ThemeToggle />}
          </div>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto py-2 custom-scrollbar no-scrollbar overflow-x-hidden">
          {renderSection("WORKSPACE")}
          {renderSection("PROJECT")}
        </div>

        {/* Footer / User Profile */}
        <div
          className={cn(
            "p-4 border-t border-border mt-auto transition-all duration-150",
            isSidebarCollapsed ? "px-2" : "p-4",
          )}
        >
          {user ? (
            <UserDropdown
              user={user}
              onLogout={logout}
              side={isSidebarCollapsed ? "right" : "top"}
              align={isSidebarCollapsed ? "center" : "start"}
              className="w-full"
              hideLabels={isSidebarCollapsed}
            />
          ) : null}
        </div>
      </div>
    </aside>
  );
}

