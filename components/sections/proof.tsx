const METRICS = [
  { before: "문의 응답 시간 평균 8시간", after: "5", unit: "분", context: "카톡 자동 응답 도입 후 심야 문의도 즉시 대응" },
  { before: "학부모 리포트 월 8시간 수작업", after: "0", unit: "시간", context: "자동 생성으로 전환 후 원장 시간 월 8시간 회수" },
  { before: "매달 전화 독촉 → 관계 어색", after: "자동", unit: "문자", context: "미납 감지 즉시 발송 — 원장이 직접 연락할 필요 없음" },
];

export default function Proof() {
  return (
    <section id="proof" className="bg-neutral-50 px-10 py-[100px]">
      <div className="mx-auto max-w-[900px]">
        <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.14em] text-[#C9A84C]">실제 데이터</p>
        <h2 className="mb-4 text-[clamp(28px,4vw,44px)] font-black leading-[1.15] tracking-[-0.03em]">
          직접 도입하고 측정했습니다
        </h2>
        <p className="mb-14 max-w-[560px] text-[17px] leading-[1.7] text-neutral-500">
          말로만 하는 컨설팅이 아닙니다. 아래 수치는 직접 운영한 학원에서 측정한 실제 데이터입니다.
        </p>

        <div className="mb-12 grid grid-cols-3 gap-6 max-md:grid-cols-1">
          {METRICS.map(({ before, after, unit, context }) => (
            <div key={unit} className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-9 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-gradient-to-r after:from-[#C9A84C] after:to-[#e8c96d]">
              <div className="mb-1 text-[13px] font-medium text-neutral-400 line-through">{before}</div>
              <div className="my-2 text-[20px] text-neutral-400">↓</div>
              <div className="mb-2 text-[clamp(28px,3.5vw,40px)] font-black leading-none tracking-[-0.03em]">
                <span className="text-[#C9A84C]">{after}</span>{unit}
              </div>
              <div className="text-[13px] leading-relaxed text-neutral-500">{context}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-7 py-5">
          <div className="h-2 w-2 shrink-0 rounded-full bg-[#C9A84C]" />
          <p className="text-[14px] leading-relaxed text-neutral-600">
            <strong className="text-[#0a0a0a]">경기도 소재 영어·국어 통합학원 (원생 150명+) — 3년 직접 운영·측정</strong>
            {" · "}동일 시스템을 지금도 운영 중입니다. 상담 신청 시 실제 화면 데모로 확인 가능합니다.
          </p>
        </div>
      </div>
    </section>
  );
}
