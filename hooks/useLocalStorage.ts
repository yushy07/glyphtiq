"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * LocalStorage-backed state with corruption protection and cross-tab sync.
 *
 * Pass an optional `validate` predicate when `T` has a shape that must be
 * checked before it's trusted (e.g. an array of strings); otherwise a stored
 * value of the wrong shape could crash consumers during render.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  validate?: (value: unknown) => value is T,
) {
  const [value, setValue] = useState<T>(initialValue);
  const initialRef = useRef(initialValue);
  const validateRef = useRef(validate);
  validateRef.current = validate;

  const isValid = useCallback((parsed: unknown): parsed is T => {
    if (validateRef.current) return validateRef.current(parsed);
    return typeof parsed !== "undefined" && parsed !== null;
  }, []);

  // Hydrate once from storage.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return;
      const parsed: unknown = JSON.parse(raw);
      if (isValid(parsed)) {
        setValue(parsed);
      } else {
        window.localStorage.removeItem(key);
      }
    } catch {
      // Unavailable or corrupt — keep the default.
    }
  }, [key, isValid]);

  // Cross-tab sync.
  useEffect(() => {
    const handler = (event: StorageEvent) => {
      if (event.key !== key) return;
      try {
        if (event.newValue === null) {
          setValue(initialRef.current);
          return;
        }
        const parsed: unknown = JSON.parse(event.newValue);
        if (isValid(parsed)) setValue(parsed);
      } catch {
        // Ignore malformed cross-tab writes.
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [key, isValid]);

  // Persist changes.
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage full or unavailable — fail silently.
    }
  }, [key, value]);

  const reset = useCallback(() => {
    setValue(initialRef.current);
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Unavailable — fail silently.
    }
  }, [key]);

  return [value, setValue, reset] as const;
}
