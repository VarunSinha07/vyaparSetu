import { Navbar } from "@/components/landing-page/Navbar";
import { Hero } from "@/components/landing-page/Hero";
import { TrustBar } from "@/components/landing-page/TrustBar";
import { Problem } from "@/components/landing-page/Problem";
import { Solution } from "@/components/landing-page/Solution";
import { HowItWorks } from "@/components/landing-page/HowItWorks";
import { Features } from "@/components/landing-page/Features";
import { ROICalculator } from "@/components/landing-page/ROICalculator";
import { IndianContext } from "@/components/landing-page/IndianContext";
import { Security } from "@/components/landing-page/Security";
import { TargetAudience } from "@/components/landing-page/TargetAudience";
import { CTA } from "@/components/landing-page/CTA";
import { Footer } from "@/components/landing-page/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50/40 text-slate-900 font-sans selection:bg-emerald-500/20 selection:text-emerald-900">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TrustBar />
        <Problem />
        <Solution />
        <HowItWorks />
        <Features />
        <ROICalculator />
        <IndianContext />
        <Security />
        <TargetAudience />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
