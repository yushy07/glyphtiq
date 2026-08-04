"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";

interface NavPillProps {
  href: string;
  active?: boolean;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function NavPill({ href, active = false, children, className, onClick }: NavPillProps) {
  const containerRef = useRef<HTMLAnchorElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!fillRef.current) return;

    timelineRef.current = gsap.timeline({ paused: true }).to(fillRef.current, {
      scale: 1,
      opacity: 1,
      duration: 0.25,
      ease: "power2.out",
    });

    return () => {
      timelineRef.current?.kill();
    };
  }, []);

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (active) return;
    if (containerRef.current && fillRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      gsap.set(fillRef.current, { left: x, top: y });
    }
    timelineRef.current?.play();
  };

  const handleMouseLeave = () => {
    if (active) return;
    timelineRef.current?.reverse();
  };

  return (
    <Link
      ref={containerRef}
      href={href}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative inline-flex items-center justify-center gap-1.5 overflow-hidden rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        active
          ? "border-primary/60 bg-primary/20 text-foreground shadow-[0_0_16px_rgba(139,92,246,0.4)] backdrop-blur-xl"
          : "border-white/10 bg-[#121218]/85 text-muted hover:border-white/20 hover:bg-[#161620]/92 hover:text-foreground backdrop-blur-xl",
        className
      )}
    >
      <span
        ref={fillRef}
        aria-hidden
        className="pointer-events-none absolute size-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-primary/30 via-secondary/20 to-primary/30 opacity-0 scale-0 blur-xs"
      />
      <span className="relative z-10 flex items-center gap-1.5">{children}</span>
    </Link>
  );
}
