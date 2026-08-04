import type { SVGProps } from "react";

/** Licensing-allowed creeper-face glyph (hand-drawn, matches the Minecraft
 *  head texture). Monochrome: the renderer controls color via currentColor. */
export function MinecraftIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 8 8" width="1em" height="1em" fill="currentColor" {...props}>
      <path
        fillRule="evenodd"
        d="M2 1h4v1h-4zM1 2h6v1h-6zM1 3h6v1h-6zM1 4h6v1h-6zM1 5h6v1h-6zM1 6h6v1h-6zM1 7h6v1h-6zM2 3h2v2h-2zM5 3h2v2h-2zM2 6h2v2h-2zM5 6h2v2h-2z"
      />
    </svg>
  );
}
