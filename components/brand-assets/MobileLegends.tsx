import type { SVGProps } from "react";

/** Brand-inspired crest glyph for Mobile Legends (blocky M punched out of a
 *  pentagon shield). Monochrome: the renderer controls color via currentColor. */
export function MobileLegendsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" {...props}>
      <path
        fillRule="evenodd"
        d="M12 1.5l10 5.5v10L12 22.5 2 17V7l10-5.5zM8.5 7h7v10h-2.2v-5.2l-1.3 1.4-1.3-1.4V17H8.5z"
      />
    </svg>
  );
}
