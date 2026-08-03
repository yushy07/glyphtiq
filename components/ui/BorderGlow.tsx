"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import "./BorderGlow.css";

const POSITION_STYLES: Record<string, CSSProperties> = {
  top: { top: "0px", left: "50%", transform: "translateX(-50%)" },
  bottom: { bottom: "0px", left: "50%", transform: "translateX(-50%)" },
  left: { left: "0px", top: "50%", transform: "translateY(-50%)" },
  right: { right: "0px", top: "50%", transform: "translateY(-50%)" },
};

const EdgeGlow = ({
  position,
  animated,
  glowOpacity,
  colors,
}: {
  position: keyof typeof POSITION_STYLES;
  animated: boolean;
  glowOpacity: number;
  colors: string[];
}) => {
  const isHorizontal = position === "top" || position === "bottom";
  const edgeStyle: CSSProperties = {
    ...POSITION_STYLES[position],
    opacity: glowOpacity,
    width: isHorizontal ? "100%" : "2px",
    height: isHorizontal ? "2px" : "100%",
    border: "1px solid rgb(var(--glow-color))",
    animation: animated ? "edge-breathe 2s ease-in-out infinite alternate" : "none",
    background: `linear-gradient(${isHorizontal ? "to right" : "to bottom"
      }, transparent 0%, ${colors.join(", ")} 25%, ${colors.join(", ")} 75%, transparent 100%)`,
  };

  return <div className="edge-glow" style={edgeStyle} />;
};

const EdgeLight = ({
  glowSize,
  position,
  ref,
  colors,
}: {
  glowSize: number;
  position: keyof typeof POSITION_STYLES;
  ref: RefObject<HTMLDivElement | null>;
  colors: string[];
}) => {
  const isHorizontal = position === "top" || position === "bottom";

  const baseStyle: CSSProperties = {
    ...POSITION_STYLES[position],
    width: isHorizontal ? `${glowSize}%` : "100%",
    height: isHorizontal ? "100%" : `${glowSize}%`,
    mixBlendMode: "plus-lighter",
    maskImage: isHorizontal
      ? `radial-gradient(ellipse 50% 80% at 50% ${position === "top" ? "0%" : "100%"}, #000, transparent)`
      : `radial-gradient(ellipse 80% 50% at ${position === "left" ? "0%" : "100%"} 50%, #000, transparent)`,
    WebkitMaskImage: isHorizontal
      ? `radial-gradient(ellipse 50% 80% at 50% ${position === "top" ? "0%" : "100%"}, #000, transparent)`
      : `radial-gradient(ellipse 80% 50% at ${position === "left" ? "0%" : "100%"} 50%, #000, transparent)`,
  };

  const innerStyle: CSSProperties = {
    ...(isHorizontal
      ? { top: position === "top" ? "-2px" : "auto", bottom: position === "bottom" ? "-2px" : "auto", height: "2px" }
      : { left: position === "left" ? "-2px" : "auto", right: position === "right" ? "-2px" : "auto", width: "2px" }),
    background: `linear-gradient(${isHorizontal ? "to right" : "to bottom"
      }, ${colors.join(", ")}, transparent)`,
  };

  return (
    <div className="edge-light" style={baseStyle} ref={ref}>
      <div className="edge-light-inner" style={innerStyle} />
    </div>
  );
};

interface BorderGlowProps {
  children: ReactNode;
  edgeSensitivity?: number;
  glowColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
  glowRadius?: number;
  glowIntensity?: number;
  coneSpread?: number;
  animated?: boolean;
  colors?: string[];
  fillOpacity?: number;
  className?: string;
}

const BorderGlow = ({
  children,
  edgeSensitivity = 30,
  glowColor = "139, 92, 246",
  backgroundColor = "var(--surface)",
  borderRadius = 28,
  glowRadius = 40,
  glowIntensity = 2.2,
  coneSpread = 25,
  animated = false,
  colors = ["#8b5cf6", "#ff4d9d", "#22d3ee"],
  fillOpacity = 0.5,
  className = "",
}: BorderGlowProps) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [glowOpacity, setGlowOpacity] = useState(0);
  const [style, setStyle] = useState<CSSProperties>({});
  const [glowColorVar, setGlowColorVar] = useState(glowColor);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const updateAll = () => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const viewportX = window.innerWidth / 2;
      const viewportY = window.innerHeight / 2;
      const distance = Math.sqrt(
        (centerX - viewportX) * (centerX - viewportX) + (centerY - viewportY) * (centerY - viewportY)
      );
      const maxDistance = Math.sqrt(
        (rect.width / 2) * (rect.width / 2) + (rect.height / 2) * (rect.height / 2)
      );
      setGlowOpacity(Math.max(0, 1 - distance / (maxDistance + 400)));
    };

    const updateGlowProperties = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const distanceX = e.clientX - rect.left - rect.width / 2;
      const distanceY = e.clientY - rect.top - rect.height / 2;

      const glowX = -1 * (distanceX / rect.width) * (edgeSensitivity * 2);
      const glowY = -1 * (distanceY / rect.height) * (edgeSensitivity * 2);

      setStyle({
        "--mouse-x": `${mouseX}px`,
        "--mouse-y": `${mouseY}px`,
        "--glow-x": `${glowX}px`,
        "--glow-y": `${glowY}px`,
        "--glow-opacity": 1,
      } as CSSProperties);
      setGlowOpacity(1);
      setGlowColorVar(glowColor);
    };

    updateAll();
    window.addEventListener("mousemove", updateGlowProperties);
    window.addEventListener("resize", updateAll);
    return () => {
      window.removeEventListener("mousemove", updateGlowProperties);
      window.removeEventListener("resize", updateAll);
    };
  }, [edgeSensitivity, glowColor]);

  const edgeLightRefs: Record<string, RefObject<HTMLDivElement | null>> = {
    top: useRef<HTMLDivElement>(null),
    bottom: useRef<HTMLDivElement>(null),
    left: useRef<HTMLDivElement>(null),
    right: useRef<HTMLDivElement>(null),
  };

  return (
    <div
      ref={cardRef}
      className={`border-glow-card ${className}`}
      style={
        {
          "--glow-color": glowColorVar,
          "--card-bg": backgroundColor,
          "--border-radius": `${borderRadius}px`,
          "--glow-radius": `${glowRadius}px`,
          "--glow-intensity": glowIntensity,
          "--fill-opacity": fillOpacity,
          ...style,
        } as CSSProperties
      }
    >
      <div className="border-glow-inner" style={{ borderRadius: borderRadius - 1 }}>
        <div className="border-glow-top" style={{ borderRadius: `${borderRadius - 1}px ${borderRadius - 1}px 0 0` }} />
        <div className="border-glow-bottom" style={{ borderRadius: `0 0 ${borderRadius - 1}px ${borderRadius - 1}px` }} />
        <div className="border-glow-left" style={{ borderRadius: `${borderRadius - 1}px 0 0 ${borderRadius - 1}px` }} />
        <div className="border-glow-right" style={{ borderRadius: `0 ${borderRadius - 1}px ${borderRadius - 1}px 0` }} />
        <div className="border-glow-sweep-left" />
        <div className="border-glow-sweep-right" />
        <div className="border-glow-sweep-top" />
        <div className="border-glow-sweep-bottom" />
        <div className="border-glow-content">{children}</div>
      </div>
      <div className="border-glow-overlay" style={{ borderRadius }}>
        <div className="border-glow-overlay-top" />
        <div className="border-glow-overlay-left" />
        <div className="border-glow-overlay-right" />
        <div className="border-glow-overlay-bottom" />
      </div>

      {(["top", "bottom", "left", "right"] as const).map((position) => (
        <EdgeGlow key={position} position={position} animated={animated} glowOpacity={glowOpacity} colors={colors} />
      ))}

      {(["top", "bottom", "left", "right"] as const).map((position) => (
        <EdgeLight
          key={position}
          position={position}
          glowSize={coneSpread}
          ref={edgeLightRefs[position]}
          colors={colors}
        />
      ))}
    </div>
  );
};

export default BorderGlow;
