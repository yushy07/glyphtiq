import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className={cn("flex items-center", compact ? "gap-2" : "gap-2.5")}>
      <span
        className={cn(
          "grid shrink-0 place-items-center overflow-hidden rounded-xl bg-surface ring-1 ring-border",
          compact ? "size-7" : "size-8",
        )}
      >
        <Image
          src="/glyphy-mark.svg"
          alt=""
          width={32}
          height={32}
          unoptimized
          className={cn("object-cover", compact ? "size-7" : "size-8")}
        />
      </span>
      <span className={cn("font-extrabold tracking-tight", compact ? "text-base" : "text-lg")}>
        <span className="gradient-text">Glyphy</span>
      </span>
    </span>
  );
}
