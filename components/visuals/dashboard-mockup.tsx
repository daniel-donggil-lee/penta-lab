"use client";
import { useEffect, useState, useCallback } from "react";

function useLoopValue(values: number[], interval: number, enabled: boolean) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % values.length), interval);
    return () => clearInterval(t);
  }, [enabled, values.length, interval]);
  return values[index];
}

function MetricCard({ label, values, color, delay, suffix = "" }: {
  label: string; values: number[]; color: string; delay: number; suffix?: string;
}) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const current = useLoopValue(values, 3000, show);
  const [displayed, setDisplayed] = useState(values[0]);

  useEffect(() => {
    if (!show) return;
    const start = displayed;
    const end = current;
    const duration = 800;
    let startTime: number | null = null;
    let raf: number;
    function tick(ts: number) {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplayed(Math.round(start + (end - start) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [current, show]);

  return (
    <div
      className="rounded-lg border border-white/8 bg-white/5 p-3 transition-all duration-500"
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(8px)",
      }}
    >
      <div className="mb-1 text-[9px] text-white/30">{label}</div>
      <div className="flex items-baseline gap-0.5">
        <span className="text-[16px] font-black transition-all duration-300" style={{ color }}>{displayed}{suffix}</span>
        <span className="text-[8px] text-green-400">▲</span>
      </div>
    </div>
  );
}

const DAYS = ["월", "화", "수", "목", "금", "토", "일"];
const BAR_H = 56; // px, chart height for SVG

function LiveBarChart({ delay }: { delay: number }) {
  const [show, setShow] = useState(false);
  const [bars, setBars] = useState([65, 45, 80, 55, 90, 70, 85]);
  const [flashed, setFlashed] = useState<number | null>(null);
  const [count, setCount] = useState(28);
  const [tick, setTick] = useState(0); // forces SVG path re-render key

  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  // Fast bar updates every 900ms — one random bar changes at a time
  useEffect(() => {
    if (!show) return;
    const t = setInterval(() => {
      const idx = Math.floor(Math.random() * 7);
      setBars((prev) => {
        const next = [...prev];
        const delta = Math.floor(Math.random() * 28) - 10;
        next[idx] = Math.max(22, Math.min(95, next[idx] + delta));
        return next;
      });
      setFlashed(idx);
      setTick((v) => v + 1);
      setTimeout(() => setFlashed(null), 350);
    }, 900);
    return () => clearInterval(t);
  }, [show]);

  // Count ticks up every ~4s
  useEffect(() => {
    if (!show) return;
    const t = setInterval(() => setCount((c) => c + 1), 4200);
    return () => clearInterval(t);
  }, [show]);

  const avg = Math.round(bars.reduce((a, b) => a + b, 0) / bars.length);
  const maxIdx = bars.indexOf(Math.max(...bars));

  // SVG polyline points — connect bar tops
  // Each bar slot = 100/7 % wide; center at slot midpoint
  const W = 100; // viewBox width units
  const slotW = W / 7;
  const points = bars
    .map((h, i) => `${(i + 0.5) * slotW},${BAR_H - (h / 100) * BAR_H}`)
    .join(" ");

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[7px] text-white/20">오늘 총</span>
        <span
          className="text-[9px] font-bold text-[#C9A84C]"
          style={{ transition: "all 300ms" }}
        >
          {count}건
        </span>
      </div>

      {/* Chart area — bars + SVG sparkline overlay */}
      <div className="relative" style={{ height: BAR_H }}>
        {/* Average dashed line */}
        <div
          className="pointer-events-none absolute left-0 right-0 border-t border-dashed border-white/10"
          style={{ top: `${100 - avg}%`, transition: "top 700ms ease" }}
        >
          <span className="absolute right-0 -top-3 text-[6px] text-white/20">avg</span>
        </div>

        {/* Bars */}
        <div className="absolute inset-0 flex items-end gap-1">
          {bars.map((h, i) => (
            <div key={i} className="relative flex flex-1 flex-col items-center justify-end" style={{ height: "100%" }}>
              <div
                className="w-full rounded-t-sm"
                style={{
                  height: show ? `${h}%` : "0%",
                  background:
                    i === maxIdx
                      ? "linear-gradient(to top, #C9A84C, #e8c96d)"
                      : flashed === i
                      ? "rgba(201,168,76,0.55)"
                      : "rgba(255,255,255,0.11)",
                  transition: "height 500ms cubic-bezier(0.16,1,0.3,1), background 300ms",
                  boxShadow: i === maxIdx ? "0 0 10px rgba(201,168,76,0.5)" : "none",
                }}
              />
            </div>
          ))}
        </div>

        {/* SVG sparkline overlay */}
        {show && (
          <svg
            key={tick}
            viewBox={`0 0 ${W} ${BAR_H}`}
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full"
          >
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#C9A84C" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            <polyline
              points={points}
              fill="none"
              stroke="url(#lineGrad)"
              strokeWidth="1.2"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeDasharray="200"
              strokeDashoffset="200"
              style={{ animation: "drawLine 600ms cubic-bezier(0.16,1,0.3,1) forwards" }}
            />
            {/* Dot on highest bar */}
            <circle
              cx={(maxIdx + 0.5) * slotW}
              cy={BAR_H - (bars[maxIdx] / 100) * BAR_H}
              r="2"
              fill="#C9A84C"
              style={{ animation: "glowPulse 1.5s ease-in-out infinite" }}
            />
          </svg>
        )}
      </div>

      {/* Day labels */}
      <div className="mt-1 flex gap-1">
        {DAYS.map((d, i) => (
          <div
            key={d}
            className="flex-1 text-center text-[7px] transition-colors duration-300"
            style={{ color: i === maxIdx ? "#C9A84C" : "rgba(255,255,255,0.18)" }}
          >
            {d}
          </div>
        ))}
      </div>
    </div>
  );
}

function LiveNotification({ delay }: { delay: number }) {
  const notifications = [
    { icon: "💬", text: "새 상담 문의 접수", time: "방금 전" },
    { icon: "✅", text: "학부모 리포트 발송 완료", time: "2분 전" },
    { icon: "💰", text: "4월 수업료 자동 청구", time: "5분 전" },
    { icon: "📊", text: "주간 분석 리포트 생성", time: "10분 전" },
  ];

  const [show, setShow] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!show) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % notifications.length), 3500);
    return () => clearInterval(t);
  }, [show, notifications.length]);

  const notif = notifications[index];

  return (
    <div
      className="overflow-hidden rounded-lg border border-white/8 bg-white/5 p-2.5 transition-all duration-500"
      style={{ opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(8px)" }}
    >
      <div className="mb-1 text-[8px] text-white/25">실시간 알림</div>
      <div
        key={index}
        className="flex items-center gap-2"
        style={{ animation: "surveySlideRight 0.3s cubic-bezier(0.2,0,0.2,1) both" }}
      >
        <span className="text-[12px]">{notif.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="text-[9px] font-semibold text-white/70 truncate">{notif.text}</div>
          <div className="text-[7px] text-white/30">{notif.time}</div>
        </div>
        <div className="h-1.5 w-1.5 rounded-full bg-[#C9A84C] shrink-0" style={{ animation: "glowPulse 2s ease-in-out infinite" }} />
      </div>
    </div>
  );
}

function ProgressRing({ delay }: { delay: number }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const circumference = 2 * Math.PI * 18;

  return (
    <div
      className="flex items-center gap-3 rounded-lg border border-white/8 bg-white/5 p-2.5 transition-all duration-500"
      style={{ opacity: show ? 1 : 0, transform: show ? "translateX(0)" : "translateX(12px)" }}
    >
      <svg width="44" height="44" className="shrink-0 -rotate-90">
        <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
        <circle cx="22" cy="22" r="18" fill="none" stroke="#C9A84C" strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={show ? circumference * 0.13 : circumference}
          style={{ transition: "stroke-dashoffset 1500ms cubic-bezier(0.16,1,0.3,1) 300ms" }}
        />
        <text x="22" y="22" textAnchor="middle" dominantBaseline="central"
          className="fill-white/70 text-[9px] font-bold" style={{ transform: "rotate(90deg)", transformOrigin: "22px 22px" }}>
          87%
        </text>
      </svg>
      <div>
        <div className="text-[9px] font-semibold text-white/60">상담 전환율</div>
        <div className="text-[8px] text-[#C9A84C]">▲ 12% vs 지난달</div>
      </div>
    </div>
  );
}

export default function DashboardMockup() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 10;
    const y = (e.clientY / window.innerHeight - 0.5) * 6;
    setMousePos({ x, y });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return (
    <div className="relative w-[520px] shrink-0 max-lg:hidden">
      {/* Glow behind */}
      <div className="absolute -inset-8 rounded-3xl bg-[#C9A84C]/6 blur-[40px] glow-pulse" />

      <div
        className="relative"
        style={{
          transform: `perspective(1200px) rotateY(${-8 + mousePos.x}deg) rotateX(${3 + mousePos.y}deg)`,
          transition: "transform 150ms ease-out",
        }}
      >
        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#111111] shadow-2xl shadow-black/50">
          {/* Title bar */}
          <div className="flex items-center gap-1.5 border-b border-white/6 px-3 py-2">
            <div className="h-[7px] w-[7px] rounded-full bg-[#ff5f57]" />
            <div className="h-[7px] w-[7px] rounded-full bg-[#febc2e]" />
            <div className="h-[7px] w-[7px] rounded-full bg-[#28c840]" />
            <span className="ml-2 text-[8px] text-white/25">PENTALAB Dashboard</span>
            <div className="ml-auto h-1 w-1 rounded-full bg-green-400" style={{ animation: "glowPulse 2s ease-in-out infinite" }} />
          </div>

          <div className="space-y-2.5 p-3">
            {/* Metrics - live updating */}
            <div className="grid grid-cols-3 gap-2">
              <MetricCard label="원생 수" values={[148, 150, 152, 153, 152]} color="#C9A84C" delay={1400} suffix="명" />
              <MetricCard label="상담 전환" values={[85, 87, 89, 87, 88]} color="#28c840" delay={1600} suffix="%" />
              <MetricCard label="미납률" values={[3, 2, 2, 1, 2]} color="#ff5f57" delay={1800} suffix="%" />
            </div>

            {/* Chart - bars animate */}
            <div className="rounded-lg border border-white/6 bg-white/3 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[8px] text-white/25">주간 문의 현황</span>
                <span className="text-[7px] text-[#C9A84C]">실시간</span>
              </div>
              <LiveBarChart delay={2000} />
            </div>

            {/* Bottom row: ring + notification */}
            <div className="grid grid-cols-2 gap-2">
              <ProgressRing delay={2200} />
              <LiveNotification delay={2400} />
            </div>
          </div>
        </div>
      </div>

      {/* Floating badge - top right */}
      <div
        className="absolute -right-4 -top-3 rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 shadow-lg float-gentle"
        style={{ animationDelay: "1s" }}
      >
        <div className="text-[8px] text-white/30">오늘 신규</div>
        <div className="text-[14px] font-black text-[#C9A84C]">+3명</div>
      </div>

      {/* Floating badge - bottom left */}
      <div
        className="absolute -bottom-2 -left-6 rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 shadow-lg float-gentle"
        style={{ animationDelay: "2.5s" }}
      >
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
          <span className="text-[8px] text-white/40">시스템 정상 운영</span>
        </div>
      </div>
    </div>
  );
}
