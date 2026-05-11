"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import AnimatedSection from "@/components/ui/animated-section";

interface Tier {
  badge: string; badgeColor: string; tier: string; setup?: string;
  price: string; unit: string; desc: string; features: string[]; featured?: boolean;
}

const TIERS_A: Tier[] = [
  { badge: "라인 1 · 시스템 개선", badgeColor: "bg-[#C9A84C]/12 text-[#C9A84C]", tier: "베이직", price: "49만", unit: "원/월", desc: "즉시 ROI — 문의 자동 응답부터 시작", features: ["카카오 자동 응답 챗봇", "학생 CRM 기본 구축", "미납 자동 감지 + 문자", "학원비 청구서 자동 발송"] },
  { badge: "라인 1 · 시스템 개선", badgeColor: "bg-[#C9A84C]/20 text-[#C9A84C]", tier: "프로", setup: "구축 500만 원 (1회)", price: "99만", unit: "원/월", desc: "풀 자동화 — AI 챗봇 + 예약 + 리포트", features: ["베이직 전체 포함", "AI 챗봇 (상담 자동화)", "Cal.com 상담 예약 연동", "학부모 리포트 자동 생성", "SNS 예약 발행 시스템"], featured: true },
  { badge: "라인 2 · 프차 준비", badgeColor: "bg-neutral-100 text-neutral-600", tier: "스탠다드", setup: "구축 2,000만 원 (1회)", price: "129만", unit: "원/월", desc: "가맹 확장 준비 — 멀티 브랜치 운영", features: ["프로 전체 포함", "멀티 지점 통합 대시보드", "가맹 운영 매뉴얼 시스템화", "성과 추적 + KPI 자동화"] },
];

const TIERS_B: Tier[] = [
  { badge: "라인 1 · 시스템 개선", badgeColor: "bg-[#C9A84C]/12 text-[#C9A84C]", tier: "베이직", price: "49만", unit: "원/월", desc: "즉시 ROI — 기수 관리부터 자동화", features: ["수강생 CRM 자동 등록", "결제 페이지 + 자동 확인", "Zoom 수업 알림 자동 발송", "수강생 대시보드 기본"] },
  { badge: "라인 1 · 시스템 개선", badgeColor: "bg-[#C9A84C]/20 text-[#C9A84C]", tier: "프로", setup: "구축 500만 원 (1회)", price: "99만", unit: "원/월", desc: "콘텐츠 파이프라인 + 완주율 분석", features: ["베이직 전체 포함", "콘텐츠 예약 발행 시스템", "수강 완주율·만족도 트래킹", "이탈 수강생 자동 리텐션", "기수별 성과 분석 리포트"], featured: true },
  { badge: "라인 2 · 규모화", badgeColor: "bg-neutral-100 text-neutral-600", tier: "스탠다드", setup: "구축 2,000만 원 (1회)", price: "129만", unit: "원/월", desc: "강의 플랫폼 자체 구축 + 멤버십", features: ["프로 전체 포함", "자체 LMS 플랫폼 구축", "멤버십/구독 결제 시스템", "제자 커뮤니티 자동화"] },
];

function TierGrid({ tiers }: { tiers: Tier[] }) {
  return (
    <div className="mb-10 grid grid-cols-3 gap-4 max-md:grid-cols-1">
      {tiers.map((t, i) => (
        <AnimatedSection key={t.tier} animation="fade-up" delay={i * 100}>
          <div
            className={`group rounded-[20px] border p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${
              t.featured
                ? "border-[#C9A84C] bg-[#0a0a0a] hover:shadow-[#C9A84C]/10"
                : "border-neutral-200 bg-white hover:border-[#C9A84C] hover:shadow-neutral-200/50"
            }`}
            style={t.featured ? { boxShadow: "0 0 24px rgba(201,168,76,0.08)" } : undefined}
          >
            <span className={`mb-5 inline-block rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] ${t.badgeColor}`}>
              {t.badge}
            </span>
            <div className={`mb-2 text-[22px] font-black tracking-[-0.02em] ${t.featured ? "text-white" : ""}`}>{t.tier}</div>
            {t.setup && <div className={`mb-1 text-[13px] ${t.featured ? "text-white/40" : "text-neutral-400"}`}>{t.setup}</div>}
            <div className="mb-5">
              <span className={`text-[28px] font-black tracking-[-0.03em] ${t.featured ? "text-[#C9A84C]" : ""}`}>{t.price}</span>
              <span className={`ml-1 text-[14px] ${t.featured ? "text-white/40" : "text-neutral-400"}`}>{t.unit}</span>
            </div>
            <div className={`mb-5 text-[13px] leading-relaxed ${t.featured ? "text-white/55" : "text-neutral-500"}`}>{t.desc}</div>
            <ul className="flex flex-col gap-2">
              {t.features.map((f) => (
                <li key={f} className={`flex items-start gap-2 text-[13px] ${t.featured ? "text-white/65" : "text-neutral-500"}`}>
                  <span className="mt-[1px] shrink-0 text-[#C9A84C] font-bold">✓</span>{f}
                </li>
              ))}
            </ul>
          </div>
        </AnimatedSection>
      ))}
    </div>
  );
}

export default function Services() {
  return (
    <section id="services" className="px-10 py-[100px]">
      <div className="mx-auto max-w-[900px]">
        <AnimatedSection>
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.14em] text-[#C9A84C]">서비스 & 가격</p>
          <h2 className="mb-4 text-[clamp(28px,4vw,44px)] font-black leading-[1.15] tracking-[-0.03em]">3단계 서비스 라인</h2>
          <p className="mb-14 max-w-[560px] text-[17px] leading-[1.7] text-neutral-500">지금 당장 필요한 것부터 시작하세요. 단계별로 확장 가능합니다.</p>
        </AnimatedSection>

        <Tabs defaultValue="a">
          <TabsList className="mb-10 h-auto rounded-xl bg-neutral-100 p-1">
            <TabsTrigger value="a" className="rounded-lg px-6 py-2.5 text-[14px] font-semibold data-[state=active]:bg-[#0a0a0a] data-[state=active]:text-white">Track A · 오프라인 학원</TabsTrigger>
            <TabsTrigger value="b" className="rounded-lg px-6 py-2.5 text-[14px] font-semibold data-[state=active]:bg-[#0a0a0a] data-[state=active]:text-white">Track B · 온라인 사업자</TabsTrigger>
          </TabsList>
          <TabsContent value="a"><TierGrid tiers={TIERS_A} /></TabsContent>
          <TabsContent value="b"><TierGrid tiers={TIERS_B} /></TabsContent>
        </Tabs>

        <AnimatedSection animation="fade-up" delay={300}>
          <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-[#0a0a0a] px-9 py-8">
            <p className="text-[15px] leading-relaxed text-white/60">
              외주 개발 총 시세 <strong className="text-[18px] text-[#C9A84C]">2.3억~5억+</strong> — 펜타랩은 직접 구축합니다. 그 70~80% 절감
            </p>
            <Link href="#contact" className="shrink-0 rounded-full bg-[#C9A84C] px-7 py-3 text-[14px] font-bold text-[#0a0a0a] transition-all duration-300 hover:bg-[#e8c96d] hover:shadow-md hover:shadow-[#C9A84C]/20">
              가격 상담 →
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
