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
  KeyRound,
  Repeat,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { UserDropdown } from "./UserDropdown";
import { useAuthStore } from "@/stores/auth.store";
import { useUIStore } from "@/stores/ui.store";
import { ThemeToggle } from "./ThemeToggle";
import { SidebarItem } from "./sidebar/SidebarItem";
import { SidebarSection } from "./sidebar/SidebarSection";
import { IconButton } from "@/components/ui/IconButton";

const sidebarItems = [
  {
    icon: LayoutGrid,
    label: "Overview",
    href: "/dashboard",
    section: "Workspace",
  },
  { icon: Terminal, label: "Doos", href: "/doo", section: "Workspace" },
  {
    icon: Activity,
    label: "Requests",
    href: "/requests",
    section: "Workspace",
  },
  { icon: Database, label: "DooBox", href: "/doobox", section: "Workspace" },
  { icon: KeyRound, label: "Secrets", href: "/secrets", section: "Workspace" },
  { icon: Repeat, label: "Loops", href: "/loops", section: "Workspace" },
  {
    icon: Settings,
    label: "Settings",
    href: "/settings",
    section: "Project",
  },
  { icon: FileText, label: "Docs", href: "/docs", section: "Project" },
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
        "border-r border-border bg-bg flex flex-col h-full shrink-0 transition-[width] duration-200 ease-in-out overflow-hidden z-20 rounded-none",
        isSidebarCollapsed ? "w-[52px]" : "w-[216px]",
      )}
    >
      <div
        className={cn(
          "flex flex-col h-full",
          !isSidebarCollapsed ? "min-w-[216px]" : "min-w-[52px]",
        )}
      >
        {/* Logo + controls */}
        <div
          className={cn(
            "flex items-center shrink-0 border-b border-border gap-2",
            isSidebarCollapsed
              ? "flex-col justify-center py-2"
              : "h-11 px-3 justify-between",
          )}
        >
          {!isSidebarCollapsed && (
            <Link to="/" className="flex items-center gap-2 shrink-0 min-w-0">
              <div className="w-7 h-7 bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0 rounded-none">
                 <Box size={16} className="text-brand shrink-0" />
              </div>
              <span className="font-bold text-[14px] text-text whitespace-nowrap truncate tracking-tight">
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
            <ThemeToggle />
            <IconButton
              onClick={toggleSidebar}
              variant="ghost"
              size="sm"
              title={isSidebarCollapsed ? "Expand" : "Collapse"}
            >
              {isSidebarCollapsed ? (
                <PanelLeft size={15} />
              ) : (
                <PanelLeftClose size={15} />
              )}
            </IconButton>
          </div>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-3 no-scrollbar overflow-x-hidden">
          {renderSection("Workspace")}
          {renderSection("Project")}
        </div>

        {/* User */}
        <div
          className={cn(
            "h-12 border-t border-border flex items-center mt-auto",
            isSidebarCollapsed ? "px-1.5 justify-center" : "px-2",
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
