import Nav from "@/components/sections/nav";
import Hero from "@/components/sections/hero";
import Pain from "@/components/sections/pain";
import BeforeAfter from "@/components/sections/before-after";
import Services from "@/components/sections/services";
import Proof from "@/components/sections/proof";
import Why from "@/components/sections/why";
import HowItWorks from "@/components/sections/how-it-works";
import FoundingPartner from "@/components/sections/founding-partner";
import ContactForm from "@/components/sections/contact-form";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Pain />
        <BeforeAfter />
        <Services />
        <Proof />
        <Why />
        <HowItWorks />
        <FoundingPartner />
        <ContactForm />
      </main>
      <footer className="bg-[#0a0a0a] px-10 py-12 text-center">
        <div className="mb-2 text-[18px] font-black tracking-[0.06em] text-white">
          PENTA<span className="text-[#C9A84C]">LAB</span>
        </div>
        <div className="text-[13px] text-white/35">교육 사업 자동화 시스템 · PENTA GROUP</div>
      </footer>
    </>
  );
}
