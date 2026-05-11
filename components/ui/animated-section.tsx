"use client";
import { useEffect, useRef, useState } from "react";

type Animation = "fade-up" | "fade-in" | "slide-left" | "slide-right" | "scale-in";

interface AnimatedSectionProps {
  animation?: Animation;
  delay?: number;
  duration?: number;
  className?: string;
  children: React.ReactNode;
  as?: "div" | "section" | "span" | "li";
}

const animationStyles: Record<Animation, { from: React.CSSProperties; to: React.CSSProperties }> = {
  "fade-up": {
    from: { opacity: 0, transform: "translateY(32px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
  "fade-in": {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  "slide-left": {
    from: { opacity: 0, transform: "translateX(-40px)" },
    to: { opacity: 1, transform: "translateX(0)" },
  },
  "slide-right": {
    from: { opacity: 0, transform: "translateX(40px)" },
    to: { opacity: 1, transform: "translateX(0)" },
  },
  "scale-in": {
    from: { opacity: 0, transform: "scale(0.85)" },
    to: { opacity: 1, transform: "scale(1)" },
  },
};

export default function AnimatedSection({
  animation = "fade-up",
  delay = 0,
  duration = 600,
  className = "",
  children,
  as: Tag = "div",
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const styles = animationStyles[animation];

  return (
    <Tag
      ref={ref as React.RefObject<never>}
      className={className}
      style={{
        ...(isInView ? styles.to : styles.from),
        transition: `opacity ${duration}ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        willChange: isInView ? "auto" : "opacity, transform",
      }}
    >
      {children}
    </Tag>
  );
}
