import { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SidebarSectionProps {
  title: string;
  isCollapsed: boolean;
  children: ReactNode;
}

export function SidebarSection({ title, isCollapsed, children }: SidebarSectionProps) {
  return (
    <div className="space-y-1 mt-6 first:mt-0">
      {!isCollapsed && (
        <h3 className="px-5 mb-2 text-[10px] font-bold text-text/40 uppercase tracking-widest animate-in fade-in duration-300">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
