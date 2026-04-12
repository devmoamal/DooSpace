import { Link } from "@tanstack/react-router";
import { LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import { cn } from "@/lib/cn";
import { User } from "@/stores/auth.store";

interface UserDropdownProps {
  user: User | null;
  onLogout: () => void;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  className?: string;
  hideLabels?: boolean;
}

export function UserDropdown({
  user,
  onLogout,
  side = "bottom",
  align = "end",
  className,
  hideLabels = false,
}: UserDropdownProps) {
  if (!user) return null;

  const trigger = (
    <button
      className={cn(
        "flex items-center gap-3 p-2 rounded-md hover:bg-surface-lighter transition-all group w-full text-left cursor-pointer",
        hideLabels && "justify-center",
      )}
    >
      <div className="w-6 h-6 rounded-md bg-brand/10 border border-brand/20 flex items-center justify-center text-brand text-[10px] font-bold uppercase shrink-0">
        {user.username.charAt(0)}
      </div>
      {!hideLabels && (
        <>
          <div className="flex-1 min-w-0 animate-in fade-in slide-in-from-left-2 duration-300">
            <p className="text-[13px] font-medium text-text truncate leading-none">
              {user.username}
            </p>
          </div>
          <ChevronDown
            size={14}
            className="text-text-muted/40 group-hover:text-text-muted transition-colors shrink-0"
          />
        </>
      )}
    </button>
  );

  return (
    <Dropdown
      trigger={trigger}
      side={side}
      align={align}
      className={className}
      contentClassName="w-56 overflow-hidden"
    >
      <Link to="/dashboard" className="block w-full">
        <DropdownItem>
          <LayoutDashboard size={14} />
          <span>Dashboard</span>
        </DropdownItem>
      </Link>

      <div className="border-t border-border/30 mx-2 my-1" />

      <DropdownItem onClick={onLogout} danger>
        <LogOut size={14} />
        <span>Sign out</span>
      </DropdownItem>
    </Dropdown>
  );
}
