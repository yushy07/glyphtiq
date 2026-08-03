"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { gsap } from "gsap";
import "./MagicBento.css";

const MOBILE_BREAKPOINT = 768;

export interface MagicBentoCard {
  color: string;
  title: string;
  description: string;
  label: string;
}

const DEFAULT_CARDS: MagicBentoCard[] = [
  {
    color: "var(--surface)",
    title: "100% local",
    description: "Conversion happens right in your browser.",
    label: "Privacy",
  },
  {
    color: "var(--surface)",
    title: "100+ styles",
    description: "Bold, gothic, bubble, zalgo and more.",
    label: "Variety",
  },
  {
    color: "var(--surface)",
    title: "Short links",
    description: "Share any result with a tiny link.",
    label: "Sharing",
  },
  {
    color: "var(--surface)",
    title: "Keyboard-first",
    description: "Shortcuts and arrow-key navigation.",
    label: "Speed",
  },
  {
    color: "var(--surface)",
    title: "Favorites",
    description: "Pinned styles saved to your browser.",
    label: "Personal",
  },
  {
    color: "var(--surface)",
    title: "PNG download",
    description: "Turn any style into an image.",
    label: "Export",
  },
];

interface ParticleCardProps {
  children: ReactNode;
  className: string;
  style: CSSProperties;
  disableAnimations: boolean;
  enableTilt: boolean;
  enableMagnetism: boolean;
  clickEffect: boolean;
  glowColor: string;
  particleCount: number;
}

const createParticleElement = (size: number): HTMLDivElement => {
  const particle = document.createElement("div");
  particle.className = "particle";
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  particle.style.borderRadius = "50%";
  particle.style.position = "absolute";
  return particle;
};

const ParticleCard = ({
  children,
  className,
  style,
  disableAnimations,
  enableTilt,
  enableMagnetism,
  clickEffect,
  glowColor,
  particleCount,
}: ParticleCardProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const timeoutsRef = useRef<number[]>([]);
  const tiltRef = useRef<{ rx: number; ry: number; raf?: number }>({ rx: 0, ry: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el || disableAnimations) return;

    const generateParticles = () => {
      particlesRef.current.forEach((p) => p.remove());
      particlesRef.current = [];

      for (let i = 0; i < particleCount; i++) {
        const size = 2 + Math.random() * 3;
        const particle = createParticleElement(size);
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.opacity = "0";
        particle.style.transform = "scale(0)";
        particle.style.transition = "transform 0.4s ease, opacity 0.4s ease";
        el.appendChild(particle);
        particlesRef.current.push(particle);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      particlesRef.current.forEach((particle) => {
        const px = parseFloat(particle.style.left);
        const py = parseFloat(particle.style.top);
        const dx = mouseX - (rect.width * px) / 100;
        const dy = mouseY - (rect.height * py) / 100;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = rect.width * 0.3;

        if (distance < maxDistance) {
          particle.style.transform = `scale(1.4) translate(${dx * 0.1}px, ${dy * 0.1}px)`;
          particle.style.opacity = "0.6";
        } else {
          particle.style.transform = "scale(1) translate(0, 0)";
          particle.style.opacity = "0.1";
        }
      });
    };

    const handleMouseLeave = () => {
      particlesRef.current.forEach((particle) => {
        particle.style.transform = "scale(0)";
        particle.style.opacity = "0";
      });
    };

    const handleMouseEnter = () => {
      particlesRef.current.forEach((particle) => {
        particle.style.opacity = "0.2";
        particle.style.transform = "scale(1)";
      });
    };

    let tiltCleanup: (() => void) | undefined;
    const animateTilt = () => {
      const rect = el.getBoundingClientRect();
      const handleMove = (e: MouseEvent) => {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        tiltRef.current.rx = (0.5 - y / rect.height) * 10;
        tiltRef.current.ry = (x / rect.width - 0.5) * 10;
      };
      const step = () => {
        gsap.to(el, {
          rotationX: tiltRef.current.rx,
          rotationY: tiltRef.current.ry,
          transformPerspective: 600,
          duration: 0.4,
          overwrite: true,
        });
        tiltRef.current.raf = requestAnimationFrame(step);
      };
      el.addEventListener("mousemove", handleMove);
      tiltRef.current.raf = requestAnimationFrame(step);
      return () => {
        el.removeEventListener("mousemove", handleMove);
        if (tiltRef.current.raf) cancelAnimationFrame(tiltRef.current.raf);
      };
    };

    const handleMagneticMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const mx = e.clientX - rect.left - rect.width / 2;
      const my = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, { x: mx * 0.3, y: my * 0.3, duration: 0.3, ease: "power2.out" });
    };

    const handleMagneticLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.5)" });
    };

    const handleClick = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const ripple = document.createElement("span");
      ripple.className = "magic-ripple";
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.width = "30px";
      ripple.style.height = "30px";
      el.appendChild(ripple);

      const timeout = window.setTimeout(() => ripple.remove(), 600);
      timeoutsRef.current.push(timeout);
    };

    generateParticles();
    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);
    if (enableTilt) tiltCleanup = animateTilt();
    if (enableMagnetism) {
      el.addEventListener("mousemove", handleMagneticMove);
      el.addEventListener("mouseleave", handleMagneticLeave);
    }
    if (clickEffect) el.addEventListener("click", handleClick);

    return () => {
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
      tiltCleanup?.();
      if (enableMagnetism) {
        el.removeEventListener("mousemove", handleMagneticMove);
        el.removeEventListener("mouseleave", handleMagneticLeave);
      }
      if (clickEffect) el.removeEventListener("click", handleClick);
      timeoutsRef.current.forEach((t) => clearTimeout(t));
      timeoutsRef.current = [];
      particlesRef.current.forEach((p) => p.remove());
      particlesRef.current = [];
    };
  }, [disableAnimations, enableTilt, enableMagnetism, clickEffect, glowColor, particleCount]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ position: "relative", overflow: "hidden", ...style, "--glow-color": glowColor } as CSSProperties}
    >
      {children}
    </div>
  );
};

interface StaticCardProps {
  children: ReactNode;
  className: string;
  style: CSSProperties;
  disableAnimations: boolean;
  enableTilt: boolean;
  enableMagnetism: boolean;
  clickEffect: boolean;
  glowColor: string;
}

const StaticCard = ({
  children,
  className,
  style,
  disableAnimations,
  enableTilt,
  enableMagnetism,
  clickEffect,
  glowColor,
}: StaticCardProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const timeoutsRef = useRef<number[]>([]);

  useEffect(() => {
    const el = ref.current;
    if (!el || disableAnimations) return;

    const handleMagneticMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const mx = e.clientX - rect.left - rect.width / 2;
      const my = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, { x: mx * 0.3, y: my * 0.3, duration: 0.3, ease: "power2.out" });
    };

    const handleMagneticLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.5)" });
    };

    const handleTiltMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      gsap.to(el, {
        rotationX: (0.5 - y / rect.height) * 10,
        rotationY: (x / rect.width - 0.5) * 10,
        transformPerspective: 600,
        duration: 0.4,
        overwrite: true,
      });
    };

    const handleTiltLeave = () => {
      gsap.to(el, { rotationX: 0, rotationY: 0, duration: 0.5 });
    };

    const handleClick = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const ripple = document.createElement("span");
      ripple.className = "magic-ripple";
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.width = "30px";
      ripple.style.height = "30px";
      el.appendChild(ripple);
      const timeout = window.setTimeout(() => ripple.remove(), 600);
      timeoutsRef.current.push(timeout);
    };

    if (enableTilt) {
      el.addEventListener("mousemove", handleTiltMove);
      el.addEventListener("mouseleave", handleTiltLeave);
    }
    if (enableMagnetism) {
      el.addEventListener("mousemove", handleMagneticMove);
      el.addEventListener("mouseleave", handleMagneticLeave);
    }
    if (clickEffect) el.addEventListener("click", handleClick);

    return () => {
      el.removeEventListener("mousemove", handleTiltMove);
      el.removeEventListener("mouseleave", handleTiltLeave);
      el.removeEventListener("mousemove", handleMagneticMove);
      el.removeEventListener("mouseleave", handleMagneticLeave);
      el.removeEventListener("click", handleClick);
      timeoutsRef.current.forEach((t) => clearTimeout(t));
      timeoutsRef.current = [];
    };
  }, [disableAnimations, enableTilt, enableMagnetism, clickEffect, glowColor]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ position: "relative", overflow: "hidden", ...style, "--glow-color": glowColor } as CSSProperties}
    >
      {children}
    </div>
  );
};

interface GlobalSpotlightProps {
  children: ReactNode;
  gridRef: RefObject<HTMLDivElement | null>;
  radius: number;
  glowColor: string;
}

const GlobalSpotlight = ({ children, gridRef, radius, glowColor }: GlobalSpotlightProps) => {
  const spotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const spot = spotRef.current;
    const grid = gridRef.current;
    if (!spot || !grid) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = grid.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;

      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        spot.style.opacity = "1";
        spot.style.transform = `translate(${x - rect.left - radius}px, ${y - rect.top - radius}px)`;
      } else {
        spot.style.opacity = "0";
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [gridRef, radius]);

  return (
    <>
      <div
        ref={spotRef}
        className="global-spotlight"
        style={
          {
            width: `${radius * 2}px`,
            height: `${radius * 2}px`,
            borderRadius: "50%",
            background: `radial-gradient(circle at center, rgba(${glowColor}, 0.09), transparent 70%)`,
            opacity: 0,
            transition: "opacity 0.3s ease",
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
            zIndex: 0,
          } as CSSProperties
        }
      />
      {children}
    </>
  );
};

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile;
};

interface BentoCardGridProps {
  children: ReactNode;
  gridRef: RefObject<HTMLDivElement | null>;
  className?: string;
}

const BentoCardGrid = ({ children, gridRef, className = "" }: BentoCardGridProps) => {
  return (
    <div className={`card-grid bento-section ${className}`} ref={gridRef}>
      {children}
    </div>
  );
};

export interface MagicBentoProps {
  textAutoHide?: boolean;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  disableAnimations?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  enableTilt?: boolean;
  glowColor?: string;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
  cards?: MagicBentoCard[];
  className?: string;
}

const MagicBento = ({
  textAutoHide = true,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = 500,
  particleCount = 12,
  enableTilt = false,
  glowColor = "139, 92, 246",
  clickEffect = true,
  enableMagnetism = false,
  cards = DEFAULT_CARDS,
  className = "",
}: MagicBentoProps) => {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useMobileDetection();
  const autoHide = isMobile && textAutoHide;

  useEffect(() => {
    gridRef.current?.querySelectorAll(".magic-bento-card").forEach((card) => {
      card.setAttribute("data-visible", "true");
      card.setAttribute("data-visible-mobile", "true");
    });
  }, []);

  return (
    <BentoCardGrid gridRef={gridRef} className={className}>
      {cards.map((card, index) => {
        const cardProps: {
          className: string;
          style: Record<string, string>;
        } = {
          className: `magic-bento-card magic-bento-card-${index}`,
          style: {
            backgroundColor: card.color,
            "--glow-color": glowColor,
          },
        };

        const cardContent = (
          <div className={`magic-bento-card__content ${autoHide ? "auto-hide" : ""}`}>
            <p className="magic-bento-card__label">{card.label}</p>
            <h3 className="magic-bento-card__title">{card.title}</h3>
            <p className="magic-bento-card__description">{card.description}</p>
          </div>
        );

        if (enableStars) {
          return (
            <ParticleCard
              key={index}
              className={cardProps.className}
              style={cardProps.style as CSSProperties}
              disableAnimations={disableAnimations || autoHide}
              enableTilt={enableTilt && !disableAnimations}
              enableMagnetism={enableMagnetism && !disableAnimations}
              clickEffect={clickEffect && !disableAnimations}
              glowColor={glowColor}
              particleCount={particleCount}
            >
              {cardContent}
            </ParticleCard>
          );
        }

        return (
          <StaticCard
            key={index}
            className={cardProps.className}
            style={cardProps.style as CSSProperties}
            disableAnimations={disableAnimations || autoHide}
            enableTilt={enableTilt && !disableAnimations}
            enableMagnetism={enableMagnetism && !disableAnimations}
            clickEffect={clickEffect && !disableAnimations}
            glowColor={glowColor}
          >
            {cardContent}
          </StaticCard>
        );
      })}

      {enableSpotlight && !isMobile && (
        <GlobalSpotlight gridRef={gridRef} radius={spotlightRadius} glowColor={glowColor}>
          {null}
        </GlobalSpotlight>
      )}

      {enableBorderGlow && (
        <div className="bento-border-glow-container" aria-hidden>
          {cards.map((_, index) => (
            <div key={index} className="bento-border-glow">
              <div className="bento-border-glow-inner" />
            </div>
          ))}
        </div>
      )}
    </BentoCardGrid>
  );
};

export default MagicBento;
