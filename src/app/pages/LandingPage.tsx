import React from 'react';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';
import HeroSection from '../components/landing/HeroSection';
import FeaturedVenuesSection from '../components/landing/FeaturedVenuesSection';
import CategorySection from '../components/landing/CategorySection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import ForOwnersSection from '../components/landing/ForOwnersSection';
import PopularLocationsSection from '../components/landing/PopularLocationsSection';
import PlatformFeaturesSection from '../components/landing/PlatformFeaturesSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import FinalCTASection from '../components/landing/FinalCTASection';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturedVenuesSection />
      <CategorySection />
      <HowItWorksSection />
      <ForOwnersSection />
      <PopularLocationsSection />
      <PlatformFeaturesSection />
      <TestimonialsSection />
      <FinalCTASection />
      <Footer />
    </div>
  );
}
