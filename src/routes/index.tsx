import { createFileRoute } from "@tanstack/react-router";
import { Background } from "@/components/genesis/Background";
import { Navbar } from "@/components/genesis/Navbar";
import { Hero } from "@/components/genesis/Hero";
import { Categories } from "@/components/genesis/Categories";
import { FeaturedProducts } from "@/components/genesis/FeaturedProducts";
import { Benefits } from "@/components/genesis/Benefits";
import { HowItWorks } from "@/components/genesis/HowItWorks";
import { Testimonials } from "@/components/genesis/Testimonials";
import { FAQ } from "@/components/genesis/FAQ";
import { CTA } from "@/components/genesis/CTA";
import { Footer } from "@/components/genesis/Footer";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="dark relative min-h-screen text-white overflow-x-hidden">
      <Background />
      <Navbar />
      <main>
        <Hero />
        <Categories />
        <FeaturedProducts />
        <Benefits />
        <HowItWorks />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
