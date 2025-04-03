
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { HomeAnalytics } from "@/components/sections/HomeAnalytics";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background dark:bg-[#0F1507]">
      <Header />
      <main>
        <Hero />
        <Features />
        <section id="analytics">
          <HomeAnalytics />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
