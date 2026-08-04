"use client";

import { Clock, History, Trash2 } from "lucide-react";
import { useUnifiedActivity } from "@/lib/platform/recents";

export default function ActivityPage() {
  const { activityLog, clearActivity } = useUnifiedActivity();

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:py-14">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            Recent Activity Log
          </h1>
          <p className="text-muted text-sm">
            Unified history of copied symbols, generated usernames, and favorited items (max 100).
          </p>
        </div>

        {activityLog.length > 0 && (
          <button
            type="button"
            onClick={clearActivity}
            className="flex items-center gap-1.5 rounded-2xl border border-border glass px-4 py-2 text-xs font-semibold text-rose-400 hover:border-rose-500/50 transition-colors shrink-0"
          >
            <Trash2 className="size-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </header>

      {activityLog.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border p-12 text-center">
          <History className="size-10 text-muted/50 mb-3" />
          <p className="font-semibold text-foreground">No recent activity logged</p>
          <p className="mt-1 text-xs text-muted max-w-sm">
            Items you copy or generate will automatically show up here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {activityLog.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="flex items-center justify-between rounded-2xl border border-border/80 bg-card/60 p-4 transition-all hover:border-primary/40"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-mono text-base font-bold">
                  {item.content.length <= 4 ? item.content : "✦"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-foreground">
                      {item.content}
                    </span>
                    <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-semibold uppercase text-muted">
                      {item.type} • {item.action}
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-0.5">{item.title}</p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-muted">
                <Clock className="size-3" />
                <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
