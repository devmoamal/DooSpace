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
  badgeColor,
}: SidebarItemProps) {
  return (
    <Link
      to={disabled ? "#" : href}
      className={cn(
        "flex items-center px-3 py-1.5 mx-2 rounded-md text-[13px] font-medium transition-all group relative",
        isActive && !disabled
          ? "bg-brand/10 text-brand"
          : "text-text-muted hover:bg-surface-lighter hover:text-text",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        isCollapsed ? "justify-center" : "justify-between",
      )}
      title={isCollapsed ? label : undefined}
    >
      <div
        className={cn(
          "flex items-center",
          isCollapsed ? "gap-0" : "gap-3",
        )}
      >
        <Icon
          size={16}
          className={cn(
            "transition-colors shrink-0",
            isActive && !disabled
              ? "text-brand"
              : "text-text-muted group-hover:text-text",
          )}
        />
        <span
          className={cn(
            "transition-all duration-300 origin-left whitespace-nowrap",
            isCollapsed
              ? "w-0 opacity-0 scale-90"
              : "w-auto opacity-100 scale-100",
          )}
        >
          {label}
        </span>
      </div>
      {!isCollapsed && badge && (
        <span
          className={cn(
            "px-2 py-0.5 rounded-full text-[10px] font-bold animate-in zoom-in duration-300",
            badgeColor || "bg-border/40 text-text/50",
          )}
        >
          {badge}
        </span>
      )}
    </Link>
  );
}
