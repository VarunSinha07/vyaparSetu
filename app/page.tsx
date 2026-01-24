import { Navbar } from "@/components/landing-page/Navbar";
import { Hero } from "@/components/landing-page/Hero";
import { Problem } from "@/components/landing-page/Problem";
import { Solution } from "@/components/landing-page/Solution";
import { HowItWorks } from "@/components/landing-page/HowItWorks";
import { Features } from "@/components/landing-page/Features";
import { IndianContext } from "@/components/landing-page/IndianContext";
import { Security } from "@/components/landing-page/Security";
import { TargetAudience } from "@/components/landing-page/TargetAudience";
import { CTA } from "@/components/landing-page/CTA";
import { Footer } from "@/components/landing-page/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Problem />
        <Solution />
        <HowItWorks />
        <Features />
        <IndianContext />
        <Security />
        <TargetAudience />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
