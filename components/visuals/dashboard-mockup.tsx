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

function LiveBarChart({ delay }: { delay: number }) {
  const [show, setShow] = useState(false);
  const [bars, setBars] = useState([65, 45, 80, 55, 90, 70, 85]);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!show) return;
    const t = setInterval(() => {
      setBars((prev) => prev.map((v) => {
        const delta = Math.floor(Math.random() * 20) - 10;
        return Math.max(25, Math.min(95, v + delta));
      }));
    }, 2500);
    return () => clearInterval(t);
  }, [show]);

  return (
    <div className="flex items-end gap-[3px] h-[48px]">
      {bars.map((h, i) => (
        <div
          key={i}
          className="w-[6px] rounded-t-sm"
          style={{
            height: show ? `${h}%` : "0%",
            background: i === 4 ? "#C9A84C" : "rgba(255,255,255,0.15)",
            transition: `height 800ms cubic-bezier(0.16,1,0.3,1) ${show ? 0 : i * 80}ms`,
          }}
        />
      ))}
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
    <div className="relative w-[360px] shrink-0 max-lg:hidden">
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
