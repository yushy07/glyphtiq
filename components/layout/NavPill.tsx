import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface NavPillProps {
  href: string;
  active?: boolean;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function NavPill({ href, active = false, children, className, onClick }: NavPillProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative inline-flex items-center justify-center gap-1.5 overflow-hidden rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        active
          ? "border-primary/60 bg-primary/20 text-foreground shadow-[0_0_16px_rgba(139,92,246,0.4)] backdrop-blur-xl"
          : "border-white/10 bg-[#121218]/85 text-muted hover:border-white/20 hover:bg-[#161620]/92 hover:text-foreground backdrop-blur-xl",
        className
      )}
    >
      <span className="relative z-10 flex items-center gap-1.5">{children}</span>
    </Link>
  );
}
