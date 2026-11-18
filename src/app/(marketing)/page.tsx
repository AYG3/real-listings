import HeroSection from "./components/HeroSection";
import FeaturedPropertiesSection from "./components/FeaturedPropertiesSection";
import ServicesSection from "./components/ServicesSection";
import TestimonialsSection from "./components/TestimonialsSection";
import CTASection from "./components/CTASection";

// Reads live inventory on every request; ISR lands once the marketing copy
// stops changing (Phase 8).
export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedPropertiesSection />
      <ServicesSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
