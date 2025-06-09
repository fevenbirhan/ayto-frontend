import { useState, useEffect } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageContent } from "@/components/layout/PageContent";
import { NotificationsPanel } from "@/components/dashboard/NotificationsPanel";
import { FeedbackSection } from "@/components/dashboard/FeedbackSection";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn, slideIn } from "@/lib/motion";

const Feedback = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const { theme } = useTheme();
  const { language, setLanguage } = useAuth();

  // Translations
  const translations = {
    title: {
      en: "Feedback",
      am: "ግብረ መልስ"
    },
    searchPlaceholder: {
      en: "Search feedback...",
      am: "ግብረ መልስ ፈልግ..."
    },
    newFeedback: {
      en: "New Feedback",
      am: "አዲስ ግብረ መልስ"
    },
    close: {
      en: "✕",
      am: "ዝጋ"
    }
  };

  const getTranslation = (key: keyof typeof translations) => translations[key][language] || translations[key].en;

  return (
    <div className={`flex flex-col min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="dark:bg-[#121212] bg-gray-50 transition-colors duration-300">
        <Header />
        <PageContent>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeIn(0.2)}
              className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 pt-6"
            >
              <motion.h1 
                variants={slideIn('left', 0.3)}
                className="dark:text-white text-gray-900 text-3xl md:text-4xl font-bold"
              >
                {getTranslation('title')}
              </motion.h1>
              
              <div className="flex items-center gap-3 w-full md:w-auto">
                <motion.div 
                  variants={slideIn('right', 0.3)}
                  className="relative flex-1 md:w-64"
                >
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 dark:text-[#A3A3A3] text-gray-500" />
                  <Input
                    type="search"
                    placeholder={getTranslation('searchPlaceholder')}
                    className="pl-8 dark:bg-[#2D2D2D] bg-white dark:text-white text-gray-900 dark:border-[#404040] border-gray-200"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </motion.div>
                
                <motion.div 
                  variants={slideIn('right', 0.4)}
                  className="relative"
                >
                  <Button
                    className="bg-[#3B82F6] hover:bg-[#2563EB] text-white"
                    onClick={() => setShowFeedbackForm(true)}
                  >
                    {getTranslation('newFeedback')}
                  </Button>
                </motion.div>

                <motion.div variants={slideIn('right', 0.5)}>
                  <NotificationsPanel />
                </motion.div>
              </div>
            </motion.div>

            <AnimatePresence>
              {showFeedbackForm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center dark:bg-black/60 bg-black/30 backdrop-blur-sm"
                >
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: 'spring', damping: 20 }}
                    className="dark:bg-[#2D2D2D] bg-white p-6 rounded-2xl w-full max-w-2xl shadow-lg relative"
                  >
                    <button
                      className="absolute top-4 right-4 dark:text-white text-gray-900 hover:text-[#A3A3A3]"
                      onClick={() => setShowFeedbackForm(false)}
                    >
                      {getTranslation('close')}
                    </button>
                    <FeedbackSection />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {showFeedbackForm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <Card className="dark:bg-[#2D2D2D] bg-white dark:border-[#404040] border-gray-200">
                  <CardContent className="pt-6">
                    <FeedbackSection />
                  </CardContent>
                </Card>
              </motion.div>
            )}

            <motion.div
              variants={fadeIn(0.6)}
              initial="hidden"
              animate="visible"
            >
              <FeedbackSection />
            </motion.div>
          </div>
        </PageContent>
        <Footer />
      </div>
    </div>
  );
};

export default Feedback;