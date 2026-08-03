import Image from "next/image";

export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <span className="grid size-8 shrink-0 place-items-center overflow-hidden rounded-xl bg-surface ring-1 ring-border">
        <Image
          src="/glyphy-mark.svg"
          alt=""
          width={32}
          height={32}
          unoptimized
          className="size-8 object-cover"
        />
      </span>
      <span className="text-lg font-extrabold tracking-tight">
        <span className="gradient-text">Glyphy</span>
      </span>
    </span>
  );
}
