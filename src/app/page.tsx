import HeroSection from './(marketing)/components/HeroSection';
import FeaturedPropertiesSection from './(marketing)/components/FeaturedPropertiesSection';
import ServicesSection from './(marketing)/components/ServicesSection';
import BestDealsSection from './(marketing)/components/BestDealsSection';
import TestimonialsSection from './(marketing)/components/TestimonialsSection';
import CTASection from './(marketing)/components/CTASection';
import FooterSection from './(marketing)/components/FooterSection';
import Navbar from './(marketing)/components/Navbar';


export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#fafafa]">
      <HeroSection />
      <FeaturedPropertiesSection />
      <ServicesSection />
      <BestDealsSection />
      <TestimonialsSection />
      <CTASection />
      <FooterSection />
    </main>
  );
}
