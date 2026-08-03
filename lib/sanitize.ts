/**
 * Strips null bytes, control characters and bidi-override controls while
 * preserving newlines and tabs (multiline text is a feature).
 *
 * The C1 range and Unicode bidi controls are removed so persisted shared text
 * cannot spoof the visual order of characters (e.g. via RTL/LTR overrides).
 */
export function sanitizeText(input: string): string {
  return Array.from(
    input
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .replace(
        /[\u0000\u0001-\u0008\u000B\u000C\u000E-\u001F\u007F\u0080-\u009F\u200E\u200F\u2028\u2029\u202A-\u202E\u2066-\u2069\u061C\u00AD\uFEFF]/g,
        "",
      ),
  )
    .slice(0, 2000)
    .join("");
}
