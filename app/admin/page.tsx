"use client";
import { useState } from "react";

const GAS_URL =
  "https://script.google.com/macros/s/AKfycbxN3NaaZpCPPZfH7gEJVOGnyzJp9kvH5KtTXBMh86gnp6OCxcFPN8dGaK7THmVQb9vJoQ/exec";

// ── 데이터 정의 ──────────────────────────────────────────────────────────────

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

type PainItem = { label: string; solution: string };
type PainCategory = { id: string; label: string; items: PainItem[] };

const PAIN_CATEGORIES_A: PainCategory[] = [
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

const PAIN_CATEGORIES_B: PainCategory[] = [
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

const PAIN_CATEGORIES_COMMON: PainCategory[] = [
  { id: "pc_analytics", label: "데이터·성과 분석", items: [
    { label: "수익·매출 데이터 시각화 없음", solution: "실시간 매출 대시보드" },
    { label: "업무별 시간 소요 파악 안 됨", solution: "업무 효율 분석 리포트" },
  ]},
];

// ── 스타일 ──────────────────────────────────────────────────────────────────

const pillBase = "inline-flex cursor-pointer select-none items-center rounded-full border px-3.5 py-1.5 text-[12px] font-medium transition-all";
const pillOff = `${pillBase} border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400`;
const pillOn = `${pillBase} border-[#C9A84C] bg-[#C9A84C]/10 text-[#0a0a0a] ring-1 ring-[#C9A84C]/30 font-bold`;

const inputClass = "w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-[14px] text-neutral-800 placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] transition";

// ── 메인 ──────────────────────────────────────────────────────────────────────

export default function SurveyPage() {
  const [bizType, setBizType] = useState("");
  const [org, setOrg] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [scale, setScale] = useState("");
  const [instructors, setInstructors] = useState("");
  const [staff, setStaff] = useState("");
  const [duration, setDuration] = useState("");
  const [tools, setTools] = useState<string[]>([]);
  const [pains, setPains] = useState<string[]>([]);
  const [buildBudget, setBuildBudget] = useState("");
  const [maintBudget, setMaintBudget] = useState("");
  const [startTiming, setStartTiming] = useState("");
  const [memo, setMemo] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  const isB = bizType === "online" || bizType === "creator";
  const toolCats = [...(isB ? TOOL_CATEGORIES_B : TOOL_CATEGORIES_A), ...TOOL_CATEGORIES_COMMON];
  const painCats = [...(isB ? PAIN_CATEGORIES_B : PAIN_CATEGORIES_A), ...PAIN_CATEGORIES_COMMON];

  const toggleTool = (catId: string, opt: string) => {
    const key = `${catId}::${opt}`;
    setTools((prev) => prev.includes(key) ? prev.filter((t) => t !== key) : [...prev, key]);
  };

  const togglePain = (label: string) => {
    setPains((prev) => prev.includes(label) ? prev.filter((p) => p !== label) : [...prev, label]);
  };

  const canSubmit = bizType && org && name && phone && pains.length > 0;

  async function handleSubmit() {
    if (!canSubmit) return;
    setStatus("sending");
    const ts = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
    const bizLabel = BIZ_TYPES.find((t) => t.id === bizType)?.label ?? bizType;
    const toolsStr = toolCats.map((cat) => {
      const picked = tools.filter((t) => t.startsWith(`${cat.id}::`)).map((t) => t.replace(`${cat.id}::`, ""));
      return picked.length ? `[${cat.label}] ${picked.join(", ")}` : null;
    }).filter(Boolean).join(" / ");
    const painsStr = painCats.map((cat) => {
      const picked = pains.filter((p) => cat.items.some((item) => item.label === p));
      return picked.length ? `[${cat.label}] ${picked.join(", ")}` : null;
    }).filter(Boolean).join(" / ");

    const payload = JSON.stringify({
      action: "append", sheet: "설문_응답",
      values: [
        ts, bizLabel, org, name, phone, email,
        scale, instructors ? `${instructors}명` : "0명", staff ? `${staff}명` : "0명", duration,
        toolsStr, painsStr, buildBudget, maintBudget, startTiming, memo,
      ],
    });
    try {
      await fetch(`${GAS_URL}?payload=${encodeURIComponent(payload)}`, { method: "GET", mode: "no-cors" });
      setStatus("done");
    } catch {
      alert("전송 중 오류가 발생했습니다.");
      setStatus("idle");
    }
  }

  if (status === "done") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f8f6] px-6">
        <div className="max-w-md text-center">
          <div className="mb-4 text-5xl">✅</div>
          <h1 className="mb-2 text-[24px] font-black text-[#0a0a0a]">제출 완료</h1>
          <p className="mb-8 text-[14px] text-neutral-500">
            응답이 정상적으로 기록되었습니다.<br />빠른 시일 내에 연락드리겠습니다.
          </p>
          <button onClick={() => { setStatus("idle"); setBizType(""); setOrg(""); setName(""); setPhone(""); setEmail(""); setScale(""); setInstructors(""); setStaff(""); setDuration(""); setTools([]); setPains([]); setBuildBudget(""); setMaintBudget(""); setStartTiming(""); setMemo(""); }}
            className="rounded-full bg-[#0a0a0a] px-8 py-3 text-[14px] font-bold text-white hover:bg-neutral-800 transition">
            새 응답 작성
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f6] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-[720px]">

        {/* Header */}
        <div className="mb-10 text-center">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#C9A84C]">PENTA LAB</p>
          <h1 className="text-[26px] font-black tracking-[-0.03em] text-[#0a0a0a] sm:text-[32px]">교육 사업 진단 설문</h1>
          <p className="mt-2 text-[14px] text-neutral-400">3분이면 충분합니다. 현재 운영 현황을 알려주세요.</p>
        </div>

        <div className="flex flex-col gap-8">

          {/* ─── 1. 사업 유형 ─── */}
          <section className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-7">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#C9A84C] text-[12px] font-black text-white">1</span>
              <h2 className="text-[16px] font-extrabold text-[#0a0a0a]">어떤 사업을 운영하고 계신가요?</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {BIZ_TYPES.map((t) => (
                <button key={t.id} onClick={() => setBizType(t.id)}
                  className={`rounded-xl border p-4 text-left transition-all ${
                    bizType === t.id
                      ? "border-[#C9A84C] bg-[#C9A84C]/5 ring-1 ring-[#C9A84C]/30"
                      : "border-neutral-200 bg-neutral-50 hover:border-neutral-300"
                  }`}>
                  <div className="mb-1 text-[20px]">{t.icon}</div>
                  <div className={`text-[13px] font-bold ${bizType === t.id ? "text-[#0a0a0a]" : "text-neutral-700"}`}>{t.label}</div>
                  <div className="mt-1 text-[11px] text-neutral-400">{t.desc}</div>
                </button>
              ))}
            </div>
          </section>

          {/* ─── 2. 기본 정보 ─── */}
          <section className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-7">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#C9A84C] text-[12px] font-black text-white">2</span>
              <h2 className="text-[16px] font-extrabold text-[#0a0a0a]">기본 정보를 알려주세요</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[12px] font-bold text-neutral-500">기관명 / 채널명 <span className="text-red-400">*</span></label>
                <input type="text" value={org} onChange={(e) => setOrg(e.target.value)} placeholder="ex. 우리학원" className={inputClass} />
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-bold text-neutral-500">담당자 성함 <span className="text-red-400">*</span></label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="홍길동" className={inputClass} />
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-bold text-neutral-500">연락처 <span className="text-red-400">*</span></label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="010-0000-0000" className={inputClass} />
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-bold text-neutral-500">이메일 <span className="text-neutral-300">선택</span></label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@email.com" className={inputClass} />
              </div>
            </div>
          </section>

          {/* ─── 3. 규모 & 현황 ─── */}
          <section className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-7">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#C9A84C] text-[12px] font-black text-white">3</span>
              <h2 className="text-[16px] font-extrabold text-[#0a0a0a]">현재 규모와 운영 현황</h2>
            </div>
            <div className="flex flex-col gap-6">
              {/* 규모 */}
              <div>
                <div className="mb-2 text-[13px] font-bold text-neutral-600">수강생·원생 수</div>
                <div className="flex flex-wrap gap-2">
                  {["~30명", "30~80명", "80~200명", "200명~", "아직 없음"].map((o) => (
                    <button key={o} onClick={() => setScale(o)} className={scale === o ? pillOn : pillOff}>{o}</button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-[12px] font-bold text-neutral-500">강사 수 <span className="font-normal text-neutral-400">(본인 외)</span></label>
                  <input type="number" min="0" value={instructors} onChange={(e) => setInstructors(e.target.value)} placeholder="0" className={inputClass} />
                </div>
                <div>
                  <label className="mb-1.5 block text-[12px] font-bold text-neutral-500">스태프 수</label>
                  <input type="number" min="0" value={staff} onChange={(e) => setStaff(e.target.value)} placeholder="0" className={inputClass} />
                </div>
                <div>
                  <label className="mb-1.5 block text-[12px] font-bold text-neutral-500">운영 기간</label>
                  <div className="flex flex-wrap gap-1.5">
                    {["준비 중", "1년 미만", "1~3년", "3년~"].map((o) => (
                      <button key={o} onClick={() => setDuration(o)} className={duration === o ? pillOn : pillOff}>{o}</button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 도구 */}
              <div>
                <div className="mb-3 text-[13px] font-bold text-neutral-600">현재 사용 중인 도구 <span className="font-normal text-neutral-400">해당하는 항목 모두 선택</span></div>
                {bizType && (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {toolCats.map((cat) => (
                      <div key={cat.id} className="rounded-xl border border-neutral-100 bg-neutral-50 p-4">
                        <div className="mb-2 text-[12px] font-bold text-neutral-700">{cat.label}</div>
                        <div className="flex flex-wrap gap-1.5">
                          {cat.options.map((o) => {
                            const key = `${cat.id}::${o}`;
                            return (
                              <button key={o} onClick={() => toggleTool(cat.id, o)}
                                className={tools.includes(key) ? pillOn : pillOff}>
                                {o}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {!bizType && (
                  <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-6 text-center text-[13px] text-neutral-400">
                    위에서 사업 유형을 먼저 선택해주세요
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ─── 4. 페인포인트 ─── */}
          <section className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-7">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#C9A84C] text-[12px] font-black text-white">4</span>
              <h2 className="text-[16px] font-extrabold text-[#0a0a0a]">지금 가장 아픈 문제는? <span className="text-[13px] font-normal text-neutral-400">해당 항목 모두 선택</span></h2>
            </div>
            {bizType ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {painCats.map((cat) => (
                  <div key={cat.id} className="rounded-xl border border-neutral-100 bg-neutral-50 p-4">
                    <div className="mb-3 text-[12px] font-bold text-neutral-700">{cat.label}</div>
                    <div className="flex flex-col gap-2">
                      {cat.items.map((p) => {
                        const on = pains.includes(p.label);
                        return (
                          <button key={p.label} onClick={() => togglePain(p.label)}
                            className={`w-full rounded-xl border p-3 text-left transition-all ${
                              on
                                ? "border-[#C9A84C] bg-[#C9A84C]/5"
                                : "border-neutral-200 bg-white hover:border-neutral-300"
                            }`}>
                            <div className={`text-[12px] font-semibold ${on ? "text-[#0a0a0a]" : "text-neutral-600"}`}>{p.label}</div>
                            <div className="mt-0.5 text-[11px] text-[#C9A84C]">→ {p.solution}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-6 text-center text-[13px] text-neutral-400">
                위에서 사업 유형을 먼저 선택해주세요
              </div>
            )}
          </section>

          {/* ─── 5. 예산 & 시점 ─── */}
          <section className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-7">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#C9A84C] text-[12px] font-black text-white">5</span>
              <h2 className="text-[16px] font-extrabold text-[#0a0a0a]">예산과 시작 시점</h2>
            </div>
            <div className="flex flex-col gap-5">
              <div>
                <div className="mb-2 text-[13px] font-bold text-neutral-600">초기 제작비 예산</div>
                <div className="flex flex-wrap gap-2">
                  {["~500만원", "500만~1,500만원", "1,500만~3,000만원", "3,000만원~", "아직 모름"].map((o) => (
                    <button key={o} onClick={() => setBuildBudget(o)} className={buildBudget === o ? pillOn : pillOff}>{o}</button>
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-2 text-[13px] font-bold text-neutral-600">월 유지보수 예산</div>
                <div className="flex flex-wrap gap-2">
                  {["~30만원/월", "30~80만원/월", "80~200만원/월", "협의 필요"].map((o) => (
                    <button key={o} onClick={() => setMaintBudget(o)} className={maintBudget === o ? pillOn : pillOff}>{o}</button>
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-2 text-[13px] font-bold text-neutral-600">원하는 착수 시점</div>
                <div className="flex flex-wrap gap-2">
                  {["가능한 빨리", "1개월 내", "3개월 내", "아직 탐색 중"].map((o) => (
                    <button key={o} onClick={() => setStartTiming(o)} className={startTiming === o ? pillOn : pillOff}>{o}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-[13px] font-bold text-neutral-600">추가 요청사항 <span className="font-normal text-neutral-400">선택</span></label>
                <textarea value={memo} onChange={(e) => setMemo(e.target.value)} rows={3}
                  placeholder="현재 쓰는 시스템, 원하는 기능, 레퍼런스 사이트 등 자유롭게"
                  className={`${inputClass} resize-none`} />
              </div>
            </div>
          </section>

          {/* ─── 제출 ─── */}
          <div className="pb-10 text-center">
            <button onClick={handleSubmit} disabled={!canSubmit || status === "sending"}
              className="rounded-full bg-[#C9A84C] px-12 py-4 text-[16px] font-bold text-[#0a0a0a] transition hover:bg-[#e8c96d] disabled:opacity-30">
              {status === "sending" ? "제출 중..." : "제출하기"}
            </button>
            {!canSubmit && (
              <p className="mt-3 text-[12px] text-neutral-400">
                사업 유형, 기본 정보(기관명·성함·연락처), 페인포인트 1개 이상 선택이 필요합니다
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
