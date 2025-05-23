import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { HomeAnalytics } from "@/components/sections/HomeAnalytics";
import { PageContent } from "@/components/layout/PageContent";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background dark:bg-[#0F172A]">
      <Header />
      <PageContent>
        <Hero />
        <Features />
        <section id="analytics">
          <HomeAnalytics />
        </section>
      </PageContent>
      <Footer />
    </div>
  );
};

export default Index;
