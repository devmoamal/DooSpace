import { type Page } from "@doospace/shared";
import { Link } from "@tanstack/react-router";
import { 
  FileText, 
  Trash2, 
  ExternalLink,
  ChevronRight,
  Clock
} from "lucide-react";
import { cn } from "@/lib/cn";
import { IconButton } from "@/components/ui/IconButton";
import { formatDistanceToNow } from "date-fns";
import { API_BASE_URL } from "@/constants";

interface PageListItemProps {
  page: Page;
  view: "grid" | "list";
  onDelete?: (id: string) => void;
}

export function PageListItem({ page, view, onDelete }: PageListItemProps) {
  const isGrid = view === "grid";

  return (
    <div className={cn(
      "group relative flex transition-all duration-200 bg-surface border border-border hover:border-brand/40 hover:shadow-sm",
      isGrid ? "flex-col p-4 h-full" : "items-center px-4 py-3 gap-4"
    )}>
      {/* Icon/Preview Area */}
      <div className={cn(
        "shrink-0 flex items-center justify-center bg-bg border border-border group-hover:border-brand/30 transition-colors",
        isGrid ? "w-full h-32 mb-4" : "w-10 h-10"
      )}>
        <FileText size={isGrid ? 32 : 18} className="text-text-muted group-hover:text-brand transition-colors" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <Link 
          to="/pages/$pageId" 
          params={{ pageId: page.id }}
          className="block hover:underline"
        >
          <h3 className="text-[13px] font-bold text-text truncate tracking-tight">{page.name}</h3>
        </Link>
        <div className="flex items-center gap-3 mt-1 opacity-60">
           <div className="flex items-center gap-1.5 text-[10px] font-medium font-mono uppercase tracking-wider text-text-muted">
            <Clock size={11} />
            {formatDistanceToNow(new Date(page.created_at), { addSuffix: true })}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className={cn(
        "flex items-center gap-1",
        isGrid ? "mt-4 pt-4 border-t border-border/50 justify-between" : "ml-auto"
      )}>
        <Link 
          to="/pages/$pageId" 
          params={{ pageId: page.id }}
        >
          <IconButton variant="subtle" size="sm" title="Open Studio">
            <ChevronRight size={14} />
          </IconButton>
        </Link>
        
        <a 
          href={`${API_BASE_URL}/pages/${page.id}/serve`} 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <IconButton variant="subtle" size="sm" title="View Live">
            <ExternalLink size={14} />
          </IconButton>
        </a>

        <IconButton 
          variant="danger" 
          size="sm" 
          title="Delete"
          onClick={() => onDelete?.(page.id)}
        >
          <Trash2 size={14} />
        </IconButton>
      </div>
    </div>
  );
}
