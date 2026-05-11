"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/ui/animated-section";

const GAS_URL =
  "https://script.google.com/macros/s/AKfycbxN3NaaZpCPPZfH7gEJVOGnyzJp9kvH5KtTXBMh86gnp6OCxcFPN8dGaK7THmVQb9vJoQ/exec";

function SuccessCheck() {
  return (
    <svg viewBox="0 0 52 52" className="mx-auto mb-4 h-16 w-16">
      <circle cx="26" cy="26" r="24" fill="none" stroke="#C9A84C" strokeWidth="2"
        strokeDasharray="150" strokeDashoffset="0"
        style={{ animation: "drawLine 600ms cubic-bezier(0.16,1,0.3,1) forwards" }}
      />
      <path fill="none" stroke="#C9A84C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
        d="M15 27l7 7 15-15"
        strokeDasharray="40" strokeDashoffset="40"
        style={{ animation: "drawLine 500ms cubic-bezier(0.16,1,0.3,1) 400ms forwards" }}
      />
    </svg>
  );
}

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ bizName: "", bizType: "", scale: "", pain: "", phone: "" });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const ts = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
    const payload = JSON.stringify({
      action: "append", sheet: "상담신청",
      values: [ts, form.bizName, form.bizType, form.scale, form.pain, form.phone],
    });
    try {
      await fetch(`${GAS_URL}?payload=${encodeURIComponent(payload)}`, { method: "GET", mode: "no-cors" });
      setSubmitted(true);
    } catch {
      alert("전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }

  const fields = [
    { key: "bizName", label: "사업체 이름 *", placeholder: "학원명 또는 채널명·브랜드명", type: "input" },
    { key: "bizType", label: "유형 *", type: "select" },
    { key: "scale", label: "원생 / 수강생 수 *", type: "scale" },
    { key: "pain", label: "가장 아픈 문제 *", placeholder: "지금 가장 해결하고 싶은 것을 자유롭게 적어주세요", type: "textarea" },
    { key: "phone", label: "연락처 *", placeholder: "010-0000-0000", type: "tel" },
  ];

  return (
    <section id="contact" className="bg-neutral-50 px-10 py-[100px]">
      <div className="mx-auto max-w-[900px]">
        <AnimatedSection>
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.14em] text-[#C9A84C]">무료 상담 신청</p>
          <h2 className="mb-4 text-[clamp(28px,4vw,44px)] font-black leading-[1.15] tracking-[-0.03em]">
            지금 신청하면 24시간 내 연락드립니다
          </h2>
          <p className="mb-14 max-w-[560px] text-[17px] leading-[1.7] text-neutral-500">
            부담 없이 작성해주세요. 가장 아픈 문제 하나만 적어도 됩니다.
          </p>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={200}>
          <div className="max-w-[680px] rounded-3xl border border-neutral-200 bg-white p-14 max-sm:p-8 transition-shadow duration-300 hover:shadow-xl">
            {submitted ? (
              <div className="py-10 text-center">
                <SuccessCheck />
                <div className="mb-2 text-[22px] font-extrabold">상담 신청이 완료되었습니다</div>
                <div className="text-[15px] leading-relaxed text-neutral-500">
                  24시간 내 담당자가 직접 연락드립니다. 빠른 상담을 원하시면 인스타 DM으로도 연락 주세요.
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                  <div>
                    <label className="mb-2 block text-[13px] font-bold">사업체 이름 *</label>
                    <Input placeholder="학원명 또는 채널명·브랜드명" required value={form.bizName} onChange={set("bizName")} className="rounded-xl border-neutral-200 py-3.5 text-[15px] transition-all duration-200 focus-visible:ring-[#C9A84C] focus-visible:border-[#C9A84C]" />
                  </div>
                  <div>
                    <label className="mb-2 block text-[13px] font-bold">유형 *</label>
                    <select required value={form.bizType} onChange={set("bizType")}
                      className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3.5 text-[15px] outline-none transition-all duration-200 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]">
                      <option value="">선택해주세요</option>
                      <option value="오프라인 학원">오프라인 학원</option>
                      <option value="온라인 교육 사업자">온라인 교육 사업자</option>
                      <option value="둘 다">둘 다</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[13px] font-bold">원생 / 수강생 수 *</label>
                  <select required value={form.scale} onChange={set("scale")}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3.5 text-[15px] outline-none transition-all duration-200 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]">
                    <option value="">선택해주세요</option>
                    <option value="~30명">~30명</option>
                    <option value="30~80명">30~80명</option>
                    <option value="80명~">80명~</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-[13px] font-bold">가장 아픈 문제 *</label>
                  <Textarea required value={form.pain} onChange={set("pain")} placeholder="지금 가장 해결하고 싶은 것을 자유롭게 적어주세요" className="min-h-[96px] rounded-xl border-neutral-200 text-[15px] transition-all duration-200 focus-visible:ring-[#C9A84C] focus-visible:border-[#C9A84C]" />
                </div>

                <div>
                  <label className="mb-2 block text-[13px] font-bold">연락처 *</label>
                  <Input type="tel" required value={form.phone} onChange={set("phone")} placeholder="010-0000-0000" className="rounded-xl border-neutral-200 py-3.5 text-[15px] transition-all duration-200 focus-visible:ring-[#C9A84C] focus-visible:border-[#C9A84C]" />
                </div>

                <Button type="submit" disabled={loading}
                  className="mt-2 h-auto rounded-xl bg-[#0a0a0a] py-4.5 text-[16px] font-bold tracking-[0.02em] transition-all duration-300 hover:bg-neutral-800 hover:shadow-lg disabled:opacity-50">
                  {loading ? "전송 중..." : "상담 신청하기"}
                </Button>

                <p className="text-center text-[12px] text-neutral-400">
                  확인 후 24시간 내 연락드립니다 · 영업 목적 외 사용하지 않습니다
                </p>
              </form>
            )}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
