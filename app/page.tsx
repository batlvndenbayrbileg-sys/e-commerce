import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import BrandMarquee from "@/components/brand-marquee"
import ProductPreview from "@/components/product-preview"
import HowItWorks from "@/components/how-it-works"
import FeaturesSection from "@/components/features-section"
import StatsSection from "@/components/stats-section"
import Footer from "@/components/footer"
import FloatingQuote from "@/components/floating-quote"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <Navbar />
      <HeroSection />
      <BrandMarquee />
      <ProductPreview />
      <HowItWorks />
      <FeaturesSection />
      <StatsSection />
      <Footer />
      <FloatingQuote />
    </main>
  )
}
