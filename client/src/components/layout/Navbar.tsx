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
        "sticky top-6 mx-auto z-50 w-full max-w-7xl mt-6 px-4 py-2 backdrop-blur-xl rounded-full border border-brand/15 flex items-center justify-between flex-none",
        className,
      )}
    >
      <Link to="/" className="flex items-center gap-2 group px-2">
        <Box size={16} className="text-brand" />
        <span className="font-semibold text-xl tracking-tight">
          DooSpace
        </span>
      </Link>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <div className="h-6 w-px bg-border mx-1" />
        {isAuthenticated ? (
          <UserDropdown user={user} onLogout={onLogout} />
        ) : (
          <Link to="/login">
            <Button size="sm" className="px-6">
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
