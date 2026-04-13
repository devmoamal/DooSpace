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
        "sticky top-0 z-50 w-full h-11 px-5 border-b border-border bg-bg flex items-center justify-between shrink-0",
        className,
      )}
    >
      <Link to="/" className="flex items-center gap-2">
        <Box size={16} className="text-brand" />
        <span className="font-semibold text-[13px] text-text">DooSpace</span>
      </Link>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        {isAuthenticated ? (
          <UserDropdown user={user} onLogout={onLogout} />
        ) : (
          <Link to="/login">
            <Button size="sm">Sign In</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
