"use client";

import type { ReactNode } from "react";
import dynamic from "next/dynamic";

const FloatingLines = dynamic(() => import("@/components/ui/FloatingLines"), {
  ssr: false,
});

const ClickSpark = dynamic(() => import("@/components/ui/ClickSpark"), {
  ssr: false,
});

interface BackgroundEffectsProps {
  children: ReactNode;
}

export function BackgroundEffects({ children }: BackgroundEffectsProps) {
  return (
    <>
      <FloatingLines
        linesGradient={["#8b5cf6", "#ff4d9d", "#22d3ee"]}
        enabledWaves={["top", "middle", "bottom"]}
        lineCount={[6, 9, 12]}
        lineDistance={21.5}
        bendRadius={6}
        bendStrength={-1.5}
        animationSpeed={0.8}
        parallax
        parallaxStrength={0.12}
        interactive
        mixBlendMode="screen"
        style={{ position: "fixed", inset: 0, zIndex: -1, opacity: 0.6 }}
      />
      <ClickSpark
        sparkColor="#a78bfa"
        sparkSize={18}
        sparkRadius={34}
        sparkCount={10}
        duration={500}
      >
        {children}
      </ClickSpark>
    </>
  );
}
