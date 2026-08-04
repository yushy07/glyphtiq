import type { SVGProps } from "react";

/** Brand-inspired tactical glyph for COD Mobile (shield with stacked
 *  chevrons). Monochrome: the renderer controls color via currentColor. */
export function CodMobileIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" {...props}>
      <path
        fillRule="evenodd"
        d="M12 1.5L21 4.5V11c0 4.5-3 8.5-9 11.5C6 19.5 3 15.5 3 11V4.5L12 1.5zM7.5 7.5l4.5 3 4.5-3-1.2 1-3.3 1.2-3.3-1.2-1.2-1zM7.5 12l4.5 3 4.5-3-1.2 1-3.3 1.2-3.3-1.2-1.2-1zM7.5 16.5l4.5 3 4.5-3-1.2 1-3.3 1.2-3.3-1.2-1.2-1z"
      />
    </svg>
  );
}
