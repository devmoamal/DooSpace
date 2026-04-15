import { ReactNode } from "react";


interface SidebarSectionProps {
  title: string;
  isCollapsed: boolean;
  children: ReactNode;
}

export function SidebarSection({ title, isCollapsed, children }: SidebarSectionProps) {
  return (
    <div className="space-y-0.5 mt-4 first:mt-2">
      {!isCollapsed && (
        <p className="px-4 mb-1 text-[9px] font-semibold text-text-subtle uppercase tracking-[0.12em]">
          {title}
        </p>
      )}
      {children}
    </div>
  );
}
