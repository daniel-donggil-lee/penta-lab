"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import AnimatedSection from "@/components/ui/animated-section";

const TRACK_A = [
  { n: "01", text: "카톡 문의 늦게 답하면 그냥 이탈" },
  { n: "02", text: "미납 체크 매달 수작업으로 처리" },
  { n: "03", text: "학부모 리포트 원장이 직접 작성" },
  { n: "04", text: "블로그·인스타 알면서도 못 하고 있음" },
  { n: "05", text: "강사 나가면 원장이 다시 다 맡음" },
  { n: "06", text: "2호점 꿈꾸지만 지금 본점도 불안" },
];

const TRACK_B = [
  { n: "01", text: "매 기수 수강생 관리 다 수동 (엑셀+카톡)" },
  { n: "02", text: "Zoom 수업 알림 매번 직접 발송" },
  { n: "03", text: "결제·환불 내가 직접 처리" },
  { n: "04", text: "수강 완주율·만족도 데이터가 없음" },
  { n: "05", text: "콘텐츠 파이프라인 없어서 올리다 말다" },
  { n: "06", text: "팔로워는 늘어도 수익은 제자리" },
];

function PainGrid({ items }: { items: typeof TRACK_A }) {
  return (
    <>
      <div className="mb-10 grid grid-cols-3 gap-4 max-sm:grid-cols-2 max-[480px]:grid-cols-1">
        {items.map(({ n, text }, i) => (
          <AnimatedSection key={n} animation="fade-up" delay={i * 80}>
            <div className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#C9A84C] hover:shadow-lg hover:shadow-[#C9A84C]/5 before:absolute before:left-0 before:right-0 before:top-0 before:h-[3px] before:bg-[#C9A84C] before:opacity-0 before:transition hover:before:opacity-100">
              <div className="mb-3 text-[11px] font-bold tracking-[0.08em] text-neutral-400">{n}</div>
              <div className="text-[15px] font-bold leading-snug text-[#0a0a0a]">{text}</div>
            </div>
          </AnimatedSection>
        ))}
      </div>
      <AnimatedSection animation="fade-up" delay={500}>
        <Link href="/survey" className="flex items-center justify-between rounded-xl bg-[#0a0a0a] px-7 py-5 text-[16px] font-bold text-white transition-all duration-300 hover:bg-neutral-800 hover:shadow-lg">
          이 중 <span className="text-[#C9A84C]">&nbsp;1개라도&nbsp;</span> 해당되면, 자가진단 해보기 →
        </Link>
      </AnimatedSection>
    </>
  );
}

export default function Pain() {
  return (
    <section id="pain" className="px-10 py-[100px]">
      <div className="mx-auto max-w-[900px]">
        <AnimatedSection>
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.14em] text-[#C9A84C]">자가진단</p>
          <h2 className="mb-4 text-[clamp(28px,4vw,44px)] font-black leading-[1.15] tracking-[-0.03em]">
            지금 이 중에 몇 개나 해당되세요?
          </h2>
          <p className="mb-14 max-w-[560px] text-[17px] leading-[1.7] text-neutral-500">
            오프라인 학원 원장도, 온라인 교육 사업자도 — 문제의 뿌리는 같습니다. 자동화 시스템의 부재.
          </p>
        </AnimatedSection>

        <Tabs defaultValue="a">
          <TabsList className="mb-10 h-auto rounded-xl bg-neutral-100 p-1">
            <TabsTrigger value="a" className="rounded-lg px-6 py-2.5 text-[14px] font-semibold data-[state=active]:bg-[#0a0a0a] data-[state=active]:text-white">
              Track A · 오프라인 학원
            </TabsTrigger>
            <TabsTrigger value="b" className="rounded-lg px-6 py-2.5 text-[14px] font-semibold data-[state=active]:bg-[#0a0a0a] data-[state=active]:text-white">
              Track B · 온라인 교육 사업자
            </TabsTrigger>
          </TabsList>
          <TabsContent value="a"><PainGrid items={TRACK_A} /></TabsContent>
          <TabsContent value="b"><PainGrid items={TRACK_B} /></TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
