import Hero from "@/components/landing/Hero";
import Forge from "@/components/landing/Forge";
import Districts from "@/components/landing/Districts";
import CreatorJourney from "@/components/landing/CreatorJourney";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="bg-black text-white">
      <Hero />
      <Forge />
      <Districts />
      <CreatorJourney />
      <Footer />
    </main>
  );
}
