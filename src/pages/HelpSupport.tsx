import { useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageContent } from "@/components/layout/PageContent";
import { NotificationsPanel } from "@/components/dashboard/NotificationsPanel";
import { HelpSupport as HelpSupportSection } from "@/components/dashboard/HelpSupport";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn, slideIn, staggerContainer, textVariant, cardVariants } from "@/lib/motion";
import { Sun, Moon, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const HelpSupport = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useAuth();

  // Translations
  const translations = {
    title: {
      en: "Help & Support",
      am: "እርዳታ እና ድጋፍ"
    },
    language: {
      en: "Language",
      am: "ቋንቋ"
    },
    english: {
      en: "English",
      am: "እንግሊዝኛ"
    },
    amharic: {
      en: "Amharic",
      am: "አማርኛ"
    },
    theme: {
      en: "Theme",
      am: "ገጽታ"
    },
    light: {
      en: "Light",
      am: "ብርሃን"
    },
    dark: {
      en: "Dark",
      am: "ጨለማ"
    }
  };

  const getTranslation = (key: keyof typeof translations) => translations[key][language] || translations[key].en;

  return (
    <div className={`flex flex-col min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="dark:bg-[#121212] bg-gray-50 transition-colors duration-300">
        <Header />
        <PageContent>
          <motion.div
            variants={staggerContainer()}
            initial="hidden"
            animate="visible"
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <motion.h1 
                variants={textVariant(0.1)}
                className="dark:text-white text-gray-900 text-3xl md:text-4xl font-bold"
              >
                {getTranslation('title')}
              </motion.h1>
              
              <motion.div 
                variants={slideIn('right', 0.2)}
                className="flex items-center gap-3 w-full md:w-auto"
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Languages className="h-4 w-4" />
                      <span>{getTranslation('language')}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setLanguage('en')}>
                      {getTranslation('english')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLanguage('am')}>
                      {getTranslation('amharic')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={toggleTheme}
                  className="gap-2"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="h-4 w-4" />
                      <span>{getTranslation('light')}</span>
                    </>
                  ) : (
                    <>
                      <Moon className="h-4 w-4" />
                      <span>{getTranslation('dark')}</span>
                    </>
                  )}
                </Button>

                <NotificationsPanel />
              </motion.div>
            </div>

            <motion.div variants={fadeIn(0.3)}>
              <HelpSupportSection />
            </motion.div>
          </motion.div>
        </PageContent>
        <Footer />
      </div>
    </div>
  );
};

export default HelpSupport;