"use client";
import { useState } from "react";
import { Building2, BookOpen, Zap } from "lucide-react";
import AnimatedSection from "@/components/ui/animated-section";

const CARDS = [
  {
    Icon: Building2,
    title: "3년간 직접 운영·검증",
    text: "말만 하는 컨설팅이 아닙니다. 지금도 돌아가는 시스템을 그대로 이식합니다. 데모가 곧 레퍼런스.",
    highlights: ["펜타랩", "레퍼런스"],
  },
  {
    Icon: BookOpen,
    title: "이은경 유튜브 15만 · 저서 60권",
    text: "학원 원장과 온라인 교육 사업자 모두가 신뢰하는 채널. 펜타랩은 그 신뢰를 공유합니다.",
    highlights: ["펜타랩", "신뢰"],
  },
  {
    Icon: Zap,
    title: "외주 없이 직접 구축",
    text: "모든 시스템을 외주 없이 직접 만듭니다. 외주 에이전시 거치지 않아 합리적인 비용으로 구축합니다.",
    highlights: ["합리적인 비용"],
  },
];

function TiltCard({ Icon, title, text, highlights, delay }: {
  Icon: typeof Building2; title: string; text: string; highlights: string[]; delay: number;
}) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
    setTilt({ x, y });
  }

  function handleMouseLeave() {
    setTilt({ x: 0, y: 0 });
  }

  let highlighted = text;
  for (const h of highlights) {
    highlighted = highlighted.replace(h, `<strong class="text-[#C9A84C] font-bold">${h}</strong>`);
  }

  return (
    <AnimatedSection animation="fade-up" delay={delay}>
      <div
        className="rounded-[20px] border border-white/8 bg-white/4 p-9 transition-all duration-300 hover:border-[#C9A84C]/40 hover:shadow-lg hover:shadow-[#C9A84C]/5"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(800px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
          transition: "transform 200ms ease-out, border-color 300ms, box-shadow 300ms",
        }}
      >
        <div className="mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-xl bg-[#C9A84C]/10 transition-transform duration-300 group-hover:scale-110">
          <Icon className="h-6 w-6 text-[#C9A84C]" strokeWidth={2} />
        </div>
        <div className="mb-3 text-[18px] font-extrabold leading-snug tracking-[-0.02em] text-white">{title}</div>
        <div
          className="text-[14px] leading-[1.75] text-white/50"
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </div>
    </AnimatedSection>
  );
}

export default function Why() {
  return (
    <section id="why" className="bg-[#0a0a0a] px-10 py-[100px]">
      <div className="mx-auto max-w-[900px]">
        <AnimatedSection>
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.14em] text-[#C9A84C]">Why PentaLab</p>
          <h2 className="mb-4 text-[clamp(28px,4vw,44px)] font-black leading-[1.15] tracking-[-0.03em] text-white">
            우리가 쓰는 걸 팝니다
          </h2>
          <p className="mb-14 max-w-[560px] text-[17px] leading-[1.7] text-white/50">
            직접 운영하며 검증한 시스템입니다. 데모가 곧 레퍼런스입니다.
          </p>
        </AnimatedSection>
        <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1">
          {CARDS.map((card, i) => (
            <TiltCard key={card.title} {...card} delay={i * 120} />
          ))}
        </div>
      </div>
    </section>
  );
}
