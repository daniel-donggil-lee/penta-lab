import SurveyForm from "@/components/survey/survey-form";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "솔루션 니즈 설문 — 펜타랩 (PENTA LAB)",
  description: "5분이면 완성됩니다. 답변을 바탕으로 맞춤 솔루션과 견적을 제안드립니다.",
};

export default function SurveyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-neutral-100 px-8 py-5">
        <Link href="/" className="text-[18px] font-black tracking-[0.04em]">
          PENTA<span className="text-[#C9A84C]">LAB</span>
        </Link>
        <span className="text-[13px] text-neutral-400">솔루션 니즈 설문</span>
      </header>

      {/* Body */}
      <main className="mx-auto max-w-[720px] px-6 py-[60px]">
        {/* Intro */}
        <div className="mb-12 rounded-2xl bg-neutral-50 px-8 py-7">
          <p className="mb-1 text-[12px] font-bold uppercase tracking-[0.12em] text-[#C9A84C]">
            5분이면 완성됩니다
          </p>
          <p className="text-[15px] leading-[1.7] text-neutral-600">
            답변을 바탕으로 <strong className="text-neutral-800">맞춤 솔루션과 견적</strong>을 제안드립니다.
            정확하지 않아도 괜찮습니다 — 대략적인 방향만 적어주세요.
          </p>
        </div>

        <SurveyForm />
      </main>
    </div>
  );
}
