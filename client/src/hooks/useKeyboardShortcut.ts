import { useEffect } from "react";

interface UseKeyboardShortcutOptions {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  onShortcut: () => void;
}

export const useKeyboardShortcut = ({
  key,
  ctrlKey = false,
  metaKey = false,
  shiftKey = false,
  altKey = false,
  onShortcut,
}: UseKeyboardShortcutOptions) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const matchKey = e.key.toLowerCase() === key.toLowerCase();
      const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
      const hostCtrl = isMac ? e.metaKey : e.ctrlKey;
      
      if (matchKey && (ctrlKey || metaKey ? hostCtrl : true) && (shiftKey ? e.shiftKey : true) && (altKey ? e.altKey : true)) {
         // Special handling for Cmd+S/Ctrl+S
         if ((key === 's' && (e.metaKey || e.ctrlKey))) {
            e.preventDefault();
            onShortcut();
         }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [key, ctrlKey, metaKey, shiftKey, altKey, onShortcut]);
};

// Simplified version specifically for Save
export const useSaveShortcut = (onSave: () => void) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        onSave();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSave]);
};
