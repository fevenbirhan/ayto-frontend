import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageContent } from "@/components/layout/PageContent";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ReportForm } from "@/components/dashboard/ReportForm";
import { NotificationsPanel } from "@/components/dashboard/NotificationsPanel";
import { ReportsList } from "@/components/dashboard/ReportsList";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/components/ThemeProvider";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/motion1";

const MyReports = () => {
  const { token, userId, language } = useAuth();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [showReportForm, setShowReportForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Translations
  const translations = {
    en: {
      title: "My Reports",
      subtitle: "Manage and track all your submitted reports",
      searchPlaceholder: "Search reports...",
      newReport: "New Report",
      close: "✕",
      noReports: "No reports found",
      loading: "Loading reports..."
    },
    am: {
      title: "የእኔ ሪፖርቶች",
      subtitle: "የሀቀኛቸውን ሪፖርቶች ያስተዳድሩ እና ይከታተሉ",
      searchPlaceholder: "ሪፖርቶችን ይፈልጉ...",
      newReport: "አዲስ ሪፖርት",
      close: "✕",
      noReports: "ምንም ሪፖርት አልተገኘም",
      loading: "ሪፖርቶች እየጫኑ ነው..."
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={staggerContainer()}
      className={`flex flex-col min-h-screen ${theme === "dark" ? "dark bg-gray-900" : "bg-gray-50"}`}
    >
      <Header />
      <PageContent>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeIn("down", "tween", 0.1, 0.5)}
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
          >
            <div>
              <h1 className={`text-3xl md:text-4xl font-bold ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
                {t.title}
              </h1>
              <p className={`mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                {t.subtitle}
              </p>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <motion.div 
                variants={fadeIn("left", "tween", 0.2, 0.5)}
                className="relative flex-1 md:w-64"
              >
                <Search className={`absolute left-3 top-3 h-4 w-4 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`} />
                <Input
                  type="search"
                  placeholder={t.searchPlaceholder}
                  className={`pl-10 ${theme === "dark" ? "bg-gray-800 text-white border-gray-700 focus:border-blue-500" : "bg-white text-gray-900 border-gray-300 focus:border-blue-500"}`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </motion.div>
              
              <motion.div 
                variants={fadeIn("left", "tween", 0.3, 0.5)}
                className="relative"
              >
                <Button
                  className={`${theme === "dark" ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white`}
                  onClick={() => setShowReportForm(true)}
                >
                  {t.newReport}
                </Button>
              </motion.div>

              <motion.div variants={fadeIn("left", "tween", 0.4, 0.5)}>
                <NotificationsPanel />
              </motion.div>
            </div>
          </motion.div>

          {showReportForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className={`p-6 rounded-2xl w-full max-w-2xl shadow-lg relative ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border`}
              >
                <button
                  className={`absolute top-4 right-4 ${theme === "dark" ? "text-gray-300 hover:text-white" : "text-gray-500 hover:text-gray-700"}`}
                  onClick={() => setShowReportForm(false)}
                >
                  {t.close}
                </button>
                <ReportForm onSubmitSuccess={() => setShowReportForm(false)} />
              </motion.div>
            </motion.div>
          )}

          <motion.div variants={fadeIn("up", "tween", 0.5, 0.5)}>
            <ReportsList 
              searchQuery={searchQuery} 
              token={token} 
              userId={userId}
              
              
            />
          </motion.div>
        </div>
      </PageContent>
      <Footer />
    </motion.div>
  );
};

export default MyReports;