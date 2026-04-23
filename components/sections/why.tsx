const CARDS = [
  { icon: "🏫", title: "3년간 직접 운영·검증", text: "말만 하는 컨설팅이 아닙니다. 지금도 돌아가는 시스템을 그대로 이식합니다. 데모가 곧 레퍼런스." },
  { icon: "📚", title: "이은경 유튜브 15만 · 저서 60권", text: "학원 원장과 온라인 교육 사업자 모두가 신뢰하는 채널. 펜타랩은 그 신뢰를 공유합니다." },
  { icon: "⚡", title: "외주 없이 직접 구축", text: "모든 시스템을 외주 없이 직접 만듭니다. 외주 시세 대비 1/10 비용으로 동일한 결과물을 납품합니다." },
];

export default function Why() {
  return (
    <section id="why" className="bg-[#0a0a0a] px-10 py-[100px]">
      <div className="mx-auto max-w-[900px]">
        <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.14em] text-[#C9A84C]">Why PentaLab</p>
        <h2 className="mb-4 text-[clamp(28px,4vw,44px)] font-black leading-[1.15] tracking-[-0.03em] text-white">
          우리가 쓰는 걸 팝니다
        </h2>
        <p className="mb-14 max-w-[560px] text-[17px] leading-[1.7] text-white/50">
          직접 운영하며 검증한 시스템입니다. 데모가 곧 레퍼런스입니다.
        </p>
        <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1">
          {CARDS.map(({ icon, title, text }) => (
            <div key={title} className="rounded-[20px] border border-white/8 bg-white/4 p-9 transition hover:border-[#C9A84C]/40">
              <span className="mb-5 block text-[36px]">{icon}</span>
              <div className="mb-3 text-[18px] font-extrabold leading-snug tracking-[-0.02em] text-white">{title}</div>
              <div className="text-[14px] leading-[1.75] text-white/50" dangerouslySetInnerHTML={{ __html: text.replace(/펜타랩|1\/10 비용|신뢰/g, (m) => `<strong class="text-[#C9A84C] font-bold">${m}</strong>`) }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
