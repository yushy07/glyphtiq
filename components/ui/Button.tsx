"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const VARIANT: Record<Variant, string> = {
  primary: "btn-gradient text-white shadow-lg shadow-primary/25 hover:shadow-primary/40",
  secondary:
    "bg-secondary text-white shadow-lg shadow-secondary/20 hover:shadow-secondary/35",
  outline: "border border-border bg-surface/45 text-foreground backdrop-blur-md hover:bg-surface-2/60",
  ghost: "text-foreground hover:bg-surface-2",
  danger: "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20",
};

const SIZE: Record<Size, string> = {
  sm: "h-9 gap-1.5 px-3 text-sm rounded-lg",
  md: "h-11 gap-2 px-4 text-sm rounded-xl",
  lg: "h-12 gap-2 px-5 text-base rounded-xl",
  icon: "size-11 rounded-full",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", loading, children, ...props },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={cn(
        "inline-flex items-center justify-center font-semibold select-none",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        "disabled:pointer-events-none disabled:opacity-50",
        VARIANT[variant],
        SIZE[size],
        className,
      )}
      {...props}
    >
      {loading ? <span aria-hidden className="animate-spin">⏳</span> : children}
    </motion.button>
  );
});

Button.displayName = "Button";

export default Button;

export type { ButtonHTMLAttributes, ReactNode };
