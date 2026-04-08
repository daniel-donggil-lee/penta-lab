import Link from "next/link";

const BENEFITS = [
  { val: "구축비 0원", label: "정가 200만~500만 원 전액 면제" },
  { val: "월 59만", label: "12개월 고정 (정가 99만 대비 40% 할인)" },
  { val: "8주 완성", label: "킥오프 미팅 이후 8주 이내 전달 보장" },
];

const CONDITIONS = ["사례 공개 동의", "3개월 후 추천 1건", "킥오프 2주 내 일정 확정"];

export default function FoundingPartner() {
  return (
    <section id="founding" className="relative overflow-hidden bg-[#0a0a0a] px-10 py-[100px]">
      {/* Glow */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-[400px] w-[400px] rounded-full bg-[#C9A84C]/12 blur-[80px]" />

      <div className="relative mx-auto max-w-[900px]">
        <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.14em] text-[#C9A84C]">파운딩 파트너 오퍼</p>
        <h2 className="mb-4 text-[clamp(28px,4vw,44px)] font-black leading-[1.15] tracking-[-0.03em] text-white">
          지금 신청하면 이 조건으로 시작합니다
        </h2>
        <p className="mb-14 max-w-[560px] text-[17px] leading-[1.7] text-white/50">
          오프라인 학원 원장도, 온라인 교육 사업자도 동일 조건으로 신청 가능합니다.
        </p>

        <div className="relative overflow-hidden rounded-3xl border border-[#C9A84C]/25 bg-[#C9A84C]/6 p-14 max-sm:p-8">
          {/* Top bar */}
          <div className="absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-[#C9A84C] via-[#e8c96d] to-[#C9A84C]" />

          {/* Benefits */}
          <div className="mb-10 grid grid-cols-3 gap-6 text-center max-sm:grid-cols-1">
            {BENEFITS.map(({ val, label }) => (
              <div key={val}>
                <div className="mb-1 text-[clamp(28px,3.5vw,40px)] font-black tracking-[-0.03em] text-[#C9A84C]">{val}</div>
                <div className="text-[13px] leading-snug text-white/50">{label}</div>
              </div>
            ))}
          </div>

          <div className="mb-8 h-px bg-white/8" />

          {/* Conditions */}
          <div className="mb-9 flex flex-wrap gap-3">
            {CONDITIONS.map((c) => (
              <span key={c} className="flex items-center gap-2 rounded-full border border-white/8 bg-white/5 px-5 py-2.5 text-[13px] font-medium text-white/70 before:text-[#C9A84C] before:font-bold before:content-['✓']">
                {c}
              </span>
            ))}
          </div>

          <p className="mb-9 text-[13px] leading-relaxed text-white/45">
            온라인 교육 사업자도 가능합니다. 기수 관리·결제·콘텐츠 파이프라인 세팅까지 팔로워 10만 채널도 동일 조건으로 신청할 수 있습니다.
          </p>

          <div className="flex flex-wrap items-center justify-between gap-5">
            <div className="text-[14px] text-white/50">파운딩 파트너 자리는 한정적으로 운영됩니다</div>
            <span className="rounded-full border border-red-400/30 bg-red-400/15 px-4 py-1.5 text-[13px] font-bold text-red-400">
              ⚡ 현재 2자리 남음
            </span>
          </div>

          <div className="mt-9">
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-[#C9A84C] px-10 py-4.5 text-[16px] font-bold text-[#0a0a0a] transition hover:bg-[#e8c96d] hover:-translate-y-px"
            >
              파운딩 파트너 신청 →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
