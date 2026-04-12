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
  icon,
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

  const modalContent = (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs pointer-events-auto animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className={cn(
        "relative w-full bg-bg border border-border shadow-2xl rounded-lg overflow-hidden pointer-events-auto animate-in zoom-in-95 fade-in duration-200",
        maxWidthClasses[maxWidth],
        className
      )}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-bg text-text-muted hover:text-text transition-all duration-200 z-10 active:scale-95"
        >
          <X size={18} />
        </button>

        <div className="p-0">
          {(title || icon) && (
            <header className="px-6 py-4 border-b border-border/40">
              <div className="flex items-center gap-3">
                {icon && (
                  <div className="text-brand shrink-0">
                    {icon}
                  </div>
                )}
                <h2 className="text-xl font-semibold text-text tracking-tight">{title}</h2>
              </div>
              {subtitle && (
                <p className="text-xs text-text-muted mt-1 leading-relaxed max-w-[95%]">
                  {subtitle}
                </p>
              )}
            </header>
          )}

          <div className="p-5">
            {children}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
