import type { Metadata } from "next";
import { UsernameStudio } from "@/components/usernames/UsernameStudio";

export const metadata: Metadata = {
  title: "Free Fire Name Generator — Stylish FF Nicknames & Clan Marks | Glyphtiq",
  description: "Generate stylish Free Fire nicknames with Japanese symbols (ツ, 乂, 〆, 么, 彡). Verified against Garena Free Fire 12-character rule limits with instant copy.",
};

export default function FreeFireNamePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <UsernameStudio initialPlatform="freeFire" initialTheme="warrior" />
    </div>
  );
}
