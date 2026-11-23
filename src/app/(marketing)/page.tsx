import HeroSection from "./components/HeroSection";
import TrustStrip from "./components/TrustStrip";
import FeaturedPropertiesSection from "./components/FeaturedPropertiesSection";
import HowItWorksSection from "./components/HowItWorksSection";
import TestimonialsSection from "./components/TestimonialsSection";
import CTASection from "./components/CTASection";

// Reads live inventory on every request; ISR lands once the marketing copy
// stops changing (Phase 8).
export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustStrip />
      <FeaturedPropertiesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
