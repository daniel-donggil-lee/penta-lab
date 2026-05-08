"use client";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const GAS_URL =
  "https://script.google.com/macros/s/AKfycbxN3NaaZpCPPZfH7gEJVOGnyzJp9kvH5KtTXBMh86gnp6OCxcFPN8dGaK7THmVQb9vJoQ/exec";
const STORAGE_KEY = "pentalab_survey_v1";
const TOTAL_STEPS = 5;

// ── 데이터 정의 ───────────────────────────────────────────────────────────────

const BIZ_TYPES = [
  {
    id: "offline",
    label: "오프라인 학원",
    icon: "🏫",
    desc: "대면 수업 중심의 학원 운영",
    proof: "미술·독서논술·영어학원 원장님들이 가장 많이 선택합니다",
  },
  {
    id: "online",
    label: "온라인 교육 사업자",
    icon: "💻",
    desc: "Zoom·영상 강의 등 비대면 수업",
    proof: "팔로워 1만+ 강사, Zoom 수업 운영자분들이 선택합니다",
  },
  {
    id: "franchise",
    label: "프랜차이즈 본사",
    icon: "🏢",
    desc: "가맹점을 보유하거나 확장 준비 중",
    proof: "가맹점 10개 이상 보유하거나 준비 중인 본사 원장님들이 선택합니다",
  },
  {
    id: "creator",
    label: "콘텐츠 크리에이터",
    icon: "📱",
    desc: "유튜브·인스타 등 채널 기반 사업자",
    proof: "구독자 1만+ 채널로 수익화 중인 분들이 선택합니다",
  },
];

type ToolCategory = { id: string; label: string; options: string[] };

const TOOL_CATEGORIES_A: ToolCategory[] = [
  { id: "parent_comm", label: "학부모·학생 소통", options: ["카카오채널", "카카오톡 단체방", "문자(SMS)", "네이버 밴드", "없음"] },
  { id: "student_mgmt", label: "출결·학생 관리", options: ["전용 학원 앱(iM학원·학원365 등)", "구글시트", "엑셀", "수기 장부", "없음"] },
  { id: "payment", label: "수납·결제", options: ["전용 학원 앱", "자동이체(CMS)", "카드 단말기", "계좌이체 수동", "없음"] },
  { id: "internal_comm", label: "강사·스태프 내부 소통", options: ["카카오톡", "슬랙", "네이버웍스", "없음"] },
  { id: "consult", label: "상담·등록", options: ["네이버 예약", "카카오 예약", "전화·수기", "구글 폼", "없음"] },
  { id: "marketing", label: "마케팅·홍보", options: ["네이버 블로그", "인스타그램", "당근마켓", "유튜브", "없음"] },
];

const TOOL_CATEGORIES_B: ToolCategory[] = [
  { id: "student_comm", label: "수강생 소통", options: ["카카오채널", "카카오 오픈채팅", "네이버카페", "디스코드", "없음"] },
  { id: "live_class", label: "강의 진행", options: ["Zoom", "구글 밋", "유튜브 라이브", "없음(VOD만)"] },
  { id: "content_create", label: "콘텐츠 제작·편집", options: ["프리미어 프로", "캡컷(CapCut)", "미리캔버스", "Canva", "없음(외주)"] },
  { id: "content_sell", label: "강의 판매·배포", options: ["클래스101", "탈잉", "크몽", "자체 홈페이지/LMS", "없음"] },
  { id: "payment_b", label: "결제·정산", options: ["토스페이먼츠", "아임포트(포트원)", "카카오페이", "계좌이체 수동", "없음"] },
  { id: "marketing_b", label: "마케팅·퍼널", options: ["인스타그램", "유튜브", "메타광고", "스티비(뉴스레터)", "없음"] },
];

const TOOL_CATEGORIES_COMMON: ToolCategory[] = [
  { id: "collaboration", label: "내부 협업·문서 관리", options: ["노션", "구글 워크스페이스", "슬랙", "엑셀·한글", "없음"] },
  { id: "analytics", label: "데이터·성과 분석", options: ["구글 애널리틱스", "구글시트 수동 집계", "전용 대시보드", "없음"] },
];

type Pain = { label: string; tooltip: string; solution: string };
type PainCategory = { id: string; label: string; items: Pain[] };

const PAIN_CATEGORIES_A: PainCategory[] = [
  {
    id: "pa_comm",
    label: "학부모·학생 소통",
    items: [
      { label: "상담 문의 늦게 답해 이탈", tooltip: "카카오 문의가 몰릴 때 답장이 늦어지면 그 사이에 다른 학원으로 이탈합니다", solution: "카카오 AI 챗봇 + 자동 응대" },
      { label: "학부모 알림·리포트 수작업", tooltip: "수업 알림, 숙제 공지, 진도 안내를 원장이 직접 보내는 상황", solution: "알림톡 자동화 + 주간 리포트" },
      { label: "상담 이력·DB 없음", tooltip: "상담 기록이 개인 메모나 카톡에만 남아 있어 인수인계·분석이 안 되는 상태", solution: "상담 CRM + 이력 관리 시스템" },
    ],
  },
  {
    id: "pa_student",
    label: "출결·학생 관리",
    items: [
      { label: "출결·보강 스케줄 수작업", tooltip: "결석 처리, 보강 스케줄, 강사 공유까지 전부 수작업", solution: "출결·보강 관리 시스템" },
      { label: "학생 성취도 추적 부재", tooltip: "데이터가 없어 '잘 하고 있어요'밖에 못 하는 상태. 학부모 신뢰 하락 원인", solution: "성취도 트래킹 대시보드" },
      { label: "이탈 학생 미리 못 잡음", tooltip: "조용히 그만두는 학생을 사전에 감지하지 못함. 신규 모집보다 이탈 방어가 5배 저렴", solution: "이탈 예측 + 선제 케어 알림" },
      { label: "등하원 안전 알림 미비", tooltip: "초등 학부모는 알림이 없으면 불안. 경쟁 학원 차별화 포인트", solution: "등하원 안전 알림 자동화" },
    ],
  },
  {
    id: "pa_payment",
    label: "수납·결제",
    items: [
      { label: "원비 미납 수작업 관리", tooltip: "매달 미납 확인·독촉 문자를 원장이 직접 보내는 상황", solution: "미납 자동 감지 + 알림톡 독촉" },
      { label: "세무·회계 수작업", tooltip: "카드 매출 정리, 4대보험, 원천징수까지 전부 수작업", solution: "매출·지출 자동 분류" },
    ],
  },
  {
    id: "pa_staff",
    label: "강사·스태프 소통",
    items: [
      { label: "강사 채용·이탈 문제", tooltip: "좋은 강사 찾기 어렵고, 구한 강사도 더 좋은 조건에 바로 이탈", solution: "강사 계약·정산 자동화" },
      { label: "강사 정산·계약 수작업", tooltip: "급여 정산, 계약서 갱신을 매달 수작업으로 처리하는 상태", solution: "강사 계약·정산 자동화" },
    ],
  },
  {
    id: "pa_consult",
    label: "상담·등록",
    items: [
      { label: "신규 등록 프로세스 비효율", tooltip: "전화 상담 → 방문 → 서류 작성까지 원장이 전부 직접 처리하는 상태", solution: "자동 예약 + 등록 파이프라인" },
      { label: "재등록률 관리 안 됨", tooltip: "만료 예정 학생에게 선제적으로 연락하는 체계가 없는 상태", solution: "재등록 알림 + 리텐션 자동화" },
    ],
  },
  {
    id: "pa_marketing",
    label: "마케팅·홍보",
    items: [
      { label: "블로그·SNS 마케팅 못 함", tooltip: "알아도 시간이 없어서 못 하는 상태. 경쟁 학원에 계속 밀리는 중", solution: "블로그·인스타 자동 콘텐츠 생성" },
      { label: "리뷰·평판 모니터링 없음", tooltip: "네이버 리뷰 하나가 상담 전환율을 바꿉니다. 모니터링 체계가 없는 상태", solution: "리뷰 모니터링 + 대응 시스템" },
      { label: "가맹·2호점 확장이 막힘", tooltip: "본점은 잘 되는데 커리큘럼 문서화·가맹 계약서·시스템이 없어서 확장이 안 되는 상태", solution: "프랜차이즈 준비 패키지" },
    ],
  },
];

const PAIN_CATEGORIES_B: PainCategory[] = [
  {
    id: "pb_comm",
    label: "수강생 소통",
    items: [
      { label: "알림·공지 수동 발송", tooltip: "오픈 공지, 과제 안내, 리마인더를 매번 직접 보내는 상태", solution: "자동 알림 + 공지 시스템" },
      { label: "수강생 문의 대응 수작업", tooltip: "DM, 카톡 문의를 원장이 직접 하나하나 답하는 상황. 밤낮없이 울리는 메시지", solution: "AI 챗봇 + 자동 응대" },
    ],
  },
  {
    id: "pb_class",
    label: "강의 진행",
    items: [
      { label: "수업 예약·스케줄 관리", tooltip: "DM·카톡으로 예약받고 엑셀에 정리하는 상황. 노쇼 관리도 안 됨", solution: "자동 예약 + 노쇼 알림" },
      { label: "수강생 진도 추적 안 됨", tooltip: "누가 어디까지 들었는지, 미수강자 파악이 안 됨", solution: "진도 트래킹 대시보드" },
    ],
  },
  {
    id: "pb_content",
    label: "콘텐츠 제작·편집",
    items: [
      { label: "콘텐츠 업로드 파이프라인 없음", tooltip: "영상을 올리고 링크를 나눠주는 게 전부인 상태. 진도·이력 관리가 안 됨", solution: "LMS + 콘텐츠 라이브러리" },
      { label: "홍보 콘텐츠 자동화 안 됨", tooltip: "SNS 포스팅, 썸네일, 카피를 매번 수작업으로 만드는 상태", solution: "AI 콘텐츠 자동 생성 파이프라인" },
    ],
  },
  {
    id: "pb_sell",
    label: "강의 판매·배포",
    items: [
      { label: "수강생 CRM·관리가 없음", tooltip: "누가 몇 기 수강생인지, 언제 이탈했는지 추적이 안 되는 상태", solution: "수강생 CRM 파이프라인" },
      { label: "이탈 수강생 감지 못 함", tooltip: "조용히 나가는 수강생을 사전에 잡지 못해 매 기수마다 재모집 비용 발생", solution: "이탈 예측 + 리텐션 자동화" },
    ],
  },
  {
    id: "pb_payment",
    label: "결제·정산",
    items: [
      { label: "결제·환불 수작업", tooltip: "계좌이체 확인, 환불 처리, 영수증 발급까지 전부 수작업", solution: "결제 자동화 + 환불 처리" },
      { label: "멤버십·구독 관리 어려움", tooltip: "구독 만료일, 갱신 알림, 등급 관리를 수작업으로 하는 상태", solution: "구독·멤버십 관리 시스템" },
    ],
  },
  {
    id: "pb_marketing",
    label: "마케팅·퍼널",
    items: [
      { label: "유입→전환 퍼널 추적 안 됨", tooltip: "SNS에서 링크를 클릭하고 얼마나 결제로 이어지는지 데이터가 없는 상태", solution: "퍼널 분석 + 전환 최적화" },
      { label: "SNS 광고 성과 추적 안 됨", tooltip: "메타·유튜브 광고를 돌리는데 어떤 광고가 효과 있는지 파악이 안 됨", solution: "광고 성과 대시보드" },
    ],
  },
];

const PAIN_CATEGORIES_COMMON: PainCategory[] = [
  {
    id: "pc_analytics",
    label: "데이터·성과 분석",
    items: [
      { label: "수익·매출 데이터 시각화 없음", tooltip: "이번 달 얼마 벌었는지, 어느 강좌가 효자인지 데이터가 없는 상태", solution: "실시간 매출 대시보드" },
      { label: "업무별 시간 소요 파악 안 됨", tooltip: "어떤 업무에 얼마나 시간을 쓰는지 모르니 자동화 우선순위를 잡기 어려운 상태", solution: "업무 효율 분석 리포트" },
    ],
  },
];

// ── 예상 솔루션 계산 ────────────────────────────────────────────────────────

function computeSolutionTier(scale: string, pains: string[]): { tier: string; desc: string; color: string } {
  const big = scale === "200명~" || scale === "80~200명";
  const mid = scale === "30~80명";
  if (pains.length >= 3 && big) return { tier: "스탠다드 ~ 프리미엄", desc: "통합 운영 자동화 + 고급 분석까지", color: "text-purple-600 bg-purple-50 border-purple-200" };
  if (pains.length >= 2 && (big || mid)) return { tier: "프로", desc: "핵심 자동화 + 마케팅 + 성취도 추적", color: "text-blue-600 bg-blue-50 border-blue-200" };
  return { tier: "베이직 ~ 프로", desc: "즉시 효과를 볼 수 있는 핵심 자동화", color: "text-emerald-600 bg-emerald-50 border-emerald-200" };
}

// ── 공통 컴포넌트 ─────────────────────────────────────────────────────────────

function Tooltip({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <div className="group relative inline-block">
      {children}
      <div className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 w-52 -translate-x-1/2 rounded-xl bg-neutral-900 px-3 py-2.5 text-[12px] leading-[1.5] text-white opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
        {text}
        <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-neutral-900" />
      </div>
    </div>
  );
}

function SelectPill({
  label, selected, onClick,
}: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-[13px] font-semibold transition-all ${
        selected
          ? "border-[#C9A84C] bg-[#C9A84C]/10 text-[#C9A84C] pop-in"
          : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
      }`}
    >
      {label}
    </button>
  );
}

function SelectGroup({
  label, options, value, onChange,
}: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <p className="mb-3 text-[14px] font-bold text-neutral-700">{label}</p>
      <div className="flex flex-wrap gap-2.5">
        {options.map((o) => (
          <SelectPill key={o} label={o} selected={value === o} onClick={() => onChange(o)} />
        ))}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[13px] font-bold text-neutral-700">{label}</label>
      {children}
    </div>
  );
}

// ── Step 컴포넌트 ─────────────────────────────────────────────────────────────

function Step1({ value, onSelect }: { value: string; onSelect: (v: string) => void }) {
  const selected = BIZ_TYPES.find((t) => t.id === value);
  return (
    <div>
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#C9A84C]">Step 1 / {TOTAL_STEPS}</p>
      <h2 className="mb-3 text-[clamp(26px,4vw,40px)] font-black leading-[1.1] tracking-[-0.03em]">
        어떤 사업을 운영하고 계신가요?
      </h2>
      <p className="mb-8 text-[16px] text-neutral-500">선택하면 자동으로 다음 단계로 넘어갑니다.</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {BIZ_TYPES.map((t) => {
          const isSelected = value === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelect(t.id)}
              className={`rounded-2xl border-2 p-6 text-left transition-all duration-200 ${
                isSelected
                  ? "scale-[1.02] border-[#C9A84C] bg-[#C9A84C]/8 shadow-md"
                  : "border-neutral-200 hover:border-neutral-300 hover:shadow-sm"
              }`}
            >
              <div className="mb-2 flex items-center gap-3">
                <span className="text-[24px]">{t.icon}</span>
                <span className="text-[16px] font-extrabold">{t.label}</span>
                {isSelected && (
                  <span className="pop-in ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-[#C9A84C] text-[11px] font-black text-white">✓</span>
                )}
              </div>
              <p className="text-[13px] text-neutral-500">{t.desc}</p>
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="mt-5 flex items-center gap-2 rounded-xl bg-neutral-50 px-4 py-3 pop-in">
          <span className="text-[13px] text-neutral-400">💡</span>
          <p className="text-[13px] text-neutral-500">{selected.proof}</p>
        </div>
      )}
    </div>
  );
}

function Step2({
  org, name, phone, email, onChange,
}: { org: string; name: string; phone: string; email: string; onChange: (k: string, v: string) => void }) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#C9A84C]">Step 2 / {TOTAL_STEPS}</p>
      <h2 className="mb-3 text-[clamp(26px,4vw,40px)] font-black leading-[1.1] tracking-[-0.03em]">
        기본 정보를 알려주세요
      </h2>
      <p className="mb-10 text-[16px] text-neutral-500">연락드릴 때 사용하는 정보입니다.</p>
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="기관명 / 채널명 *">
            <Input value={org} onChange={(e) => onChange("org", e.target.value)} required
              className="mt-2 rounded-xl border-neutral-200 py-3.5 text-[15px] focus-visible:ring-[#C9A84C]"
              placeholder="ex. 우리학원, 슬기로운초등생활" />
          </Field>
          <Field label="담당자 성함 *">
            <Input value={name} onChange={(e) => onChange("name", e.target.value)} required
              className="mt-2 rounded-xl border-neutral-200 py-3.5 text-[15px] focus-visible:ring-[#C9A84C]"
              placeholder="홍길동" />
          </Field>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="연락처 *">
            <Input type="tel" value={phone} onChange={(e) => onChange("phone", e.target.value)} required
              className="mt-2 rounded-xl border-neutral-200 py-3.5 text-[15px] focus-visible:ring-[#C9A84C]"
              placeholder="010-0000-0000" />
          </Field>
          <Field label="이메일 (선택)">
            <Input type="email" value={email} onChange={(e) => onChange("email", e.target.value)}
              className="mt-2 rounded-xl border-neutral-200 py-3.5 text-[15px] focus-visible:ring-[#C9A84C]"
              placeholder="example@email.com" />
          </Field>
        </div>
      </div>
    </div>
  );
}

function Step3({
  bizType, scale, instructors, staff, duration, tools: selectedTools, onSelect, onNumber, onToggleTool,
}: {
  bizType: string; scale: string; instructors: string; staff: string; duration: string; tools: string[];
  onSelect: (k: string, v: string) => void;
  onNumber: (k: string, v: string) => void;
  onToggleTool: (t: string) => void;
}) {
  const isCreator = bizType === "creator";
  const scaleLabel =
    bizType === "offline" || bizType === "franchise" ? "원생 수" :
    bizType === "online" ? "수강생 수" : "구독자·수강생 수";

  return (
    <div>
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#C9A84C]">Step 3 / {TOTAL_STEPS}</p>
      <h2 className="mb-3 text-[clamp(26px,4vw,40px)] font-black leading-[1.1] tracking-[-0.03em]">
        현재 규모와 운영 현황
      </h2>
      <p className="mb-10 text-[16px] text-neutral-500">대략적인 규모도 괜찮습니다.</p>
      <div className="flex flex-col gap-8">
        <SelectGroup label={scaleLabel} value={scale} onChange={(v) => onSelect("scale", v)}
          options={["~30명", "30~80명", "80~200명", "200명~", "아직 없음"]} />

        {/* 강사 수 — 크리에이터 제외 */}
        {!isCreator && (
          <div>
            <p className="mb-1.5 text-[14px] font-bold text-neutral-700">강사 수</p>
            <p className="mb-3 text-[12px] text-neutral-400">본인 외 강의를 수행하며 실질적인 매출을 일으키는 인원</p>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0"
                value={instructors}
                onChange={(e) => onNumber("instructors", e.target.value)}
                placeholder="0"
                className="w-28 rounded-xl border border-neutral-200 px-4 py-3 text-[16px] font-bold text-center focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
              />
              <span className="text-[15px] text-neutral-500">명</span>
              <span className="text-[13px] text-neutral-300">(본인만이면 0)</span>
            </div>
          </div>
        )}

        {/* 스태프 수 — 전 유형 */}
        <div>
          <p className="mb-1.5 text-[14px] font-bold text-neutral-700">스태프 수</p>
          <p className="mb-3 text-[12px] text-neutral-400">매출 직결은 아니지만 운영을 보조하는 인원 (행정·상담·편집 등)</p>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="0"
              value={staff}
              onChange={(e) => onNumber("staff", e.target.value)}
              placeholder="0"
              className="w-28 rounded-xl border border-neutral-200 px-4 py-3 text-[16px] font-bold text-center focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
            />
            <span className="text-[15px] text-neutral-500">명</span>
            <span className="text-[13px] text-neutral-300">(없으면 0)</span>
          </div>
        </div>

        <SelectGroup label="운영 기간" value={duration} onChange={(v) => onSelect("duration", v)}
          options={["준비 중", "1년 미만", "1~3년", "3년~"]} />
        {/* 도구 카테고리 */}
        <div>
          <p className="mb-1 text-[14px] font-bold text-neutral-700">현재 사용 중인 도구</p>
          <p className="mb-6 text-[13px] text-neutral-400">영역별로 해당하는 도구를 모두 선택해주세요.</p>
          <div className="flex flex-col gap-5">
            {[...(isCreator || bizType === "online" ? TOOL_CATEGORIES_B : TOOL_CATEGORIES_A), ...TOOL_CATEGORIES_COMMON].map((cat) => {
              const selected = cat.options.filter((o) => selectedTools.includes(`${cat.id}::${o}`));
              return (
                <div key={cat.id} className="rounded-2xl border border-neutral-100 bg-neutral-50 p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-[13px] font-bold text-neutral-700">{cat.label}</span>
                    {selected.length > 0 && (
                      <span className="rounded-full bg-[#C9A84C] px-2 py-0.5 text-[10px] font-black text-white">{selected.length}</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cat.options.map((o) => (
                      <SelectPill
                        key={o}
                        label={o}
                        selected={selectedTools.includes(`${cat.id}::${o}`)}
                        onClick={() => onToggleTool(`${cat.id}::${o}`)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Step4({
  bizType, pains, onToggle,
}: { bizType: string; pains: string[]; onToggle: (p: string) => void }) {
  const isB = bizType === "online" || bizType === "creator";
  const trackCats = isB ? PAIN_CATEGORIES_B : PAIN_CATEGORIES_A;
  const allCats = [...trackCats, ...PAIN_CATEGORIES_COMMON];
  const rankOf = (label: string) => pains.indexOf(label) + 1;

  return (
    <div>
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#C9A84C]">Step 4 / {TOTAL_STEPS}</p>
      <h2 className="mb-3 text-[clamp(26px,4vw,40px)] font-black leading-[1.1] tracking-[-0.03em]">
        지금 가장 아픈 문제는?
      </h2>
      <p className="mb-8 text-[16px] text-neutral-500">
        해당되는 문제를 모두 선택해주세요.
        {pains.length > 0 && (
          <span className="ml-2 font-bold text-[#C9A84C]">({pains.length}개 선택됨)</span>
        )}
      </p>

      <div className="flex flex-col gap-4">
        {allCats.map((cat) => {
          const selectedInCat = cat.items.filter((item) => pains.includes(item.label)).length;
          return (
            <div key={cat.id} className="rounded-2xl border border-neutral-100 bg-neutral-50 p-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-[13px] font-bold text-neutral-700">{cat.label}</span>
                {selectedInCat > 0 && (
                  <span className="rounded-full bg-[#C9A84C] px-2 py-0.5 text-[10px] font-black text-white">{selectedInCat}</span>
                )}
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {cat.items.map((pain) => {
                  const rank = rankOf(pain.label);
                  const isSelected = rank > 0;
                  return (
                    <Tooltip key={pain.label} text={pain.tooltip}>
                      <button
                        type="button"
                        onClick={() => onToggle(pain.label)}
                        className={`relative w-full rounded-xl border-2 px-4 py-3 text-left text-[13px] font-semibold transition-all duration-150 ${
                          isSelected
                            ? "border-[#C9A84C] bg-[#C9A84C]/8 text-[#0a0a0a]"
                            : "border-neutral-200 text-neutral-700 hover:border-neutral-300 hover:bg-white"
                        }`}
                      >
                        {isSelected && (
                          <span className={`rank-badge-in absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-black ${rank === 1 ? "bg-[#C9A84C] text-white" : rank === 2 ? "bg-neutral-700 text-white" : rank === 3 ? "bg-neutral-400 text-white" : "bg-neutral-200 text-neutral-600"}`}>
                            {rank}
                          </span>
                        )}
                        <span className={`mr-2 inline-block h-4 w-4 shrink-0 rounded border-2 align-middle transition-all ${isSelected ? "border-[#C9A84C] bg-[#C9A84C]" : "border-neutral-300"}`} />
                        {pain.label}
                        <span className="ml-1.5 text-[11px] text-neutral-400">ⓘ</span>
                      </button>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SolutionPreview({ pains, bizType, scale }: { pains: string[]; bizType: string; scale: string }) {
  if (pains.length === 0) return null;

  const isB = bizType === "online" || bizType === "creator";
  const allItems = [...(isB ? PAIN_CATEGORIES_B : PAIN_CATEGORIES_A), ...PAIN_CATEGORIES_COMMON].flatMap((c) => c.items);
  const selectedPains = pains.map((label) => allItems.find((p) => p.label === label)).filter(Boolean) as Pain[];
  const tier = computeSolutionTier(scale, pains);

  return (
    <div className="mb-8 rounded-2xl border border-neutral-100 bg-neutral-50 p-6">
      <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-400">
        선택하신 내용 기반 — 예상 솔루션 미리보기
      </p>
      <div className="mb-4 flex flex-wrap gap-2">
        {selectedPains.map((p, i) => (
          <div key={p.label} className="flex items-center gap-1.5 rounded-xl bg-white border border-neutral-200 px-3 py-1.5">
            <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-black text-white ${i === 0 ? "bg-[#C9A84C]" : i === 1 ? "bg-neutral-600" : "bg-neutral-400"}`}>{i + 1}</span>
            <span className="text-[12px] font-semibold text-neutral-700">{p.solution}</span>
          </div>
        ))}
      </div>
      <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] font-bold ${tier.color}`}>
        <span>추천 티어</span>
        <span className="font-black">{tier.tier}</span>
        <span className="font-normal opacity-70">— {tier.desc}</span>
      </div>
    </div>
  );
}

function Step5({
  buildBudget, maintBudget, startTiming, memo, pains, bizType, scale,
  onSelect, onMemo,
}: {
  buildBudget: string; maintBudget: string; startTiming: string; memo: string;
  pains: string[]; bizType: string; scale: string;
  onSelect: (k: string, v: string) => void;
  onMemo: (v: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#C9A84C]">Step 5 / {TOTAL_STEPS}</p>
      <h2 className="mb-3 text-[clamp(26px,4vw,40px)] font-black leading-[1.1] tracking-[-0.03em]">
        예산과 시작 시점
      </h2>
      <p className="mb-8 text-[16px] text-neutral-500">정확하지 않아도 괜찮습니다. 방향만 알려주세요.</p>

      <SolutionPreview pains={pains} bizType={bizType} scale={scale} />

      <div className="flex flex-col gap-8">
        <SelectGroup label="초기 제작비 예산" value={buildBudget} onChange={(v) => onSelect("buildBudget", v)}
          options={["~500만원", "500만~1,500만원", "1,500만~3,000만원", "3,000만원~", "아직 모름"]} />
        <SelectGroup label="월 유지보수 예산" value={maintBudget} onChange={(v) => onSelect("maintBudget", v)}
          options={["~30만원/월", "30~80만원/월", "80~200만원/월", "협의 필요"]} />
        <SelectGroup label="원하는 착수 시점" value={startTiming} onChange={(v) => onSelect("startTiming", v)}
          options={["가능한 빨리", "1개월 내", "3개월 내", "아직 탐색 중"]} />
        <div>
          <label className="mb-3 block text-[14px] font-bold text-neutral-700">
            추가로 전달하고 싶은 내용 <span className="font-normal text-neutral-400">(선택)</span>
          </label>
          <Textarea value={memo} onChange={(e) => onMemo(e.target.value)}
            placeholder="현재 쓰는 시스템, 원하는 기능, 레퍼런스 사이트 등 자유롭게 적어주세요"
            className="min-h-[100px] rounded-xl border-neutral-200 text-[15px] focus-visible:ring-[#C9A84C]" />
        </div>
      </div>
    </div>
  );
}

function Done({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center py-10 text-center pop-in">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#C9A84C]/15 text-[40px]">
        ✓
      </div>
      <h2 className="mb-3 text-[clamp(26px,4vw,36px)] font-black tracking-[-0.03em]">
        제출 완료되었습니다
      </h2>
      <p className="mb-6 text-[17px] leading-[1.7] text-neutral-500">
        24시간 내 담당자가 직접 연락드립니다.
      </p>
      <div className="mb-8 rounded-2xl border border-neutral-100 bg-neutral-50 px-6 py-5 text-left max-w-[440px]">
        <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#C9A84C]">다음 단계</p>
        <p className="text-[14px] leading-[1.8] text-neutral-600">
          1차 설문 내용을 바탕으로 더 자세한 <strong className="text-neutral-800">맞춤 2차 설문지</strong>를 제작하여 전달드릴 예정입니다. 2차 설문을 통해 정확한 니즈를 파악한 후 견적서를 제안드립니다.
        </p>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="text-[13px] text-neutral-400 underline underline-offset-2 hover:text-neutral-500"
      >
        처음부터 다시 작성
      </button>
    </div>
  );
}

// ── 메인 폼 ───────────────────────────────────────────────────────────────────

type FormState = {
  step: number;
  bizType: string;
  org: string; name: string; phone: string; email: string;
  scale: string; instructors: string; staff: string; duration: string; tools: string[];
  pains: string[];
  buildBudget: string; maintBudget: string; startTiming: string; memo: string;
};

const INITIAL: FormState = {
  step: 1,
  bizType: "",
  org: "", name: "", phone: "", email: "",
  scale: "", instructors: "", staff: "", duration: "", tools: [],
  pains: [],
  buildBudget: "", maintBudget: "", startTiming: "", memo: "",
};

export default function SurveyForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [autoAdvancing, setAutoAdvancing] = useState(false);

  // localStorage — 불러오기
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<FormState>;
        setForm((prev) => ({ ...prev, ...saved, step: 1 })); // step은 항상 1로 시작
      }
    } catch { /* ignore */ }
  }, []);

  // localStorage — 저장
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    } catch { /* ignore */ }
  }, [form]);

  const set = useCallback(<K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((prev) => ({ ...prev, [k]: v })), []);

  const goNext = useCallback(() => {
    setDirection("forward");
    setForm((prev) => ({ ...prev, step: prev.step + 1 }));
  }, []);

  const goPrev = useCallback(() => {
    setDirection("backward");
    setForm((prev) => ({ ...prev, step: prev.step - 1 }));
  }, []);

  // Step 1 자동 이동
  const handleBizTypeSelect = useCallback((id: string) => {
    set("bizType", id);
    setAutoAdvancing(true);
    setTimeout(() => {
      setAutoAdvancing(false);
      setDirection("forward");
      setForm((prev) => ({ ...prev, step: 2 }));
    }, 520);
  }, [set]);

  const handleInfo = useCallback((k: string, v: string) => {
    set(k as keyof FormState, v as never);
  }, [set]);

  const handleScale = useCallback((k: string, v: string) => {
    set(k as keyof FormState, v as never);
  }, [set]);

  const handleBudget = useCallback((k: string, v: string) => {
    set(k as keyof FormState, v as never);
  }, [set]);

  const toggleTool = useCallback((t: string) =>
    setForm((prev) => ({
      ...prev,
      tools: prev.tools.includes(t) ? prev.tools.filter((x) => x !== t) : [...prev.tools, t],
    })), []);

  const togglePain = useCallback((p: string) =>
    setForm((prev) => ({
      ...prev,
      pains: prev.pains.includes(p) ? prev.pains.filter((x) => x !== p) : [...prev.pains, p],
    })), []);

  const canNext = () => {
    if (form.step === 1) return !!form.bizType;
    if (form.step === 2) return !!form.org && !!form.name && !!form.phone;
    if (form.step === 4) return form.pains.length > 0;
    return true;
  };

  async function handleSubmit() {
    setLoading(true);
    const ts = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
    const bizLabel = BIZ_TYPES.find((t) => t.id === form.bizType)?.label ?? form.bizType;
    const payload = JSON.stringify({
      action: "append", sheet: "설문_응답",
      values: [
        ts, bizLabel, form.org, form.name, form.phone, form.email,
        form.scale, form.instructors ? `${form.instructors}명` : "0명", form.staff ? `${form.staff}명` : "0명", form.duration,
        (() => {
          const isB = form.bizType === "online" || form.bizType === "creator";
          const cats = [...(isB ? TOOL_CATEGORIES_B : TOOL_CATEGORIES_A), ...TOOL_CATEGORIES_COMMON];
          return cats.map((cat) => {
            const picked = form.tools.filter((t) => t.startsWith(`${cat.id}::`)).map((t) => t.replace(`${cat.id}::`, ""));
            return picked.length ? `[${cat.label}] ${picked.join(", ")}` : null;
          }).filter(Boolean).join(" / ");
        })(),
        (() => {
          const isB = form.bizType === "online" || form.bizType === "creator";
          const cats = [...(isB ? PAIN_CATEGORIES_B : PAIN_CATEGORIES_A), ...PAIN_CATEGORIES_COMMON];
          return cats.map((cat) => {
            const picked = form.pains.filter((p) => cat.items.some((item) => item.label === p));
            return picked.length ? `[${cat.label}] ${picked.join(", ")}` : null;
          }).filter(Boolean).join(" / ");
        })(),
        form.buildBudget, form.maintBudget, form.startTiming, form.memo,
      ],
    });
    try {
      await fetch(`${GAS_URL}?payload=${encodeURIComponent(payload)}`, { method: "GET", mode: "no-cors" });
      localStorage.removeItem(STORAGE_KEY);
      setSubmitted(true);
    } catch {
      alert("전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setForm(INITIAL);
    setSubmitted(false);
    localStorage.removeItem(STORAGE_KEY);
  }

  if (submitted) return <Done onReset={handleReset} />;

  const animClass = direction === "forward" ? "survey-slide-right" : "survey-slide-left";

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-10">
        <div className="mb-2 flex justify-between text-[12px] text-neutral-400">
          <span>{form.step} / {TOTAL_STEPS}</span>
          <span>{Math.round((form.step / TOTAL_STEPS) * 100)}% 완료</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
          <div
            className="h-full rounded-full bg-[#C9A84C] transition-all duration-500 ease-out"
            style={{ width: `${(form.step / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      {/* Step content — key 변경 시 재마운트 → 애니메이션 트리거 */}
      <div key={form.step} className={animClass}>
        {form.step === 1 && (
          <div className={autoAdvancing ? "pointer-events-none opacity-70 transition-opacity" : ""}>
            <Step1 value={form.bizType} onSelect={handleBizTypeSelect} />
          </div>
        )}
        {form.step === 2 && (
          <Step2 org={form.org} name={form.name} phone={form.phone} email={form.email} onChange={handleInfo} />
        )}
        {form.step === 3 && (
          <Step3
            bizType={form.bizType}
            scale={form.scale} instructors={form.instructors} staff={form.staff}
            duration={form.duration} tools={form.tools}
            onSelect={handleScale} onNumber={(k, v) => set(k as keyof FormState, v as never)}
            onToggleTool={toggleTool}
          />
        )}
        {form.step === 4 && (
          <Step4 bizType={form.bizType} pains={form.pains} onToggle={togglePain} />
        )}
        {form.step === 5 && (
          <Step5
            buildBudget={form.buildBudget} maintBudget={form.maintBudget}
            startTiming={form.startTiming} memo={form.memo}
            pains={form.pains} bizType={form.bizType} scale={form.scale}
            onSelect={handleBudget} onMemo={(v) => set("memo", v)}
          />
        )}
      </div>

      {/* Navigation */}
      {!autoAdvancing && (
        <div className={`mt-10 flex ${form.step > 1 ? "justify-between" : "justify-end"} items-center`}>
          {form.step > 1 && (
            <button type="button" onClick={goPrev}
              className="text-[14px] font-semibold text-neutral-400 transition-colors hover:text-neutral-600">
              ← 이전
            </button>
          )}
          {form.step < TOTAL_STEPS ? (
            <Button type="button" disabled={!canNext()} onClick={goNext}
              className="rounded-full bg-[#0a0a0a] px-8 py-3 text-[15px] font-bold hover:bg-neutral-800 disabled:opacity-30">
              다음 →
            </Button>
          ) : (
            <Button type="button" disabled={loading} onClick={handleSubmit}
              className="rounded-full bg-[#C9A84C] px-10 py-3 text-[15px] font-bold text-[#0a0a0a] hover:bg-[#e8c96d] disabled:opacity-50">
              {loading ? "제출 중..." : "제출하기"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
