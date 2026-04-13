import React, { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/cn";

export type Side = "top" | "bottom" | "left" | "right";
export type Align = "start" | "center" | "end";

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  side?: Side;
  align?: Align;
  className?: string;
  contentClassName?: string;
}

export function Dropdown({
  trigger,
  children,
  side = "bottom",
  align = "end",
  className,
  contentClassName,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, handleClickOutside]);

  const getPositionClasses = () => {
    const positions: Record<Side, Record<Align, string>> = {
      bottom: {
        start:  "top-full left-0 mt-1.5 origin-top-left",
        center: "top-full left-1/2 -translate-x-1/2 mt-1.5 origin-top",
        end:    "top-full right-0 mt-1.5 origin-top-right",
      },
      top: {
        start:  "bottom-full left-0 mb-1.5 origin-bottom-left",
        center: "bottom-full left-1/2 -translate-x-1/2 mb-1.5 origin-bottom",
        end:    "bottom-full right-0 mb-1.5 origin-bottom-right",
      },
      left: {
        start:  "right-full top-0 mr-1.5 origin-top-right",
        center: "right-full top-1/2 -translate-y-1/2 mr-1.5 origin-right",
        end:    "right-full bottom-0 mr-1.5 origin-bottom-right",
      },
      right: {
        start:  "left-full top-0 ml-1.5 origin-top-left",
        center: "left-full top-1/2 -translate-y-1/2 ml-1.5 origin-left",
        end:    "left-full bottom-0 ml-1.5 origin-bottom-left",
      },
    };
    return positions[side][align];
  };

  return (
    <div className={cn("relative inline-block", className)} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div className={cn(
          "absolute z-200 bg-bg border border-border rounded-md min-w-[200px] overflow-hidden p-1",
          getPositionClasses(),
          contentClassName,
        )}>
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child as React.ReactElement<any>, {
                onClick: (e: React.MouseEvent) => {
                  const el = child as React.ReactElement<any>;
                  if (el.props.onClick) el.props.onClick(e);
                  setIsOpen(false);
                },
              });
            }
            return child;
          })}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({
  children,
  onClick,
  className,
  danger = false,
  active = false,
}: {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  danger?: boolean;
  active?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 text-[12px] cursor-pointer transition-colors flex items-center gap-2.5 rounded",
        danger
          ? "text-red-500 hover:bg-red-500/10"
          : active
            ? "text-brand bg-brand-muted"
            : "text-text-muted hover:bg-surface hover:text-text",
        className,
      )}
    >
      {children}
    </div>
  );
}
