"use client";
import Link from "next/link";
import AnimatedSection from "@/components/ui/animated-section";

const SOLUTIONS = [
  {
    category: "운영 자동화",
    items: [
      { title: "학부모 리포트 자동 생성", desc: "수업 데이터 기반으로 주간/월간 리포트를 자동 생성하고 카톡으로 발송합니다" },
      { title: "미납 자동 감지 + 알림", desc: "미납 학생을 자동 감지하고, 원장이 직접 연락하지 않아도 알림이 발송됩니다" },
      { title: "학생 CRM 구축", desc: "학생 정보, 상담 이력, 수업 이력을 한 곳에서 관리합니다" },
      { title: "알림톡 / 친구톡 자동 발송", desc: "수업 알림, 공지사항, 리포트를 카카오톡으로 자동 발송합니다" },
    ],
  },
  {
    category: "콘텐츠 자동화",
    items: [
      { title: "시험지 / 교재 자동 생성", desc: "학교별·단원별 맞춤 교재와 모의고사를 자동으로 생성합니다" },
      { title: "홈페이지 구축", desc: "학원 브랜드에 맞는 홈페이지를 직접 설계하고 구축합니다" },
      { title: "학원비 청구 자동화", desc: "월별 청구서를 자동 생성하고 학부모에게 발송합니다" },
    ],
  },
];

export default function Services() {
  return (
    <section id="services" className="px-10 py-[100px]">
      <div className="mx-auto max-w-[900px]">
        <AnimatedSection>
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.14em] text-[#C9A84C]">솔루션</p>
          <h2 className="mb-4 text-[clamp(28px,4vw,44px)] font-black leading-[1.15] tracking-[-0.03em]">
            직접 운영하며 검증한 솔루션
          </h2>
          <p className="mb-14 max-w-[560px] text-[17px] leading-[1.7] text-neutral-500">
            아래는 실제 학원에서 3년간 운영하며 검증한 핵심 솔루션입니다. 상담을 통해 가장 필요한 것부터 맞춤 제안드립니다.
          </p>
        </AnimatedSection>

        <div className="space-y-10">
          {SOLUTIONS.map((group, gi) => (
            <AnimatedSection key={group.category} animation="fade-up" delay={gi * 150}>
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <span className="rounded-full bg-[#C9A84C]/12 px-3.5 py-1.5 text-[11px] font-bold tracking-[0.06em] text-[#C9A84C]">
                    {group.category}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                  {group.items.map((item, i) => (
                    <AnimatedSection key={item.title} animation="fade-up" delay={gi * 150 + i * 80}>
                      <div className="group rounded-2xl border border-neutral-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#C9A84C] hover:shadow-lg hover:shadow-[#C9A84C]/5">
                        <div className="mb-2 flex items-start gap-2">
                          <span className="mt-0.5 shrink-0 text-[#C9A84C] font-bold">✓</span>
                          <div className="text-[16px] font-bold leading-snug text-[#0a0a0a]">{item.title}</div>
                        </div>
                        <div className="ml-5 text-[13px] leading-relaxed text-neutral-500">{item.desc}</div>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection animation="fade-up" delay={400}>
          <div className="mt-12 flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-[#0a0a0a] px-9 py-8">
            <div>
              <p className="mb-1 text-[16px] font-bold text-white">어디서부터 시작해야 할지 모르겠다면</p>
              <p className="text-[14px] leading-relaxed text-white/50">
                무료 상담에서 현재 상황을 진단하고, 가장 효과적인 솔루션을 맞춤 제안드립니다
              </p>
            </div>
            <Link href="#contact" className="shrink-0 rounded-full bg-[#C9A84C] px-7 py-3 text-[14px] font-bold text-[#0a0a0a] transition-all duration-300 hover:bg-[#e8c96d] hover:shadow-md hover:shadow-[#C9A84C]/20">
              무료 상담 신청 →
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
