import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutGrid,
  Terminal,
  Activity,
  Database,
  Settings,
  FileText,
  Box,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { UserDropdown } from "./UserDropdown";
import { useAuthStore } from "@/stores/auth.store";
import { useUIStore } from "@/stores/ui.store";
import { ThemeToggle } from "./ThemeToggle";
import { SidebarItem } from "./sidebar/SidebarItem";
import { SidebarSection } from "./sidebar/SidebarSection";

const sidebarItems = [
  { icon: LayoutGrid, label: "Overview", href: "/dashboard", section: "WORKSPACE" },
  { icon: Terminal,   label: "Doos",     href: "/doo",       section: "WORKSPACE" },
  { icon: Activity,   label: "Requests", href: "/requests",  section: "WORKSPACE" },
  { icon: Database,   label: "DooBox",   href: "/doobox",    section: "WORKSPACE" },
  { icon: Settings,   label: "Settings", href: "/settings",  section: "PROJECT", disabled: true },
  { icon: FileText,   label: "Docs",     href: "https://docs.doospace.com", section: "PROJECT" },
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
            (item.href === "/doo" && location.pathname === "/doo");
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
        "border-r border-border bg-bg flex flex-col h-full shrink-0 transition-[width] duration-200 ease-in-out overflow-hidden",
        isSidebarCollapsed ? "w-[52px]" : "w-[216px]",
      )}
    >
      <div className={cn(
        "flex flex-col h-full",
        !isSidebarCollapsed ? "min-w-[216px]" : "min-w-[52px]",
      )}>
        {/* Logo + controls */}
        <div className={cn(
          "flex items-center shrink-0 px-3 py-3 border-b border-border gap-2",
          isSidebarCollapsed ? "justify-center flex-col" : "justify-between",
        )}>
          {!isSidebarCollapsed && (
            <Link to="/" className="flex items-center gap-2 shrink-0 min-w-0">
              <Box size={17} className="text-brand shrink-0" />
              <span className="font-semibold text-[13px] text-text whitespace-nowrap truncate">
                DooSpace
              </span>
            </Link>
          )}
          <div className={cn("flex items-center gap-0.5", isSidebarCollapsed && "flex-col")}>
            <ThemeToggle />
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded text-text-muted hover:text-text hover:bg-surface-lighter transition-colors cursor-pointer"
              title={isSidebarCollapsed ? "Expand" : "Collapse"}
            >
              {isSidebarCollapsed ? <PanelLeft size={15} /> : <PanelLeftClose size={15} />}
            </button>
          </div>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-2 no-scrollbar overflow-x-hidden">
          {renderSection("WORKSPACE")}
          {renderSection("PROJECT")}
        </div>

        {/* User */}
        <div className={cn(
          "border-t border-border mt-auto",
          isSidebarCollapsed ? "px-1.5 py-2" : "p-2",
        )}>
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
