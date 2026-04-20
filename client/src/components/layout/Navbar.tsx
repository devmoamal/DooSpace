import { UserDropdown } from "./UserDropdown";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/Button";
import { Box } from "lucide-react";
import { cn } from "@/lib/cn";
import { User } from "@/stores/auth.store";
import { Link } from "@tanstack/react-router";

type NavbarProps = {
  isAuthenticated: boolean;
  user: User | null;
  onLogout: () => void;
  className?: string;
};

function Navbar({ isAuthenticated, user, onLogout, className }: NavbarProps) {
  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full h-11 px-5 border-b border-border bg-bg flex items-center justify-between shrink-0 rounded-none",
        className,
      )}
    >
      <Link to="/" className="flex items-center gap-2.5">
        <div className="w-6 h-6 bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0 rounded-none">
          <Box size={14} className="text-brand shrink-0" />
        </div>
        <span className="font-bold text-[14px] text-text tracking-tight">DooSpace</span>
      </Link>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        {isAuthenticated ? (
          <UserDropdown user={user} onLogout={onLogout} />
        ) : (
          <Link to="/login">
            <Button size="sm" className="rounded-none">Sign In</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
