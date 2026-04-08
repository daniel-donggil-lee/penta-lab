"use client";
import Link from "next/link";

export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex h-[60px] items-center justify-between px-10 bg-[#0a0a0a]/92 backdrop-blur-md border-b border-white/6">
      <div className="text-[15px] font-black tracking-[0.08em] text-white">
        PENTA<span className="text-[#C9A84C]">LAB</span>
      </div>
      <Link
        href="#contact"
        className="rounded-full bg-[#C9A84C] px-5 py-2 text-[13px] font-bold text-[#0a0a0a] transition hover:bg-[#e8c96d]"
      >
        무료 상담 신청 →
      </Link>
    </nav>
  );
}
