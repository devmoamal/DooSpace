import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/cn";
import { LucideIcon } from "lucide-react";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  isActive: boolean;
  isCollapsed: boolean;
  disabled?: boolean;
  badge?: string;
  badgeColor?: string;
}

export function SidebarItem({
  icon: Icon,
  label,
  href,
  isActive,
  isCollapsed,
  disabled,
  badge,
}: SidebarItemProps) {
  return (
    <Link
      to={disabled ? "#" : href}
      className={cn(
        "flex items-center px-2.5 py-1.5 mx-1.5 rounded text-[12px] font-medium transition-colors group",
        isActive && !disabled
          ? "bg-surface text-text"
          : "text-text-muted hover:bg-surface hover:text-text",
        disabled && "opacity-40 cursor-not-allowed pointer-events-none",
        isCollapsed ? "justify-center" : "justify-between",
      )}
      title={isCollapsed ? label : undefined}
    >
      <div className={cn("flex items-center", isCollapsed ? "gap-0" : "gap-2.5")}>
        <Icon
          size={15}
          className={cn(
            "shrink-0 transition-colors",
            isActive && !disabled ? "text-text" : "text-text-subtle group-hover:text-text-muted",
          )}
        />
        <span className={cn(
          "transition-all duration-200 origin-left whitespace-nowrap",
          isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100",
        )}>
          {label}
        </span>
      </div>
      {!isCollapsed && badge && (
        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-surface-lighter text-text-muted">
          {badge}
        </span>
      )}
    </Link>
  );
}
