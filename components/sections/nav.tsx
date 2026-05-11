"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 60);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex h-[60px] items-center justify-between px-10 border-b transition-all duration-300"
      style={{
        backgroundColor: scrolled ? "rgba(10,10,10,0.92)" : "transparent",
        borderColor: scrolled ? "rgba(255,255,255,0.06)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
      }}
    >
      <div className="text-[15px] font-black tracking-[0.08em] text-white">
        PENTA<span className="text-[#C9A84C]">LAB</span>
      </div>
      <Link
        href="#contact"
        className="rounded-full bg-[#C9A84C] px-5 py-2 text-[13px] font-bold text-[#0a0a0a] transition-all duration-300 hover:bg-[#e8c96d] hover:shadow-md hover:shadow-[#C9A84C]/20"
      >
        무료 상담 신청 →
      </Link>
    </nav>
  );
}
