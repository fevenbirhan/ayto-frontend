import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { HomeAnalytics } from "@/components/sections/HomeAnalytics";
import { PageContent } from "@/components/layout/PageContent";
import { Sun, Moon, Languages } from "lucide-react";
import { motion } from "framer-motion";

const translations = {
  en: {
    heroTitle: "Empowering Communities Through Technology",
    heroSubtitle: "Report, track, and resolve local issues together",
    featuresTitle: "Why Choose Our Platform?",
    analyticsTitle: "Community Impact",
    footerText: "Building better communities together",
  },
  am: {
    heroTitle: "በቴክኖሎጂ የማህበረሰቦች እድገት",
    heroSubtitle: "የአካባቢ ጉዳዮችን አሳውቁ፣ ከታተሉ እና በጋራ ይፍቱ",
    featuresTitle: "የእኛን መድረክ የመረጡት ለምንድን ነው?",
    analyticsTitle: "የማህበረሰብ ተጽእኖ",
    footerText: "በጋራ የተሻለ ማህበረሰቦች እየገነባን ነው",
  },
};

const Index = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useAuth();
  const darkMode = theme === "dark";
  const t = translations[language] || translations.en;

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "am" : "en");
  };

  return (
    <div
      className={`flex flex-col min-h-screen transition-colors duration-500 ease-in-out ${
        darkMode ? "bg-[#0F172A] text-white" : "bg-gradient-to-b from-blue-50 to-purple-100 text-gray-900"
      }`}
    >
      {/* Floating Controls */}
      <div className="fixed right-6 bottom-6 z-50 flex flex-col gap-3">
        <button
          onClick={toggleLanguage}
          className={`p-3 rounded-full shadow-lg ${
            darkMode ? "bg-[#1E293B] text-white" : "bg-white text-gray-800"
          } hover:scale-105 transition-transform duration-300`}
          aria-label={language === "en" ? "Change Language" : "ቋንቋ ቀይር"}
        >
          <Languages className="h-5 w-5" />
        </button>
        <button
          onClick={toggleTheme}
          className={`p-3 rounded-full shadow-lg ${
            darkMode ? "bg-[#1E293B] text-white" : "bg-white text-gray-800"
          } hover:scale-105 transition-transform duration-300`}
          aria-label={darkMode ? "Light Mode" : "Dark Mode"}
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>

      {/* Header */}
      <Header />

      {/* Page Content */}
      <PageContent>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Hero  />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Features  />
        </motion.div>

        <motion.section
          id="analytics"
          className="scroll-mt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <HomeAnalytics  />
        </motion.section>
      </PageContent>

      {/* Footer */}
      <Footer text={t.footerText} />
    </div>
  );
};

export default Index;
