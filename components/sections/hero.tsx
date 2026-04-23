import Link from "next/link";

export default function Hero() {
  return (
    <section id="hero" className="min-h-screen bg-[#0a0a0a] flex items-center px-10 pt-[120px] pb-[100px]">
      <div className="mx-auto w-full max-w-[900px]">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-9">
          {["오프라인 학원 원장", "온라인 교육 사업자"].map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/12 px-3.5 py-1.5 text-[12px] font-semibold text-[#C9A84C] before:content-['✓']"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Headline */}
        <h1 className="mb-7 text-[clamp(42px,7vw,80px)] font-black leading-[1.05] tracking-[-0.04em] text-white">
          교육 사업,<br />
          이제 <span className="text-[#C9A84C]">시스템</span>이<br />
          합니다
        </h1>

        {/* Sub */}
        <p className="mb-12 max-w-[600px] text-[clamp(16px,2.2vw,20px)] leading-[1.7] text-white/60">
          오프라인 학원부터 팔로워 10만 온라인 강사까지 — 직접 운영하며 검증한 자동화 시스템을 이식합니다
        </p>

        {/* CTAs */}
        <div className="mb-16 flex flex-wrap items-center gap-5">
          <Link
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full bg-[#C9A84C] px-8 py-4 text-[15px] font-bold text-[#0a0a0a] transition hover:bg-[#e8c96d] hover:-translate-y-px"
          >
            무료 상담 신청 →
          </Link>
          <Link
            href="#pain"
            className="inline-flex items-center gap-2 border-b border-white/30 pb-0.5 text-[15px] font-medium text-white/70 transition hover:text-white"
          >
            자가진단 해보기 ↓
          </Link>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-8">
          {[
            { num: "3년", label: "직접 운영·검증" },
            { num: "15개", label: "검증된 솔루션" },
            { num: "1/10", label: "외주 대비 비용" },
            { num: "8주", label: "구축 완료" },
          ].map(({ num, label }) => (
            <div key={label} className="flex flex-col gap-0.5">
              <span className="text-[clamp(24px,3vw,32px)] font-black leading-none tracking-[-0.03em] text-[#C9A84C]">
                {num}
              </span>
              <span className="text-[12px] text-white/45">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
