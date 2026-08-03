"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Clipboard with a legacy fallback for browsers without the async API.
 * Returns true only when the text actually reached the clipboard.
 */
export function useClipboard() {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  const copy = useCallback(async (text: string): Promise<boolean> => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        let ok = false;
        try {
          ok = document.execCommand("copy");
        } finally {
          textarea.remove();
        }
        if (!ok) return false;
      }
      setCopied(true);
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setCopied(false), 1500);
      return true;
    } catch {
      setCopied(false);
      return false;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  return { copy, copied };
}
