"use client";
import { useState, useEffect, useCallback } from "react";
import dalcomData from "@/data/respondents/dalcom-kim.json";

// ── respondent lookup ────────────────────────────────────────────────────────
const RESPONDENTS: Record<string, typeof dalcomData> = {
  "dalcom-kim": dalcomData,
};

// ── GAS endpoint ─────────────────────────────────────────────────────────────
const GAS_URL =
  "https://script.google.com/macros/s/AKfycbxN3NaaZpCPPZfH7gEJVOGnyzJp9kvH5KtTXBMh86gnp6OCxcFPN8dGaK7THmVQb9vJoQ/exec";

// ── styles ───────────────────────────────────────────────────────────────────
const pillBase = "inline-flex cursor-pointer select-none items-center rounded-full border px-3.5 py-1.5 text-[12px] font-medium transition-all";
const pillOff = `${pillBase} border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400`;
const pillOn = `${pillBase} border-[#C9A84C] bg-[#C9A84C]/10 text-[#0a0a0a] ring-1 ring-[#C9A84C]/30 font-bold`;
const inputClass = "w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-[14px] text-neutral-800 placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] transition";
const textareaClass = `${inputClass} resize-none`;
const labelClass = "mb-1.5 block text-[12px] font-bold text-neutral-500";
const questionClass = "mb-2 text-[13px] font-bold text-neutral-700";
const hintClass = "mb-3 text-[11px] text-neutral-400";
const sectionCard = "rounded-2xl border border-neutral-200 bg-white p-6 sm:p-7";

// ── section definitions ──────────────────────────────────────────────────────
const SECTIONS = [
  { key: "A", title: "시간 양화", desc: "스태프가 어디에 시간을 쓰는가" },
  { key: "B", title: "수강생 라이프사이클", desc: "수강생 흐름 양화" },
  { key: "C", title: "콘텐츠·홍보 워크플로우", desc: "콘텐츠 제작·발행 해부" },
  { key: "D", title: "결제·매출 흐름", desc: "매출 구조 파악" },
  { key: "E", title: "채널 데이터 추적", desc: "마케팅 채널 현황" },
  { key: "F", title: "의사결정 지표", desc: "이거 알면 결정이 달라진다" },
  { key: "G", title: "변화 수용도", desc: "새 시스템 도입 준비도" },
  { key: "M", title: "미팅 의향", desc: "다음 단계 안내" },
];

type Answers = Record<string, string | string[]>;

// ── main component ───────────────────────────────────────────────────────────
export default function DeepSurveyPage({ params }: { params: { id: string } }) {
  const respondent = RESPONDENTS[params.id];
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  const visibleSections = SECTIONS;

  // localStorage auto-save
  const storageKey = `deep-survey-${params.id}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try { setAnswers(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, [storageKey]);

  const updateAnswer = useCallback((key: string, value: string | string[]) => {
    setAnswers((prev) => {
      const next = { ...prev, [key]: value };
      localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    });
  }, [storageKey]);

  const toggleMulti = useCallback((key: string, option: string) => {
    setAnswers((prev) => {
      const arr = (prev[key] as string[]) || [];
      const next = arr.includes(option) ? arr.filter((v) => v !== option) : [...arr, option];
      const updated = { ...prev, [key]: next };
      localStorage.setItem(storageKey, JSON.stringify(updated));
      return updated;
    });
  }, [storageKey]);

  const a = (key: string) => (answers[key] as string) || "";
  const aArr = (key: string) => (answers[key] as string[]) || [];

  if (!respondent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f8f6] px-6">
        <div className="text-center">
          <h1 className="mb-2 text-[24px] font-black text-[#0a0a0a]">설문을 찾을 수 없습니다</h1>
          <p className="text-[14px] text-neutral-500">링크를 다시 확인해주세요.</p>
        </div>
      </div>
    );
  }

  // ── submit ─────────────────────────────────────────────────────────────────
  async function handleSubmit() {
    setStatus("sending");
    const ts = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
    const answersStr = Object.entries(answers)
      .filter(([, v]) => v && (typeof v === "string" ? v.trim() : v.length > 0))
      .map(([k, v]) => `[${k}] ${Array.isArray(v) ? v.join(", ") : v}`)
      .join(" / ");

    const payload = JSON.stringify({
      action: "append",
      sheet: "딥설문_응답",
      values: [ts, respondent.id, respondent.name, respondent.org, answersStr],
    });

    try {
      await fetch(`${GAS_URL}?payload=${encodeURIComponent(payload)}`, { method: "GET", mode: "no-cors" });
      localStorage.removeItem(storageKey);
      setStatus("done");
    } catch {
      alert("전송 중 오류가 발생했습니다. 다시 시도해주세요.");
      setStatus("idle");
    }
  }

  // ── done screen ────────────────────────────────────────────────────────────
  if (status === "done") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f8f6] px-6">
        <div className="max-w-md text-center">
          <h1 className="mb-2 text-[24px] font-black text-[#0a0a0a]">제출 완료</h1>
          <p className="mb-4 text-[14px] text-neutral-500">
            {respondent.name}님, 소중한 응답 감사합니다.<br />
            응답 기반 1:1 무료 진단 미팅을 준비해 연락드리겠습니다.
          </p>
          <p className="text-[13px] text-neutral-400">빠른 시일 내에 연락드리겠습니다.</p>
        </div>
      </div>
    );
  }

  const sec = visibleSections[currentSection];
  const progress = ((currentSection + 1) / visibleSections.length) * 100;

  // ── pill select helper ─────────────────────────────────────────────────────
  const PillSelect = ({ qKey, options }: { qKey: string; options: string[] }) => (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button key={o} onClick={() => updateAnswer(qKey, o)} className={a(qKey) === o ? pillOn : pillOff}>{o}</button>
      ))}
    </div>
  );

  const MultiSelect = ({ qKey, options }: { qKey: string; options: string[] }) => (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button key={o} onClick={() => toggleMulti(qKey, o)} className={aArr(qKey).includes(o) ? pillOn : pillOff}>{o}</button>
      ))}
    </div>
  );

  const Scale5 = ({ qKey, labels }: { qKey: string; labels: [string, string] }) => (
    <div className="flex items-center gap-2">
      <span className="text-[11px] text-neutral-400 w-16 text-right">{labels[0]}</span>
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} onClick={() => updateAnswer(qKey, String(n))}
            className={`h-9 w-9 rounded-full border text-[13px] font-bold transition-all ${
              a(qKey) === String(n) ? "border-[#C9A84C] bg-[#C9A84C] text-white" : "border-neutral-200 bg-white text-neutral-500 hover:border-neutral-400"
            }`}>{n}</button>
        ))}
      </div>
      <span className="text-[11px] text-neutral-400 w-16">{labels[1]}</span>
    </div>
  );

  const TextInput = ({ qKey, placeholder, rows }: { qKey: string; placeholder?: string; rows?: number }) =>
    rows ? (
      <textarea value={a(qKey)} onChange={(e) => updateAnswer(qKey, e.target.value)} rows={rows} placeholder={placeholder || "자유롭게 적어주세요"} className={`${textareaClass} text-[13px]`} />
    ) : (
      <input type="text" value={a(qKey)} onChange={(e) => updateAnswer(qKey, e.target.value)} placeholder={placeholder || "자유롭게 적어주세요"} className={`${inputClass} text-[13px]`} />
    );

  const Prefilled = ({ label, value }: { label: string; value: string }) => (
    <div className="rounded-lg bg-neutral-50 border border-neutral-100 px-4 py-2.5">
      <div className="text-[11px] text-neutral-400 mb-0.5">{label} (1차 응답)</div>
      <div className="text-[13px] text-neutral-600">{value}</div>
    </div>
  );

  // ── section renderers ──────────────────────────────────────────────────────
  function renderSection() {
    switch (sec.key) {
      case "A": return renderA();
      case "B": return renderB();
      case "C": return renderC();
      case "D": return renderD();
      case "E": return renderE();
      case "F": return renderF();
      case "G": return renderG();
      case "M": return renderM();
      default: return null;
    }
  }

  function renderA() {
    return (
      <div className="flex flex-col gap-6">
        <Prefilled label="스태프 수" value={respondent.staff} />
        {respondent.sectionNote && <Prefilled label="1차 응답 메모" value={respondent.sectionNote} />}

        <div>
          <div className={questionClass}>A1. 스태프의 주 평균 근무시간은?</div>
          <PillSelect qKey="A1" options={["10시간 미만", "10~20시간", "20~30시간", "30~40시간", "40시간 이상"]} />
        </div>

        <div>
          <div className={questionClass}>A2. 스태프 시간을 다음 작업에 각각 대략 몇 %로 쓰나요?</div>
          <div className={hintClass}>정확하지 않아도 됩니다. 체감 비중을 적어주세요.</div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {["문의응대", "결제확인", "매출정리", "콘텐츠발행", "강의자료준비", "기타"].map((task) => (
              <div key={task}>
                <label className={labelClass}>{task}</label>
                <input type="text" value={a(`A2_${task}`)} onChange={(e) => updateAnswer(`A2_${task}`, e.target.value)}
                  placeholder="예: 20%" className={`${inputClass} text-[13px]`} />
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className={questionClass}>A3. 스태프가 &ldquo;정리해서 알려주는&rdquo; 정보는 구체적으로 무엇인가요?</div>
          <MultiSelect qKey="A3" options={["매출", "신규등록", "문의건수", "출석/수강현황", "광고성과", "기타"]} />
          {aArr("A3").includes("기타") && <TextInput qKey="A3_etc" placeholder="기타 내용" />}
        </div>

        <div>
          <div className={questionClass}>A4. 본인이 강의 외 운영에 쓰는 시간은 주 몇 시간?</div>
          <PillSelect qKey="A4" options={["5시간 미만", "5~10시간", "10~20시간", "20시간 이상"]} />
        </div>

        <div>
          <div className={questionClass}>A5. &ldquo;이 시간만 줄어도 살겠다&rdquo;는 작업이 있다면?</div>
          <TextInput qKey="A5" placeholder="자유롭게 적어주세요 (선택)" />
        </div>
      </div>
    );
  }

  function renderB() {
    return (
      <div className="flex flex-col gap-6">
        <Prefilled label="수강생 수" value={respondent.students} />

        <div>
          <div className={questionClass}>B1. 200명+이 의미하는 것은?</div>
          <PillSelect qKey="B1" options={["동시 진행 인원", "누적 수강생", "월 활성 인원", "기타"]} />
          {a("B1") === "기타" && <TextInput qKey="B1_etc" placeholder="구체적으로" />}
        </div>

        <div>
          <div className={questionClass}>B2. 신규 vs 재등록 비율은 대략 어느 정도인가요?</div>
          <div className={hintClass}>정확하지 않아도 됩니다.</div>
          <PillSelect qKey="B2" options={["신규 위주 (80%+)", "신규 많음 (60~80%)", "반반", "재등록 많음 (60~80%)", "재등록 위주 (80%+)"]} />
        </div>

        <div>
          <div className={questionClass}>B3. 한 기수당 평균 인원은?</div>
          <PillSelect qKey="B3" options={["10명 미만", "10~30명", "30~50명", "50명 이상", "상시모집"]} />
        </div>

        <div>
          <div className={questionClass}>B4. 강좌 운영 형태는?</div>
          <PillSelect qKey="B4" options={["기수제", "상시모집", "혼합"]} />
        </div>

        <div>
          <div className={questionClass}>B5. 수강생이 처음 알게 된 후 등록까지 평균 며칠?</div>
          <PillSelect qKey="B5" options={["당일", "1주 이내", "1~4주", "1~3개월", "그 이상"]} />
        </div>

        <div>
          <div className={questionClass}>B6. 완강률은 체감으로 어느 정도?</div>
          <div className={hintClass}>정확하지 않아도 괜찮습니다.</div>
          <PillSelect qKey="B6" options={["30% 미만", "30~50%", "50~70%", "70~90%", "90% 이상", "모름"]} />
        </div>

        <div>
          <div className={questionClass}>B7. 환불·이탈이 주로 발생하는 시점은?</div>
          <PillSelect qKey="B7" options={["결제 직후", "1~2주차", "중반", "막판", "패턴 없음"]} />
        </div>
      </div>
    );
  }

  function renderC() {
    return (
      <div className="flex flex-col gap-6">
        <Prefilled label="사용 도구" value={`${Object.entries(respondent.tools).filter(([,v]) => !v.includes("없음")).map(([k,v]) => `${k}: ${v.join(", ")}`).join(" / ")}`} />

        <div>
          <div className={questionClass}>C1. 콘텐츠 1개 제작에 평균 얼마나 걸리나요?</div>
          <PillSelect qKey="C1" options={["10분 미만", "10~30분", "30분~1시간", "1~3시간", "3시간 이상"]} />
        </div>

        <div>
          <div className={questionClass}>C2. 미리캔버스와 Canva를 둘 다 쓰시는 이유가 있나요?</div>
          <PillSelect qKey="C2" options={["작업별 분리", "단순 병행", "협업자 선호", "기타"]} />
          {a("C2") === "기타" && <TextInput qKey="C2_etc" />}
        </div>

        <div>
          <div className={questionClass}>C3. 인스타그램 게시 빈도는?</div>
          <PillSelect qKey="C3" options={["주 1회 미만", "주 1~2회", "주 3~5회", "매일"]} />
        </div>

        <div>
          <div className={questionClass}>C4. 게시물 유형 비중은 대략? (체감)</div>
          <div className="grid grid-cols-2 gap-3">
            {["수업안내", "후기", "인사이트·콘텐츠", "일상"].map((t) => (
              <div key={t}>
                <label className={labelClass}>{t}</label>
                <input type="text" value={a(`C4_${t}`)} onChange={(e) => updateAnswer(`C4_${t}`, e.target.value)}
                  placeholder="예: 30%" className={`${inputClass} text-[13px]`} />
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className={questionClass}>C5. 콘텐츠 제작은 주로 누가?</div>
          <PillSelect qKey="C5" options={["본인 직접", "스태프 분담", "외주", "혼합"]} />
        </div>

        <div>
          <div className={questionClass}>C6. 인스타 → 카페·오픈채팅 유입 유도 방식은?</div>
          <MultiSelect qKey="C6" options={["프로필 링크", "게시물 CTA", "DM", "스토리", "별도 안 함"]} />
        </div>

        <div>
          <div className={questionClass}>C7. &ldquo;이 콘텐츠 작업만 자동화되면 좋겠다&rdquo; 1가지</div>
          <TextInput qKey="C7" placeholder="자유롭게 적어주세요 (선택)" />
        </div>
      </div>
    );
  }

  function renderD() {
    return (
      <div className="flex flex-col gap-6">
        <Prefilled label="결제·정산 도구" value={respondent.tools["결제·정산"]?.join(", ") || "-"} />
        <Prefilled label="강의 판매" value={respondent.tools["강의 판매·배포"]?.join(", ") || "-"} />

        <div>
          <div className={questionClass}>D1. 클래스101 vs 자체(계좌이체) 매출 비율은?</div>
          <PillSelect qKey="D1" options={["클래스101 위주 (80%+)", "클래스101 많음", "반반", "자체 많음", "자체 위주 (80%+)"]} />
        </div>

        <div>
          <div className={questionClass}>D2. 클래스101 수수료가 부담스러운가요?</div>
          <Scale5 qKey="D2" labels={["전혀", "매우"]} />
        </div>

        <div>
          <div className={questionClass}>D3. 계좌이체를 PG(토스/카카오페이 등)로 바꿀 의향이 있나요?</div>
          <PillSelect qKey="D3" options={["예", "아니오", "조건부"]} />
          {a("D3") === "조건부" && <TextInput qKey="D3_detail" placeholder="어떤 조건이라면?" />}
        </div>

        <div>
          <div className={questionClass}>D4. 환불·취소 빈도는 월 평균?</div>
          <PillSelect qKey="D4" options={["없음", "1~2건", "3~5건", "5건 이상"]} />
        </div>

        <div>
          <div className={questionClass}>D5. 매출 확인 주기는?</div>
          <PillSelect qKey="D5" options={["매일", "매주", "매월", "비정기"]} />
        </div>

        <div>
          <div className={questionClass}>D6. 세금계산서·현금영수증 발행은 어떻게 하고 계신가요?</div>
          <TextInput qKey="D6" placeholder="자유롭게 적어주세요 (선택)" rows={2} />
        </div>
      </div>
    );
  }

  function renderE() {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <div className={questionClass}>E1. 인스타 광고 월 예산은?</div>
          <PillSelect qKey="E1" options={["없음", "10만원 미만", "10~50만원", "50~100만원", "100만원 이상"]} />
        </div>

        <div>
          <div className={questionClass}>E2. 광고 효과를 측정하는 방법은?</div>
          <PillSelect qKey="E2" options={["인스타 통계만", "UTM 추적", "직접 매칭", "측정 안 함", "기타"]} />
          {a("E2") === "기타" && <TextInput qKey="E2_etc" />}
        </div>

        <div>
          <div className={questionClass}>E3. 네이버카페 회원 수는?</div>
          <PillSelect qKey="E3" options={["100명 미만", "100~500명", "500~1,000명", "1,000명 이상"]} />
        </div>

        <div>
          <div className={questionClass}>E4. 카카오 오픈채팅방 현황</div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>채팅방 수</label>
              <input type="text" value={a("E4_rooms")} onChange={(e) => updateAnswer("E4_rooms", e.target.value)} placeholder="예: 3개" className={`${inputClass} text-[13px]`} />
            </div>
            <div>
              <label className={labelClass}>총 인원 (대략)</label>
              <input type="text" value={a("E4_members")} onChange={(e) => updateAnswer("E4_members", e.target.value)} placeholder="예: 500명" className={`${inputClass} text-[13px]`} />
            </div>
          </div>
        </div>

        <div>
          <div className={questionClass}>E5. 가장 흔한 등록 경로 Top 1은?</div>
          <PillSelect qKey="E5" options={["인스타 → 카페 → 클래스101", "인스타 → DM → 직접결제", "입소문", "기타"]} />
          {a("E5") === "기타" && <TextInput qKey="E5_etc" />}
        </div>
      </div>
    );
  }

  function renderF() {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <div className={questionClass}>F1. 매일·매주 보고 싶은 숫자 Top 3을 선택해주세요</div>
          <div className={hintClass}>최대 3개 선택</div>
          <MultiSelect qKey="F1" options={["매출", "신규등록", "문의건수", "완강률", "채널별 유입", "환불률", "기타"]} />
        </div>

        <div>
          <div className={questionClass}>F2. 지금 알고 싶지만 못 보고 있는 정보 1개</div>
          <div className={hintClass}>가장 중요한 질문입니다. 편하게 적어주세요.</div>
          <TextInput qKey="F2" placeholder="예: 어떤 게시물에서 수강생이 유입됐는지" />
        </div>

        <div>
          <div className={questionClass}>F3. &ldquo;이 데이터 있었으면 다른 결정 했을 것&rdquo; 사례가 있다면?</div>
          <TextInput qKey="F3" placeholder="자유롭게 적어주세요 (선택)" rows={2} />
        </div>

        <div>
          <div className={questionClass}>F4. 의사결정 시 직관 vs 데이터 비중은?</div>
          <PillSelect qKey="F4" options={["직관 위주", "직관 약간 많음", "반반", "데이터 약간 많음", "데이터 위주"]} />
        </div>
      </div>
    );
  }

  function renderG() {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <div className={questionClass}>G1. 새 시스템 학습에 쓸 수 있는 시간은 주에 얼마나?</div>
          <PillSelect qKey="G1" options={["1시간 미만", "1~3시간", "3~5시간", "5시간 이상", "거의 없음"]} />
        </div>

        <div>
          <div className={questionClass}>G2. 스태프의 디지털 도구 적응력은?</div>
          <Scale5 qKey="G2" labels={["매우 낮음", "매우 높음"]} />
        </div>

        <div>
          <div className={questionClass}>G3. 과거 새 도구 도입 성공 사례가 있다면?</div>
          <TextInput qKey="G3" placeholder="예: 노션 도입 후 업무 정리가 편해졌다 (선택)" />
        </div>

        <div>
          <div className={questionClass}>G4. 과거 새 도구 도입 실패 사례가 있다면?</div>
          <div className={hintClass}>실패 사례가 시스템 설계에 매우 중요합니다.</div>
          <TextInput qKey="G4" placeholder="예: CRM 도입했지만 입력이 번거로워 안 쓰게 됨 (선택)" />
        </div>

        <div>
          <div className={questionClass}>G5. &ldquo;이 작업만은 자동화 안 됐으면&rdquo; 하는 영역이 있나요?</div>
          <TextInput qKey="G5" placeholder="자유롭게 적어주세요 (선택)" />
        </div>

        <div>
          <div className={questionClass}>G6. 한 번에 도입 가능한 신규 시스템 개수는?</div>
          <PillSelect qKey="G6" options={["1개", "2~3개", "5개 이상", "모르겠음"]} />
        </div>
      </div>
    );
  }

  function renderM() {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <div className={questionClass}>M1. 응답 기반 1:1 무료 진단 미팅 가능 시간대는?</div>
          <MultiSelect qKey="M1" options={["평일 오전", "평일 오후", "평일 저녁", "주말", "협의"]} />
        </div>

        <div>
          <div className={questionClass}>M2. 선호하시는 미팅 형식은?</div>
          <PillSelect qKey="M2" options={["Zoom", "대면", "전화", "무관"]} />
        </div>

        <div>
          <div className={questionClass}>M3. 추가로 전달하고 싶은 내용이 있다면</div>
          <TextInput qKey="M3" rows={3} placeholder="자유롭게 적어주세요 (선택)" />
        </div>
      </div>
    );
  }

  // ── main render ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f8f8f6] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-[720px]">

        {/* Header */}
        <div className="mb-8 text-center">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#C9A84C]">PENTA LAB</p>
          <h1 className="text-[22px] font-black tracking-[-0.03em] text-[#0a0a0a] sm:text-[28px]">
            {respondent.name}님을 위한 맞춤 진단 설문
          </h1>
          <p className="mt-2 text-[13px] text-neutral-400">
응답 기반 1:1 무료 진단 미팅 (60분) + 자동화 ROI 시뮬레이션 보고서를 드립니다.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-neutral-400">
              {currentSection + 1} / {visibleSections.length}
            </span>
            <span className="text-[11px] text-neutral-400">{sec.title}</span>
          </div>
          <div className="h-1.5 rounded-full bg-neutral-200 overflow-hidden">
            <div className="h-full rounded-full bg-[#C9A84C] transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Section card */}
        <div className={sectionCard}>
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#C9A84C] text-[12px] font-black text-white">
              {sec.key}
            </span>
            <div>
              <h2 className="text-[16px] font-extrabold text-[#0a0a0a]">{sec.title}</h2>
              <p className="text-[12px] text-neutral-400">{sec.desc}</p>
            </div>
          </div>

          {renderSection()}
        </div>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => setCurrentSection((s) => Math.max(0, s - 1))}
            disabled={currentSection === 0}
            className="rounded-full border border-neutral-200 bg-white px-6 py-2.5 text-[13px] font-bold text-neutral-600 transition hover:border-neutral-400 disabled:opacity-30">
            이전
          </button>

          {currentSection < visibleSections.length - 1 ? (
            <button
              onClick={() => setCurrentSection((s) => Math.min(visibleSections.length - 1, s + 1))}
              className="rounded-full bg-[#0a0a0a] px-6 py-2.5 text-[13px] font-bold text-white transition hover:bg-neutral-800">
              다음
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={status === "sending"}
              className="rounded-full bg-[#C9A84C] px-8 py-2.5 text-[13px] font-bold text-[#0a0a0a] transition hover:bg-[#e8c96d] disabled:opacity-30">
              {status === "sending" ? "제출 중..." : "제출하기"}
            </button>
          )}
        </div>

        {/* Section quick nav */}
        <div className="mt-8 flex flex-wrap justify-center gap-1.5">
          {visibleSections.map((s, i) => (
            <button key={s.key} onClick={() => setCurrentSection(i)}
              className={`h-7 w-7 rounded-full text-[11px] font-bold transition-all ${
                i === currentSection
                  ? "bg-[#C9A84C] text-white"
                  : i < currentSection
                    ? "bg-[#C9A84C]/20 text-[#C9A84C]"
                    : "bg-neutral-100 text-neutral-400"
              }`}>
              {s.key}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
