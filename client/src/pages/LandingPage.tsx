import React from 'react';
import { PublicNavbar } from '../components/landing/PublicNavbar';
import { HeroSection } from '../components/landing/HeroSection';
import { ServicesSection } from '../components/landing/ServicesSection';
import { FeaturedProjectsSection } from '../components/landing/FeaturedProjectsSection';
import { ProcessSection } from '../components/landing/ProcessSection';
import { CtaSection } from '../components/landing/CtaSection';
import { TestimonialsSection } from '../components/landing/TestimonialsSection';
import { TechStackSection } from '../components/landing/TechStackSection';
import { Footer } from '../components/layout/Footer';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#EEEEEE] selection:bg-[#EEEEEE] selection:text-[#121212] font-sans">
      <PublicNavbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <FeaturedProjectsSection />
        <ProcessSection />
        <CtaSection />
        <TestimonialsSection />
        <TechStackSection />
      </main>
      <Footer />
    </div>
  );
};
