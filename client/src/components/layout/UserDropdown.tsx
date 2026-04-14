import { Link } from "@tanstack/react-router";
import { LogOut, ChevronDown, LayoutGrid } from "lucide-react";
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
  showDashboard?: boolean;
}

export function UserDropdown({
  user,
  onLogout,
  side = "bottom",
  align = "end",
  className,
  hideLabels = false,
  showDashboard = false,
}: UserDropdownProps) {
  if (!user) return null;

  const trigger = (
    <button
      className={cn(
        "flex items-center gap-2 px-2 py-1.5 rounded hover:bg-surface transition-colors w-full text-left cursor-pointer",
        hideLabels && "justify-center",
      )}
    >
      <div className="w-6 h-6 rounded bg-surface-lighter border border-border flex items-center justify-center text-text-muted text-[10px] font-bold uppercase shrink-0">
        {user.username.charAt(0)}
      </div>
      {!hideLabels && (
        <>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium text-text truncate leading-none">{user.username}</p>
          </div>
          <ChevronDown size={13} className="text-text-subtle shrink-0" />
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
      contentClassName="w-48 overflow-hidden"
    >
      {showDashboard && (
        <Link to="/dashboard">
          <DropdownItem>
            <LayoutGrid size={13} />
            <span>Dashboard</span>
          </DropdownItem>
        </Link>
      )}
      {showDashboard && <div className="border-b border-border mx-2 my-1" />}
      <DropdownItem onClick={onLogout} danger>
        <LogOut size={13} />
        <span>Sign out</span>
      </DropdownItem>
    </Dropdown>
  );
}
