"use client";
import { useEffect, useState } from "react";

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

interface UseCountUpOptions {
  end: number;
  start?: number;
  duration?: number;
  enabled?: boolean;
  decimals?: number;
}

export function useCountUp({
  end,
  start = 0,
  duration = 2000,
  enabled = false,
  decimals = 0,
}: UseCountUpOptions): number {
  const [value, setValue] = useState(start);

  useEffect(() => {
    if (!enabled) return;

    let startTime: number | null = null;
    let rafId: number;

    function tick(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const current = start + (end - start) * eased;

      setValue(Number(current.toFixed(decimals)));

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [enabled, end, start, duration, decimals]);

  return value;
}
