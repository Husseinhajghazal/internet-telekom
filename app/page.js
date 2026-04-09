import Header from "@/components/home/Header";
import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import PackagesSection from "@/components/home/PackagesSection";
import AboutSection from "@/components/home/AboutSection";
import ReviewsSection from "@/components/home/ReviewsSection";
import Footer from "@/components/home/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <FeaturesSection />
      <PackagesSection />
      <ReviewsSection />
      <Footer />
    </main>
  );
}
