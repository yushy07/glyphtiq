"use client";

import { useCallback } from "react";
import { track } from "@/lib/analytics";
import { useClipboard } from "@/hooks/useClipboard";
import { useToast } from "@/components/ui/Toast";
import { useUnifiedActivity } from "./recents";
import type { EntityType } from "./types";

export function usePlatformCopy() {
  const { copy } = useClipboard();
  const { push } = useToast();
  const { logActivity } = useUnifiedActivity();

  const copyText = useCallback(
    async (
      text: string,
      options: {
        id: string;
        type: EntityType;
        title: string;
        slug?: string;
        appSlug?: string;
      },
    ) => {
      const ok = await copy(text);
      if (!ok) {
        push("Could not copy to clipboard", "error");
        return false;
      }

      logActivity({
        id: options.id,
        type: options.type,
        action: "copy",
        title: options.title,
        content: text,
        slug: options.slug,
      });

      track("copy", `${options.type}:${options.slug ?? options.id}`, undefined, options.appSlug ?? options.type);
      push(`Copied ${options.title}`, "copy");
      return true;
    },
    [copy, logActivity, push],
  );

  return { copyText };
}
