import dynamic from "next/dynamic";
import Header from "@/components/home/Header";
import HeroSection from "@/components/home/HeroSection";

const StatsSection = dynamic(() => import("@/components/home/StatsSection"));
const AboutSection = dynamic(() => import("@/components/home/AboutSection"));
const ServicesSection = dynamic(() => import("@/components/home/ServicesSection"));
const FeaturesSection = dynamic(() => import("@/components/home/FeaturesSection"));
const PackagesSection = dynamic(() => import("@/components/home/PackagesSection"));
const ReviewsSection = dynamic(() => import("@/components/home/ReviewsSection"));
const Footer = dynamic(() => import("@/components/home/Footer"));

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <StatsSection />
      <PackagesSection />
      <AboutSection />
      <ServicesSection />
      <FeaturesSection />
      <ReviewsSection />
      <Footer />
    </main>
  );
}
