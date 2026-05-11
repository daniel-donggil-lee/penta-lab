"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnimatedSection from "@/components/ui/animated-section";

const BA_A = [
  {
    category: "상담 문의",
    before: "하루 뒤 답장\n→ 이미 다른 학원 등록",
    after: "15분 내 자동 응답",
    impact: "상담 전환율 3배",
  },
  {
    category: "미납 관리",
    before: "엑셀 + 수동 독촉 전화\n매달 반복",
    after: "자동 감지 + 문자 발송",
    impact: "미납율 -80%",
  },
  {
    category: "수업 운영",
    before: "감으로 운영\n데이터 없음",
    after: "실시간 대시보드",
    impact: "수강률·납부율 한눈에",
  },
];

const BA_B = [
  {
    category: "기수 오픈",
    before: "카톡 공지 + 수동 입금 확인\n+ 스프레드시트",
    after: "랜딩페이지 + 자동 결제",
    impact: "CRM 자동 등록까지",
  },
  {
    category: "Zoom 알림",
    before: "수업 때마다 직접 공지\n빠뜨리면 항의",
    after: "수업 전 자동 알림 발송",
    impact: "노쇼 -70%",
  },
  {
    category: "콘텐츠",
    before: "올리다 말다\n업로드 일정 없음",
    after: "예약 발행 파이프라인",
    impact: "채널 성장 궤도 진입",
  },
];

const TESTIMONIALS = [
  {
    quote: "매달 미납 전화하는 게 제일 스트레스였는데, 이제 시스템이 알아서 알림을 보내니까 학부모와 관계가 오히려 좋아졌어요.",
    name: "김 원장",
    role: "경기 소재 영어학원 · 원생 80명",
    tag: "미납 관리 자동화",
    stars: 5,
  },
  {
    quote: "리포트를 매주 직접 쓰다가 자동화하고 나니 월 8시간이 그냥 생겼어요. 그 시간에 수업 준비를 더 하게 됩니다.",
    name: "이 원장",
    role: "경기 소재 국어·영어 통합학원 · 원생 150명",
    tag: "리포트 자동화",
    stars: 5,
  },
];

function BACard({ category, before, after, impact, index }: {
  category: string; before: string; after: string; impact: string; index: number;
}) {
  return (
    <AnimatedSection animation="fade-up" delay={index * 120}>
      <div className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-neutral-200/80">
        {/* Category tag */}
        <div className="px-5 pt-5 pb-3">
          <span className="inline-block rounded-full bg-neutral-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-neutral-500">
            {category}
          </span>
        </div>

        {/* Before */}
        <div className="mx-5 mb-3 rounded-xl border border-red-100 bg-red-50/60 p-4">
          <div className="mb-2 flex items-center gap-1.5">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-400 text-[8px] font-black text-white">✕</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-red-400">Before</span>
          </div>
          <p className="whitespace-pre-line text-[13px] font-semibold leading-snug text-neutral-600">{before}</p>
        </div>

        {/* Arrow */}
        <div className="flex items-center justify-center py-1.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#C9A84C]/10">
            <span className="text-[14px] text-[#C9A84C]" style={{ animation: "bounceDown 2s ease-in-out infinite" }}>↓</span>
          </div>
        </div>

        {/* After */}
        <div className="mx-5 rounded-xl bg-[#0a0a0a] p-4">
          <div className="mb-2 flex items-center gap-1.5">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#C9A84C] text-[8px] font-black text-[#0a0a0a]">✓</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#C9A84C]">After</span>
          </div>
          <p className="mb-2 text-[13px] font-semibold leading-snug text-white/80">{after}</p>
          <div className="inline-block rounded-lg bg-[#C9A84C]/15 px-3 py-1.5">
            <span className="text-[15px] font-black text-[#C9A84C]">{impact}</span>
          </div>
        </div>
        <div className="h-5" />
      </div>
    </AnimatedSection>
  );
}

function BAGrid({ items }: { items: typeof BA_A }) {
  return (
    <div className="grid grid-cols-3 gap-5 max-md:grid-cols-1">
      {items.map((item, i) => (
        <BACard key={item.category} {...item} index={i} />
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
            도입 후, 이렇게 달라집니다
          </h2>
          <p className="mb-14 max-w-[560px] text-[17px] leading-[1.7] text-neutral-500">
            시스템 하나로 반복 업무가 사라집니다. 실제 사용자들의 변화입니다.
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

        {/* Testimonials — dark card style */}
        <div className="mt-14 grid grid-cols-2 gap-5 max-md:grid-cols-1">
          {TESTIMONIALS.map((t, i) => (
            <AnimatedSection key={t.name} animation="fade-up" delay={i * 150}>
              <div className="relative overflow-hidden rounded-2xl bg-[#0a0a0a] p-8">
                {/* Gold accent line */}
                <div className="absolute left-0 top-0 h-[3px] w-full bg-gradient-to-r from-[#C9A84C] to-transparent" />

                {/* Tag */}
                <div className="mb-5 inline-block rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 px-3 py-1 text-[11px] font-bold text-[#C9A84C]">
                  {t.tag}
                </div>

                {/* Stars */}
                <div className="mb-4 flex gap-0.5">
                  {Array.from({ length: t.stars }).map((_, s) => (
                    <span key={s} className="text-[14px] text-[#C9A84C]">★</span>
                  ))}
                </div>

                {/* Quote */}
                <p className="mb-6 text-[15px] leading-[1.85] text-white/80">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C9A84C]/15 text-[14px] font-black text-[#C9A84C]">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-white">{t.name}</div>
                    <div className="text-[12px] text-white/40">{t.role}</div>
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
