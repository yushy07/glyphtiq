"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";

interface Store<T> {
  snapshot: T;
  initial: T;
  listeners: Set<() => void>;
}

const stores = new Map<string, Store<unknown>>();

function storeForKey<T>(key: string, initial: T): Store<T> {
  let store = stores.get(key) as Store<T> | undefined;
  if (!store) {
    store = { snapshot: initial, initial, listeners: new Set() };
    stores.set(key, store as Store<unknown>);
  }
  return store;
}

/** Replace the store's snapshot and notify every subscribed hook instance. */
function setSnapshot<T>(key: string, next: T) {
  const store = stores.get(key);
  if (!store) return;
  store.snapshot = next;
  for (const listener of store.listeners) listener();
}

function subscribe<T>(store: Store<T>, listener: () => void): () => void {
  store.listeners.add(listener);
  return () => {
    store.listeners.delete(listener);
  };
}

/**
 * LocalStorage-backed state with corruption protection, cross-tab sync, and a
 * single shared store per key. Every mounted hook instance subscribes to the
 * same store, so same-tab writes made on one page are picked up everywhere
 * else (e.g. the header's Quick Apps learning a recently visited app) without
 * racing — no persist-on-mount, so a fresh component never clobbers stored data.
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
  const store = storeForKey(key, initialValue);
  const validateRef = useRef(validate);
  // eslint-disable-next-line react-hooks/refs -- latest-value ref kept in sync during render, read only in effects/handlers
  validateRef.current = validate;

  const isValid = useCallback((parsed: unknown): parsed is T => {
    if (validateRef.current) return validateRef.current(parsed);
    return typeof parsed !== "undefined" && parsed !== null;
  }, []);

  // Client-side hydration — read localStorage into the shared store once.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) {
        const parsed: unknown = JSON.parse(raw);
        if (isValid(parsed)) {
          setSnapshot(key, parsed as T);
        } else {
          window.localStorage.removeItem(key);
        }
      }
    } catch {
      // Unavailable or corrupt — keep the default.
    }
  }, [key, isValid]);

  // Cross-tab sync (same-tab writes go through the shared store directly).
  useEffect(() => {
    const handler = (event: StorageEvent) => {
      if (event.key !== key) return;
      try {
        if (event.newValue === null) {
          setSnapshot(key, store.initial);
        } else {
          const parsed: unknown = JSON.parse(event.newValue);
          setSnapshot(key, isValid(parsed) ? (parsed as T) : store.initial);
        }
      } catch {
        // Ignore malformed cross-tab writes.
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [key, isValid, store]);

  const subscribeCb = useCallback((listener: () => void) => subscribe(store, listener), [store]);
  const getSnapshot = useCallback(() => store.snapshot, [store]);

  const value = useSyncExternalStore(subscribeCb, getSnapshot, getSnapshot);

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const resolved =
        typeof next === "function" ? (next as (prev: T) => T)(store.snapshot) : next;
      try {
        window.localStorage.setItem(key, JSON.stringify(resolved));
      } catch {
        // Storage full or unavailable — fail silently.
      }
      setSnapshot(key, resolved);
    },
    [key, store],
  );

  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Unavailable — fail silently.
    }
    setSnapshot(key, store.initial);
  }, [key, store]);

  return [value, setValue, reset] as const;
}
