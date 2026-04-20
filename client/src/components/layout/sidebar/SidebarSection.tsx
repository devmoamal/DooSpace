import { ReactNode } from "react";

interface SidebarSectionProps {
  title: string;
  isCollapsed: boolean;
  children: ReactNode;
}

export function SidebarSection({ title, isCollapsed, children }: SidebarSectionProps) {
  return (
    <div className="space-y-1 mb-6 first:mt-0">
      {!isCollapsed && (
        <p className="px-5 mb-2 text-[10px] font-bold text-text-subtle/50 select-none">
          {title}
        </p>
      )}
      <div className="space-y-0.5">
        {children}
      </div>
    </div>
  );
}
