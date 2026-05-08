"use client";
import { useState } from "react";

const GAS_URL =
  "https://script.google.com/macros/s/AKfycbxN3NaaZpCPPZfH7gEJVOGnyzJp9kvH5KtTXBMh86gnp6OCxcFPN8dGaK7THmVQb9vJoQ/exec";

const BIZ_TYPES = [
  { id: "offline", icon: "🏫", label: "오프라인 학원", desc: "대면 수업 중심의 학원 운영" },
  { id: "online", icon: "💻", label: "온라인 교육 사업자", desc: "Zoom·영상 강의 등 비대면 수업" },
  { id: "franchise", icon: "🏢", label: "프랜차이즈 본사", desc: "가맹점을 보유하거나 확장 준비 중" },
  { id: "creator", icon: "📱", label: "콘텐츠 크리에이터", desc: "유튜브·인스타 등 채널 기반 사업자" },
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

type AdminPain = { label: string; solution: string };
type AdminPainCategory = { id: string; label: string; items: AdminPain[] };

const PAIN_CATEGORIES_A: AdminPainCategory[] = [
  { id: "pa_comm", label: "학부모·학생 소통", items: [
    { label: "상담 문의 늦게 답해 이탈", solution: "카카오 AI 챗봇 + 자동 응대" },
    { label: "학부모 알림·리포트 수작업", solution: "알림톡 자동화 + 주간 리포트" },
    { label: "상담 이력·DB 없음", solution: "상담 CRM + 이력 관리 시스템" },
  ]},
  { id: "pa_student", label: "출결·학생 관리", items: [
    { label: "출결·보강 스케줄 수작업", solution: "출결·보강 관리 시스템" },
    { label: "학생 성취도 추적 부재", solution: "성취도 트래킹 대시보드" },
    { label: "이탈 학생 미리 못 잡음", solution: "이탈 예측 + 선제 케어 알림" },
    { label: "등하원 안전 알림 미비", solution: "등하원 안전 알림 자동화" },
  ]},
  { id: "pa_payment", label: "수납·결제", items: [
    { label: "원비 미납 수작업 관리", solution: "미납 자동 감지 + 알림톡 독촉" },
    { label: "세무·회계 수작업", solution: "매출·지출 자동 분류" },
  ]},
  { id: "pa_staff", label: "강사·스태프 소통", items: [
    { label: "강사 채용·이탈 문제", solution: "강사 계약·정산 자동화" },
    { label: "강사 정산·계약 수작업", solution: "강사 계약·정산 자동화" },
  ]},
  { id: "pa_consult", label: "상담·등록", items: [
    { label: "신규 등록 프로세스 비효율", solution: "자동 예약 + 등록 파이프라인" },
    { label: "재등록률 관리 안 됨", solution: "재등록 알림 + 리텐션 자동화" },
  ]},
  { id: "pa_marketing", label: "마케팅·홍보", items: [
    { label: "블로그·SNS 마케팅 못 함", solution: "블로그·인스타 자동 콘텐츠 생성" },
    { label: "리뷰·평판 모니터링 없음", solution: "리뷰 모니터링 + 대응 시스템" },
    { label: "가맹·2호점 확장이 막힘", solution: "프랜차이즈 준비 패키지" },
  ]},
];

const PAIN_CATEGORIES_B: AdminPainCategory[] = [
  { id: "pb_comm", label: "수강생 소통", items: [
    { label: "알림·공지 수동 발송", solution: "자동 알림 + 공지 시스템" },
    { label: "수강생 문의 대응 수작업", solution: "AI 챗봇 + 자동 응대" },
  ]},
  { id: "pb_class", label: "강의 진행", items: [
    { label: "수업 예약·스케줄 관리", solution: "자동 예약 + 노쇼 알림" },
    { label: "수강생 진도 추적 안 됨", solution: "진도 트래킹 대시보드" },
  ]},
  { id: "pb_content", label: "콘텐츠 제작·편집", items: [
    { label: "콘텐츠 업로드 파이프라인 없음", solution: "LMS + 콘텐츠 라이브러리" },
    { label: "홍보 콘텐츠 자동화 안 됨", solution: "AI 콘텐츠 자동 생성 파이프라인" },
  ]},
  { id: "pb_sell", label: "강의 판매·배포", items: [
    { label: "수강생 CRM·관리가 없음", solution: "수강생 CRM 파이프라인" },
    { label: "이탈 수강생 감지 못 함", solution: "이탈 예측 + 리텐션 자동화" },
  ]},
  { id: "pb_payment", label: "결제·정산", items: [
    { label: "결제·환불 수작업", solution: "결제 자동화 + 환불 처리" },
    { label: "멤버십·구독 관리 어려움", solution: "구독·멤버십 관리 시스템" },
  ]},
  { id: "pb_marketing", label: "마케팅·퍼널", items: [
    { label: "유입→전환 퍼널 추적 안 됨", solution: "퍼널 분석 + 전환 최적화" },
    { label: "SNS 광고 성과 추적 안 됨", solution: "광고 성과 대시보드" },
  ]},
];

const PAIN_CATEGORIES_COMMON: AdminPainCategory[] = [
  { id: "pc_analytics", label: "데이터·성과 분석", items: [
    { label: "수익·매출 데이터 시각화 없음", solution: "실시간 매출 대시보드" },
    { label: "업무별 시간 소요 파악 안 됨", solution: "업무 효율 분석 리포트" },
  ]},
];

const SECTIONS = [
  { id: "step1", label: "Step 1 · 기관 유형" },
  { id: "step2", label: "Step 2 · 기본 정보" },
  { id: "step3", label: "Step 3 · 규모 & 현황" },
  { id: "step4a", label: "Step 4 · 페인포인트 (Track A — 오프라인)" },
  { id: "step4b", label: "Step 4 · 페인포인트 (Track B — 온라인)" },
  { id: "step5", label: "Step 5 · 예산 & 착수 시점" },
  { id: "done", label: "완료 페이지" },
];

const pill = "inline-block rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-[12px] font-medium text-neutral-700";
const badge = "inline-block rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-bold text-neutral-500";

// ── 구조 보기 ──────────────────────────────────────────────────────────────────

function StructureView() {
  return (
    <div className="flex flex-col gap-6">
      {/* Step 1 */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-7">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#C9A84C] text-[12px] font-black text-white">1</span>
          <h2 className="text-[17px] font-extrabold text-[#0a0a0a]">어떤 사업을 운영하고 계신가요?</h2>
          <span className={badge}>단일 선택 · 자동 진행</span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {BIZ_TYPES.map((t) => (
            <div key={t.id} className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
              <div className="mb-1 text-[20px]">{t.icon}</div>
              <div className="text-[13px] font-bold text-[#0a0a0a]">{t.label}</div>
              <div className="mt-1 text-[11px] text-neutral-400">{t.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Step 2 */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-7">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#C9A84C] text-[12px] font-black text-white">2</span>
          <h2 className="text-[17px] font-extrabold text-[#0a0a0a]">기본 정보를 알려주세요</h2>
          <span className={badge}>텍스트 입력</span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "기관명 / 채널명", required: true, placeholder: "ex. 우리학원" },
            { label: "담당자 성함", required: true, placeholder: "홍길동" },
            { label: "연락처", required: true, placeholder: "010-0000-0000" },
            { label: "이메일", required: false, placeholder: "example@email.com" },
          ].map((f) => (
            <div key={f.label} className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
              <div className="text-[12px] font-bold text-neutral-500">
                {f.label}
                {f.required
                  ? <span className="ml-1 text-red-400">*필수</span>
                  : <span className="ml-1 text-neutral-300">선택</span>}
              </div>
              <div className="mt-1.5 text-[12px] text-neutral-400">{f.placeholder}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Step 3 */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-7">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#C9A84C] text-[12px] font-black text-white">3</span>
          <h2 className="text-[17px] font-extrabold text-[#0a0a0a]">현재 규모와 운영 현황</h2>
          <span className={badge}>선택 + 숫자 입력 + 도구 선택</span>
        </div>
        <div className="flex flex-col gap-8">

          {/* 규모 + 인원 */}
          <div className="flex flex-col gap-5">
            <div>
              <div className="mb-1 text-[13px] font-bold text-neutral-600">수강생·원생 수</div>
              <div className="mb-2 text-[11px] text-neutral-400">오프라인/프랜차이즈→원생 수 / 온라인→수강생 수 / 크리에이터→구독자·수강생 수</div>
              <div className="flex flex-wrap gap-2">
                {["~30명", "30~80명", "80~200명", "200명~", "아직 없음"].map((o) => <span key={o} className={pill}>{o}</span>)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div>
                <div className="mb-1 text-[13px] font-bold text-neutral-600">강사 수 <span className="font-normal text-neutral-400 text-[11px]">본인 외 매출 발생 강사</span></div>
                <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-2.5 text-[12px] text-neutral-400">숫자 직접 입력 (0명 가능)</div>
              </div>
              <div>
                <div className="mb-1 text-[13px] font-bold text-neutral-600">스태프 수 <span className="font-normal text-neutral-400 text-[11px]">운영 보조 인원</span></div>
                <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-2.5 text-[12px] text-neutral-400">숫자 직접 입력 (0명 가능)</div>
              </div>
              <div>
                <div className="mb-1 text-[13px] font-bold text-neutral-600">운영 기간</div>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {["준비 중", "1년 미만", "1~3년", "3년~"].map((o) => <span key={o} className={pill}>{o}</span>)}
                </div>
              </div>
            </div>
          </div>

          {/* 도구 카테고리 — Track A */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-full bg-[#0a0a0a] px-2.5 py-0.5 text-[11px] font-bold text-white">Track A</span>
              <span className="text-[12px] text-neutral-500">오프라인 학원 + 프랜차이즈</span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {TOOL_CATEGORIES_A.map((cat) => (
                <div key={cat.id} className="rounded-xl border border-neutral-100 bg-neutral-50 p-4">
                  <div className="mb-2 text-[12px] font-bold text-neutral-700">{cat.label}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.options.map((o) => <span key={o} className={pill}>{o}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 도구 카테고리 — Track B */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-full bg-neutral-500 px-2.5 py-0.5 text-[11px] font-bold text-white">Track B</span>
              <span className="text-[12px] text-neutral-500">온라인 교육 사업자 + 크리에이터</span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {TOOL_CATEGORIES_B.map((cat) => (
                <div key={cat.id} className="rounded-xl border border-neutral-100 bg-neutral-50 p-4">
                  <div className="mb-2 text-[12px] font-bold text-neutral-700">{cat.label}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.options.map((o) => <span key={o} className={pill}>{o}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 도구 카테고리 — 공통 */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-full border border-[#C9A84C] px-2.5 py-0.5 text-[11px] font-bold text-[#C9A84C]">공통</span>
              <span className="text-[12px] text-neutral-500">Track A + B 모두 표시</span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {TOOL_CATEGORIES_COMMON.map((cat) => (
                <div key={cat.id} className="rounded-xl border border-neutral-100 bg-neutral-50 p-4">
                  <div className="mb-2 text-[12px] font-bold text-neutral-700">{cat.label}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.options.map((o) => <span key={o} className={pill}>{o}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Step 4 */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-7">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#C9A84C] text-[12px] font-black text-white">4</span>
          <h2 className="text-[17px] font-extrabold text-[#0a0a0a]">지금 가장 아픈 문제는?</h2>
          <span className={badge}>해당 항목 모두 선택 가능</span>
        </div>
        <div className="flex flex-col gap-8">

          {/* Track A */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-full bg-[#0a0a0a] px-2.5 py-0.5 text-[11px] font-bold text-white">Track A</span>
              <span className="text-[12px] text-neutral-500">오프라인 학원 + 프랜차이즈</span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {PAIN_CATEGORIES_A.map((cat) => (
                <div key={cat.id} className="rounded-xl border border-neutral-100 bg-neutral-50 p-4">
                  <div className="mb-2 text-[12px] font-bold text-neutral-700">{cat.label}</div>
                  <div className="flex flex-col gap-1.5">
                    {cat.items.map((p) => (
                      <div key={p.label}>
                        <div className="text-[12px] font-semibold text-[#0a0a0a]">{p.label}</div>
                        <div className="text-[11px] text-[#C9A84C]">→ {p.solution}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Track B */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-full bg-neutral-500 px-2.5 py-0.5 text-[11px] font-bold text-white">Track B</span>
              <span className="text-[12px] text-neutral-500">온라인 교육 사업자 + 크리에이터</span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {PAIN_CATEGORIES_B.map((cat) => (
                <div key={cat.id} className="rounded-xl border border-neutral-100 bg-neutral-50 p-4">
                  <div className="mb-2 text-[12px] font-bold text-neutral-700">{cat.label}</div>
                  <div className="flex flex-col gap-1.5">
                    {cat.items.map((p) => (
                      <div key={p.label}>
                        <div className="text-[12px] font-semibold text-[#0a0a0a]">{p.label}</div>
                        <div className="text-[11px] text-[#C9A84C]">→ {p.solution}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 공통 */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-full border border-[#C9A84C] px-2.5 py-0.5 text-[11px] font-bold text-[#C9A84C]">공통</span>
              <span className="text-[12px] text-neutral-500">Track A + B 모두 표시</span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {PAIN_CATEGORIES_COMMON.map((cat) => (
                <div key={cat.id} className="rounded-xl border border-neutral-100 bg-neutral-50 p-4">
                  <div className="mb-2 text-[12px] font-bold text-neutral-700">{cat.label}</div>
                  <div className="flex flex-col gap-1.5">
                    {cat.items.map((p) => (
                      <div key={p.label}>
                        <div className="text-[12px] font-semibold text-[#0a0a0a]">{p.label}</div>
                        <div className="text-[11px] text-[#C9A84C]">→ {p.solution}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Step 5 */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-7">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#C9A84C] text-[12px] font-black text-white">5</span>
          <h2 className="text-[17px] font-extrabold text-[#0a0a0a]">예산과 시작 시점</h2>
          <span className={badge}>단일 선택</span>
        </div>
        <div className="flex flex-col gap-5">
          {[
            { label: "초기 제작비 예산", options: ["~500만원", "500만~1,500만원", "1,500만~3,000만원", "3,000만원~", "아직 모름"] },
            { label: "월 유지보수 예산", options: ["~30만원/월", "30~80만원/월", "80~200만원/월", "협의 필요"] },
            { label: "원하는 착수 시점", options: ["가능한 빨리", "1개월 내", "3개월 내", "아직 탐색 중"] },
          ].map((row) => (
            <div key={row.label}>
              <div className="mb-2 text-[13px] font-bold text-neutral-600">{row.label}</div>
              <div className="flex flex-wrap gap-2">
                {row.options.map((o) => <span key={o} className={pill}>{o}</span>)}
              </div>
            </div>
          ))}
          <div>
            <div className="mb-2 text-[13px] font-bold text-neutral-600">추가 요청사항 <span className="font-normal text-neutral-400">자유 기술, 선택</span></div>
            <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-3 text-[12px] text-neutral-400">
              현재 쓰는 시스템, 원하는 기능, 레퍼런스 사이트 등 자유롭게
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="rounded-2xl border border-[#C9A84C]/20 bg-[#C9A84C]/5 p-6">
        <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#C9A84C]">수집 정보 요약</p>
        <div className="flex flex-wrap gap-x-8 gap-y-1 text-[13px] text-neutral-600">
          <span>시트: <strong className="text-neutral-800">설문_응답</strong></span>
          <span>총 필드: <strong className="text-neutral-800">15개</strong></span>
          <span>Track A 선택지: <strong className="text-neutral-800">12개</strong></span>
          <span>Track B 선택지: <strong className="text-neutral-800">10개</strong></span>
        </div>
      </div>
    </div>
  );
}

// ── 수정 요청 ──────────────────────────────────────────────────────────────────

type RequestItem = { section: string; type: string; content: string; memo: string };

function EditRequestView() {
  const [requests, setRequests] = useState<RequestItem[]>([
    { section: "", type: "", content: "", memo: "" },
  ]);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const update = (i: number, key: keyof RequestItem, val: string) => {
    setRequests((prev) => prev.map((r, idx) => idx === i ? { ...r, [key]: val } : r));
  };

  const addRow = () => setRequests((p) => [...p, { section: "", type: "", content: "", memo: "" }]);
  const removeRow = (i: number) => setRequests((p) => p.filter((_, idx) => idx !== i));

  const submit = async () => {
    const valid = requests.filter((r) => r.section && r.type && r.content);
    if (valid.length === 0) return;
    setStatus("sending");
    try {
      await fetch(GAS_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sheet: "수정요청",
          rows: valid.map((r) => ({
            타임스탬프: new Date().toLocaleString("ko-KR"),
            섹션: r.section,
            수정유형: r.type,
            수정내용: r.content,
            추가메모: r.memo,
          })),
        }),
      });
      setStatus("done");
      setRequests([{ section: "", type: "", content: "", memo: "" }]);
    } catch {
      setStatus("error");
    }
  };

  const TYPE_OPTIONS = ["항목 추가", "항목 삭제", "텍스트 수정", "순서 변경", "선택지 변경", "기타"];

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-neutral-200 bg-white p-7">
        <p className="mb-1 text-[13px] font-bold text-neutral-700">수정 요청 작성</p>
        <p className="mb-7 text-[13px] text-neutral-400">
          섹션별로 수정할 내용을 작성하고 제출하면 Google Sheets <strong className="text-neutral-600">수정요청</strong> 탭에 기록됩니다.
        </p>

        <div className="flex flex-col gap-4">
          {requests.map((r, i) => (
            <div key={i} className="relative rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
              {requests.length > 1 && (
                <button
                  onClick={() => removeRow(i)}
                  className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-200 text-[12px] text-neutral-500 hover:bg-red-100 hover:text-red-500 transition"
                >
                  ✕
                </button>
              )}

              <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* 섹션 */}
                <div>
                  <label className="mb-1.5 block text-[12px] font-bold text-neutral-500">섹션 *</label>
                  <select
                    value={r.section}
                    onChange={(e) => update(i, "section", e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-[13px] text-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                  >
                    <option value="">선택하세요</option>
                    {SECTIONS.map((s) => (
                      <option key={s.id} value={s.label}>{s.label}</option>
                    ))}
                  </select>
                </div>

                {/* 수정 유형 */}
                <div>
                  <label className="mb-1.5 block text-[12px] font-bold text-neutral-500">수정 유형 *</label>
                  <select
                    value={r.type}
                    onChange={(e) => update(i, "type", e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-[13px] text-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                  >
                    <option value="">선택하세요</option>
                    {TYPE_OPTIONS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 수정 내용 */}
              <div className="mb-3">
                <label className="mb-1.5 block text-[12px] font-bold text-neutral-500">수정 내용 *</label>
                <textarea
                  value={r.content}
                  onChange={(e) => update(i, "content", e.target.value)}
                  placeholder={
                    r.type === "항목 추가" ? "ex. '계절학기 운영' 항목 추가해주세요" :
                    r.type === "항목 삭제" ? "ex. '등하원 안전 알림 미비' 항목 삭제해주세요" :
                    r.type === "텍스트 수정" ? "ex. '원비 미납 수작업 관리' → '원비 미납 처리 자동화'" :
                    "수정할 내용을 구체적으로 적어주세요"
                  }
                  rows={3}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-[13px] text-neutral-700 placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] resize-none"
                />
              </div>

              {/* 추가 메모 */}
              <div>
                <label className="mb-1.5 block text-[12px] font-bold text-neutral-500">추가 메모 <span className="font-normal text-neutral-300">선택</span></label>
                <input
                  type="text"
                  value={r.memo}
                  onChange={(e) => update(i, "memo", e.target.value)}
                  placeholder="이유, 참고 사항 등"
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-[13px] text-neutral-700 placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                />
              </div>
            </div>
          ))}
        </div>

        {/* 항목 추가 */}
        <button
          onClick={addRow}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-neutral-300 py-3 text-[13px] font-semibold text-neutral-400 hover:border-[#C9A84C] hover:text-[#C9A84C] transition"
        >
          + 수정 항목 추가
        </button>
      </div>

      {/* 제출 */}
      <div className="flex items-center gap-4">
        <button
          onClick={submit}
          disabled={status === "sending" || status === "done"}
          className="rounded-full bg-[#0a0a0a] px-8 py-3.5 text-[14px] font-bold text-white transition hover:bg-neutral-800 disabled:opacity-40"
        >
          {status === "sending" ? "전송 중..." : status === "done" ? "전송 완료 ✓" : "수정 요청 제출"}
        </button>
        {status === "done" && (
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-neutral-500">Sheets <strong>수정요청</strong> 탭에 기록되었습니다.</span>
            <button
              onClick={() => setStatus("idle")}
              className="text-[12px] text-[#C9A84C] underline underline-offset-2"
            >
              새 요청 작성
            </button>
          </div>
        )}
        {status === "error" && (
          <span className="text-[13px] text-red-500">전송 실패 — 다시 시도해주세요</span>
        )}
      </div>

      {/* 시트 바로가기 */}
      <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-5">
        <p className="mb-1 text-[12px] font-bold text-neutral-500">제출된 수정 요청 확인</p>
        <a
          href="https://docs.google.com/spreadsheets/d/1pdW8Xif8ZA75UbkAAbnn02wosNbO5kNnmuJ462E-nqw/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[13px] font-semibold text-[#C9A84C] underline underline-offset-2 hover:text-[#b8923f] transition"
        >
          Google Sheets → 수정요청 탭 열기 →
        </a>
      </div>
    </div>
  );
}

// ── 메인 ──────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [tab, setTab] = useState<"structure" | "edit">("structure");

  return (
    <div className="min-h-screen bg-[#f8f8f6] px-6 py-12">
      <div className="mx-auto max-w-[960px]">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#C9A84C]">PENTALAB ADMIN</p>
            <h1 className="mt-1 text-[28px] font-black tracking-[-0.03em] text-[#0a0a0a]">설문 관리자 페이지</h1>
          </div>
          <a
            href="https://docs.google.com/spreadsheets/d/1pdW8Xif8ZA75UbkAAbnn02wosNbO5kNnmuJ462E-nqw/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#0a0a0a] px-5 py-2.5 text-[13px] font-bold text-white hover:bg-neutral-800 transition"
          >
            답변 시트 열기 →
          </a>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-1 rounded-2xl border border-neutral-200 bg-white p-1.5 w-fit">
          {[
            { key: "structure", label: "구조 보기" },
            { key: "edit", label: "수정 요청" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as "structure" | "edit")}
              className={`rounded-xl px-6 py-2.5 text-[14px] font-semibold transition ${
                tab === t.key
                  ? "bg-[#0a0a0a] text-white"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "structure" ? <StructureView /> : <EditRequestView />}
      </div>
    </div>
  );
}
