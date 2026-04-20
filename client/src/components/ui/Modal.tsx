import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "md",
  className,
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      {/* Panel */}
      <div className={cn(
        "relative w-full bg-bg border border-border rounded-none overflow-hidden",
        maxWidthClasses[maxWidth],
        className
      )}>
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1 text-text-subtle hover:text-text-muted transition-colors z-10 rounded-none hover:bg-surface"
        >
          <X size={15} />
        </button>

        {title && (
          <header className="px-5 pt-5 pb-4 border-b border-border">
            <h2 className="text-[13px] font-semibold text-text pr-6">{title}</h2>
            {subtitle && (
              <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">
                {subtitle}
              </p>
            )}
          </header>
        )}

        <div className="p-5">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};
