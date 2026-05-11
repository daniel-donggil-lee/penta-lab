"use client";
import { useEffect, useState } from "react";
import { useInView } from "@/hooks/use-in-view";
import { useCountUp } from "@/hooks/use-count-up";
import AnimatedSection from "@/components/ui/animated-section";

function TypingText({ text, enabled, delay = 0 }: { text: string; enabled: boolean; delay?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [enabled, delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, 150);
    return () => clearInterval(interval);
  }, [started, text]);

  return (
    <span>
      {displayed}
      {started && displayed.length < text.length && (
        <span className="inline-block w-[2px] h-[1em] bg-[#C9A84C] ml-0.5 align-middle" style={{ animation: "glowPulse 1s step-end infinite" }} />
      )}
    </span>
  );
}

function MetricCard({
  before, afterNum, afterUnit, context, index, isInView,
  countDown, typing,
}: {
  before: string; afterNum?: number; afterUnit: string; context: string;
  index: number; isInView: boolean;
  countDown?: boolean; typing?: boolean;
}) {
  const countValue = useCountUp({
    end: afterNum ?? 0,
    start: countDown ? 8 : 0,
    duration: 1500,
    enabled: isInView && afterNum !== undefined,
  });

  const [flash, setFlash] = useState(false);
  useEffect(() => {
    if (!isInView || afterNum === undefined) return;
    const t = setTimeout(() => setFlash(true), 1600);
    const t2 = setTimeout(() => setFlash(false), 2200);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, [isInView, afterNum]);

  return (
    <AnimatedSection animation="fade-up" delay={index * 150}>
      <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-9 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="mb-1 text-[13px] font-medium text-neutral-400 line-through">{before}</div>
        <div className="my-2 text-[20px] text-neutral-400" style={{ animation: "bounceDown 2s ease-in-out infinite" }}>↓</div>
        <div className="mb-2 text-[clamp(28px,3.5vw,40px)] font-black leading-none tracking-[-0.03em]">
          {typing ? (
            <span className="text-[#C9A84C]"><TypingText text={afterUnit} enabled={isInView} delay={300} /></span>
          ) : (
            <>
              <span
                className="text-[#C9A84C] transition-all duration-300"
                style={flash ? { textShadow: "0 0 20px rgba(201,168,76,0.5)" } : undefined}
              >
                {countValue}
              </span>
              {afterUnit}
            </>
          )}
        </div>
        <div className="text-[13px] leading-relaxed text-neutral-500">{context}</div>
        {/* Gold bottom bar with grow animation */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#C9A84C] to-[#e8c96d]"
          style={{
            width: isInView ? "100%" : "0%",
            transition: "width 1200ms cubic-bezier(0.16,1,0.3,1) 500ms",
          }}
        />
      </div>
    </AnimatedSection>
  );
}

export default function Proof() {
  const { ref, isInView } = useInView();

  return (
    <section id="proof" className="bg-neutral-50 px-10 py-[100px]" ref={ref}>
      <div className="mx-auto max-w-[900px]">
        <AnimatedSection>
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.14em] text-[#C9A84C]">실제 데이터</p>
          <h2 className="mb-4 text-[clamp(28px,4vw,44px)] font-black leading-[1.15] tracking-[-0.03em]">
            직접 도입하고 측정했습니다
          </h2>
          <p className="mb-14 text-[17px] leading-[1.7] text-neutral-500 break-keep">
            말로만 하는 컨설팅이 아닙니다. 아래 수치는 직접 운영한 학원에서 측정한 실제 데이터입니다.
          </p>
        </AnimatedSection>

        <div className="mb-12 grid grid-cols-3 gap-6 max-md:grid-cols-1">
          <MetricCard
            before="문의 응답 시간 평균 8시간"
            afterNum={5}
            afterUnit="분"
            context="카톡 자동 응답 도입 후 심야 문의도 즉시 대응"
            index={0}
            isInView={isInView}
          />
          <MetricCard
            before="학부모 리포트 월 8시간 수작업"
            afterNum={0}
            afterUnit="시간"
            context="자동 생성으로 전환 후 원장 시간 월 8시간 회수"
            index={1}
            isInView={isInView}
            countDown
          />
          <MetricCard
            before="매달 전화 독촉 → 관계 어색"
            afterUnit="자동"
            context="미납 감지 즉시 발송 — 원장이 직접 연락할 필요 없음"
            index={2}
            isInView={isInView}
            typing
          />
        </div>

      </div>
    </section>
  );
}
