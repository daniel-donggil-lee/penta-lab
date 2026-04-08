const STEPS = [
  { n: "01", title: "자가진단", desc: "무료 · 20문항 — 우리 사업의 페인 포인트를 정확히 파악합니다" },
  { n: "02", title: "킥오프 미팅", desc: "2~3시간 · 무료 — 페인 우선순위 확정 + 커스텀 로드맵 설계" },
  { n: "03", title: "8주 구축", desc: "기능 순차 이식 — 가장 급한 것부터 빠르게 도입합니다" },
  { n: "04", title: "월 리테이너", desc: "유지보수 + 개선 — 사업 성장에 맞춰 시스템을 계속 업그레이드" },
];

export default function HowItWorks() {
  return (
    <section id="how" className="px-10 py-[100px]">
      <div className="mx-auto max-w-[900px]">
        <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.14em] text-[#C9A84C]">프로세스</p>
        <h2 className="mb-4 text-[clamp(28px,4vw,44px)] font-black leading-[1.15] tracking-[-0.03em]">4단계로 완성됩니다</h2>
        <p className="mb-14 max-w-[560px] text-[17px] leading-[1.7] text-neutral-500">
          상담 신청부터 시스템 완성까지 8주. 구축 이후에는 월 리테이너로 계속 관리합니다.
        </p>
        <div className="grid grid-cols-4 gap-0 max-sm:grid-cols-2 max-[480px]:grid-cols-1">
          {STEPS.map(({ n, title, desc }) => (
            <div key={n} className="px-4 pb-8 text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#0a0a0a] text-[20px] font-black tracking-[-0.02em] text-[#C9A84C]">
                {n}
              </div>
              <div className="mb-2 text-[15px] font-extrabold tracking-[-0.01em]">{title}</div>
              <div className="text-[13px] leading-relaxed text-neutral-500">{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
