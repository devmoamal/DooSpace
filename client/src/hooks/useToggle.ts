import { useState, useCallback } from "react";

/**
 * A hook to manage a boolean state toggle.
 * Useful for modals, dropdowns, and collapse states.
 * 
 * @param initialState - Initial boolean value
 * @returns [state, toggle, setTrue, setFalse]
 */
export function useToggle(initialState: boolean = false) {
  const [state, setState] = useState(initialState);

  const toggle = useCallback(() => setState((s) => !s), []);
  const setTrue = useCallback(() => setState(true), []);
  const setFalse = useCallback(() => setState(false), []);

  return [state, toggle, setTrue, setFalse] as const;
}
