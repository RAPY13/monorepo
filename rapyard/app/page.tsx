import { Suspense } from "react";
import Hero from "@/app/components/Hero";
import FounderProgram from "@/app/components/FounderProgram";
import WhyRapYard from "@/app/components/WhyRapYard";
import ClosingSection from "@/app/components/ClosingSection";
import AuthErrorBanner from "@/app/components/AuthErrorBanner";

export default function Home() {
  return (
    <>
      <Suspense>
        <AuthErrorBanner />
      </Suspense>
      <Hero />
      <FounderProgram />
      <WhyRapYard />
      <ClosingSection />
    </>
  );
}