"use client";
import { useEffect, useState } from "react";

function MetricCard({ label, value, color, delay }: { label: string; value: string; color: string; delay: number }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className="rounded-lg border border-white/8 bg-white/5 p-3"
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(8px)",
        transition: "all 500ms cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <div className="mb-1 text-[9px] text-white/30">{label}</div>
      <div className="text-[16px] font-black" style={{ color }}>{value}</div>
    </div>
  );
}

function BarChart({ delay }: { delay: number }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const bars = [65, 45, 80, 55, 90, 70, 85];

  return (
    <div className="flex items-end gap-[3px] h-[48px]">
      {bars.map((h, i) => (
        <div
          key={i}
          className="w-[6px] rounded-t-sm"
          style={{
            height: show ? `${h}%` : "0%",
            background: i === 4 ? "#C9A84C" : "rgba(255,255,255,0.15)",
            transition: `height 800ms cubic-bezier(0.16,1,0.3,1) ${i * 80}ms`,
          }}
        />
      ))}
    </div>
  );
}

function TableRows({ delay }: { delay: number }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const rows = [
    { name: "상담 전환율", val: "87%", status: "▲ 12%" },
    { name: "미납률", val: "2.1%", status: "▼ 80%" },
    { name: "학부모 리포트", val: "자동", status: "● 활성" },
  ];

  return (
    <div className="flex flex-col gap-[1px]">
      {rows.map((r, i) => (
        <div
          key={r.name}
          className="flex items-center justify-between rounded px-2 py-1.5 bg-white/3"
          style={{
            opacity: show ? 1 : 0,
            transform: show ? "translateX(0)" : "translateX(12px)",
            transition: `all 500ms cubic-bezier(0.16,1,0.3,1) ${i * 120}ms`,
          }}
        >
          <span className="text-[8px] text-white/40">{r.name}</span>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold text-white/60">{r.val}</span>
            <span className="text-[8px] text-[#C9A84C]">{r.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DashboardMockup() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      const x = (e.clientX / window.innerWidth - 0.5) * 8;
      const y = (e.clientY / window.innerHeight - 0.5) * 5;
      setMousePos({ x, y });
    }
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className="w-[340px] shrink-0 max-lg:hidden"
      style={{
        transform: `perspective(1200px) rotateY(${-8 + mousePos.x}deg) rotateX(${3 + mousePos.y}deg)`,
        transition: "transform 200ms ease-out",
      }}
    >
      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#111111] shadow-2xl shadow-black/50">
        {/* Title bar */}
        <div className="flex items-center gap-1.5 border-b border-white/6 px-3 py-2">
          <div className="h-[7px] w-[7px] rounded-full bg-[#ff5f57]" />
          <div className="h-[7px] w-[7px] rounded-full bg-[#febc2e]" />
          <div className="h-[7px] w-[7px] rounded-full bg-[#28c840]" />
          <span className="ml-2 text-[8px] text-white/25">PENTALAB Dashboard</span>
        </div>

        <div className="space-y-3 p-3">
          {/* Metrics */}
          <div className="grid grid-cols-3 gap-2">
            <MetricCard label="원생 수" value="152" color="#C9A84C" delay={1400} />
            <MetricCard label="상담 전환" value="87%" color="#28c840" delay={1600} />
            <MetricCard label="미납률" value="2.1%" color="#ff5f57" delay={1800} />
          </div>

          {/* Chart */}
          <div className="rounded-lg border border-white/6 bg-white/3 p-3">
            <div className="mb-2 text-[8px] text-white/25">주간 문의 현황</div>
            <BarChart delay={2000} />
          </div>

          {/* Table */}
          <div className="rounded-lg border border-white/6 bg-white/3 p-2">
            <div className="mb-1.5 text-[8px] text-white/25">핵심 지표</div>
            <TableRows delay={2200} />
          </div>
        </div>
      </div>
    </div>
  );
}
