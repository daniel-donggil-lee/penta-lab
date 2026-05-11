"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnimatedSection from "@/components/ui/animated-section";

const BA_A = [
  { category: "상담 문의", before: "하루 뒤 답장 → 이미 다른 학원 등록", after: "15분 내 자동 응답 → 상담 전환율 3배" },
  { category: "미납 관리", before: "엑셀 + 수동 독촉 전화 매달 반복", after: "자동 감지 + 문자 발송으로 미납율 -80%" },
  { category: "수업 운영", before: "감으로 운영 — 데이터 없음", after: "실시간 대시보드 — 수강률·납부율 한눈에" },
];

const BA_B = [
  { category: "기수 오픈", before: "카톡 공지 + 수동 입금 확인 + 스프레드시트", after: "랜딩페이지 + 자동 결제 + CRM 자동 등록" },
  { category: "Zoom 알림", before: "수업 때마다 직접 공지 — 빠뜨리면 항의", after: "수업 전 자동 알림 발송 — 노쇼 -70%" },
  { category: "콘텐츠", before: "올리다 말다 — 업로드 일정 없음", after: "예약 발행 파이프라인 — 채널 성장 궤도 진입" },
];

function BAGrid({ items }: { items: typeof BA_A }) {
  return (
    <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1">
      {items.map(({ category, before, after }, i) => (
        <AnimatedSection key={category} animation="fade-up" delay={i * 120}>
          <div className="overflow-hidden rounded-2xl border border-neutral-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="border-b border-neutral-200 bg-red-50 p-5">
              <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-red-400">Before</div>
              <div className="mb-1.5 text-[12px] font-semibold text-neutral-400">{category}</div>
              <div className="text-[14px] font-bold leading-snug text-[#0a0a0a]">{before}</div>
            </div>
            <div className="bg-green-50 p-5">
              <div className="mb-2 flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-green-500">After</span>
                <span className="text-green-400" style={{ animation: "bounceDown 2s ease-in-out infinite" }}>↓</span>
              </div>
              <div className="text-[14px] font-bold leading-snug text-green-800">{after}</div>
            </div>
          </div>
        </AnimatedSection>
      ))}
    </div>
  );
}

export default function BeforeAfter() {
  return (
    <section id="before-after" className="bg-neutral-50 px-10 py-[100px]">
      <div className="mx-auto max-w-[900px]">
        <AnimatedSection>
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.14em] text-[#C9A84C]">Before / After</p>
          <h2 className="mb-4 text-[clamp(28px,4vw,44px)] font-black leading-[1.15] tracking-[-0.03em]">
            펜타랩 도입 전 vs 후
          </h2>
          <p className="mb-14 max-w-[560px] text-[17px] leading-[1.7] text-neutral-500">
            수치로 보이는 변화. 8주 구축 이후 실제 운영 방식이 바뀝니다.
          </p>
        </AnimatedSection>

        <Tabs defaultValue="a">
          <TabsList className="mb-10 h-auto rounded-xl bg-neutral-200 p-1">
            <TabsTrigger value="a" className="rounded-lg px-6 py-2.5 text-[14px] font-semibold data-[state=active]:bg-white data-[state=active]:text-[#0a0a0a] data-[state=active]:shadow-sm">
              Track A · 오프라인 학원
            </TabsTrigger>
            <TabsTrigger value="b" className="rounded-lg px-6 py-2.5 text-[14px] font-semibold data-[state=active]:bg-white data-[state=active]:text-[#0a0a0a] data-[state=active]:shadow-sm">
              Track B · 온라인 사업자
            </TabsTrigger>
          </TabsList>
          <TabsContent value="a"><BAGrid items={BA_A} /></TabsContent>
          <TabsContent value="b"><BAGrid items={BA_B} /></TabsContent>
        </Tabs>

        {/* Testimonials */}
        <div className="mt-14 grid grid-cols-2 gap-5 max-md:grid-cols-1">
          {[
            {
              quote: "매달 미납 전화하는 게 제일 스트레스였는데, 이제 시스템이 알아서 알림을 보내니까 학부모와 관계가 오히려 좋아졌어요.",
              name: "김 원장",
              role: "경기 소재 영어학원 · 원생 80명",
            },
            {
              quote: "리포트를 매주 직접 쓰다가 자동화하고 나니 월 8시간이 그냥 생겼어요. 그 시간에 수업 준비를 더 하게 됩니다.",
              name: "이 원장",
              role: "경기 소재 국어·영어 통합학원 · 원생 150명",
            },
          ].map((t, i) => (
            <AnimatedSection key={t.name} animation="fade-up" delay={i * 150}>
              <div className="rounded-2xl border border-neutral-200 bg-white p-7">
                <div className="mb-4 text-[24px] leading-none text-[#C9A84C]">"</div>
                <p className="mb-5 text-[14px] leading-[1.8] text-neutral-600">{t.quote}</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C9A84C]/10 text-[13px] font-bold text-[#C9A84C]">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-[#0a0a0a]">{t.name}</div>
                    <div className="text-[11px] text-neutral-400">{t.role}</div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
