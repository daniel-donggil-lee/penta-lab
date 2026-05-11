"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useCountUp } from "@/hooks/use-count-up";
import DashboardMockup from "@/components/visuals/dashboard-mockup";

function CountBadge({ end, suffix, label, delay }: { end: number; suffix: string; label: string; delay: number }) {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setEnabled(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  const value = useCountUp({ end, duration: 1800, enabled });

  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[clamp(24px,3vw,32px)] font-black leading-none tracking-[-0.03em] text-[#C9A84C]">
        {value}{suffix}
      </span>
      <span className="text-[12px] text-white/45">{label}</span>
    </div>
  );
}

export default function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    requestAnimationFrame(() => setLoaded(true));
  }, []);

  const seq = (ms: number) => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 700ms cubic-bezier(0.16,1,0.3,1) ${ms}ms, transform 700ms cubic-bezier(0.16,1,0.3,1) ${ms}ms`,
  });

  return (
    <section id="hero" className="relative overflow-hidden bg-[#0a0a0a] px-10 pt-[120px] pb-[60px]">
      {/* Animated gradient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -left-[200px] -top-[100px] h-[600px] w-[600px] rounded-full bg-[#C9A84C]/8 blur-[120px]"
          style={{ animation: "gradientMove 20s ease-in-out infinite" }}
        />
        <div
          className="absolute -right-[150px] top-[200px] h-[500px] w-[500px] rounded-full bg-[#C9A84C]/5 blur-[100px]"
          style={{ animation: "gradientMove 25s ease-in-out infinite reverse" }}
        />
        <div
          className="absolute bottom-[-100px] left-[30%] h-[400px] w-[400px] rounded-full bg-[#C9A84C]/4 blur-[80px]"
          style={{ animation: "gradientMove 18s ease-in-out infinite 5s" }}
        />
        {/* Dot grid */}
        <svg className="absolute inset-0 h-full w-full opacity-[0.04]">
          <defs>
            <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.8" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative mx-auto flex w-full max-w-[1100px] items-center gap-12">
        {/* Left text */}
        <div className="flex-1">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-9" style={seq(100)}>
            {["오프라인 학원", "온라인 교육 사업자", "프랜차이즈", "크리에이터"].map((t, i) => (
              <span
                key={t}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/12 px-3.5 py-1.5 text-[12px] font-semibold text-[#C9A84C] before:content-['✓']"
                style={{
                  opacity: loaded ? 1 : 0,
                  transform: loaded ? "translateX(0)" : "translateX(16px)",
                  transition: `all 500ms cubic-bezier(0.16,1,0.3,1) ${200 + i * 120}ms`,
                }}
              >
                {t}
              </span>
            ))}
          </div>

          {/* Headline */}
          <h1 className="mb-7 text-[clamp(42px,7vw,72px)] font-black leading-[1.05] tracking-[-0.04em] text-white">
            <span style={seq(300)}>교육 사업,</span>
            <br />
            <span style={seq(500)}>
              이제 <span className="shimmer-gold">시스템</span>이
            </span>
            <br />
            <span style={seq(700)}>합니다</span>
          </h1>

          {/* Sub */}
          <p className="mb-12 max-w-[600px] text-[clamp(16px,2.2vw,20px)] leading-[1.7] text-white/60" style={seq(900)}>
            학원·온라인 강의·프랜차이즈·크리에이터 — 직접 운영하며 검증한 자동화 시스템을 이식합니다
          </p>

          {/* CTAs */}
          <div className="mb-16 flex flex-wrap items-center gap-5" style={seq(1100)}>
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-[#C9A84C] px-8 py-4 text-[15px] font-bold text-[#0a0a0a] transition-all duration-300 hover:bg-[#e8c96d] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#C9A84C]/20"
            >
              무료 상담 신청 →
            </Link>
            <Link
              href="/survey"
              className="inline-flex items-center gap-2 border-b border-white/30 pb-0.5 text-[15px] font-medium text-white/70 transition hover:text-white"
            >
              자가진단 해보기 →
            </Link>
          </div>

          {/* Badges with count-up */}
          <div className="flex flex-wrap gap-8" style={seq(1300)}>
            <CountBadge end={3} suffix="년" label="직접 운영·검증" delay={1500} />
            <CountBadge end={7} suffix="개" label="검증된 솔루션" delay={1700} />
            <CountBadge end={150} suffix="+" label="운영 중 원생 수" delay={1900} />
          </div>
        </div>

        {/* Right dashboard mockup */}
        <DashboardMockup />
      </div>

      {/* Bottom trust bar */}
      <div className="relative mx-auto mt-16 max-w-[1100px]" style={seq(1800)}>
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-[13px] text-white/30">
          <span>카카오 알림톡 연동</span>
          <span className="text-white/10">·</span>
          <span>Google Workspace 자동화</span>
          <span className="text-white/10">·</span>
          <span>Solapi 메시징</span>
          <span className="text-white/10">·</span>
          <span>Vercel 호스팅</span>
          <span className="text-white/10">·</span>
          <span>Supabase 데이터</span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="relative flex justify-center mt-10" style={seq(2200)}>
        <div className="flex flex-col items-center gap-2">
          <span className="text-[11px] text-white/20">스크롤</span>
          <div className="h-8 w-[1px] bg-gradient-to-b from-white/20 to-transparent" style={{ animation: "bounceDown 2s ease-in-out infinite" }} />
        </div>
      </div>
    </section>
  );
}
