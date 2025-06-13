import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageContent } from "@/components/layout/PageContent";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ReportForm } from "@/components/dashboard/ReportForm";
import { NotificationsPanel } from "@/components/dashboard/NotificationsPanel";
import { CommunityReportsCards } from "@/components/CommunityReportsCards";
import { useToast } from "@/components/ui/use-toast";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/context/AuthContext";

const ResidentDashboard = () => {
  const { toast } = useToast();
  const { theme } = useTheme();
  const { language, userName } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showReportForm, setShowReportForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Translations
  const translations = {
    en: {
      loading: "Loading dashboard...",
      hello: "Hello",
      searchPlaceholder: "Search reports...",
      newReport: "New Report",
      errorTitle: "Error",
      errorMessage: "Failed to load dashboard. Please try again.",
      close: "✕",
      reportsSectionTitle: "Community Reports"
    },
    am: {
      loading: "ዳሽቦርድ እየተጫነ ነው...",
      hello: "ሰላም",
      searchPlaceholder: "ሪፖርቶችን ይፈልጉ...",
      newReport: "አዲስ ሪፖርት",
      errorTitle: "ስህተት",
      errorMessage: "ዳሽቦርድ መጫን አልተሳካም። እባክዎ እንደገና ይሞክሩ።",
      close: "✕",
      reportsSectionTitle: "የማህበረሰብ ሪፖርቶች"
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing dashboard:", error);
        toast({
          title: t.errorTitle,
          description: t.errorMessage,
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    initializeDashboard();
  }, [toast, t.errorTitle, t.errorMessage]);

  const handleReportCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (isLoading) {
    return (
      <div className={`flex flex-col min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Header />
        <PageContent>
          <div className="flex items-center justify-center">
            <div className={`text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              {t.loading}
            </div>
          </div>
        </PageContent>
      </div>
    );
  }

  return (
    <div className={`flex flex-col min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header />
      <PageContent>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 pt-8">
            <h1 className={`text-3xl md:text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              {t.hello}, {userName}
            </h1>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              {/* Search Bar */}
              <div className="relative flex-1 md:w-64">
                <Search className={`absolute left-3 top-3 h-4 w-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                <Input
                  type="search"
                  placeholder={t.searchPlaceholder}
                  className={`pl-10 ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-300'} focus:border-blue-500`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* New Report Button */}
              <div className="relative">
                <Button
                  className={`${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white font-medium`}
                  onClick={() => setShowReportForm(true)}
                >
                  {t.newReport}
                </Button>

                {/* Report Form Modal */}
                {showReportForm && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className={`p-6 rounded-2xl w-full max-w-2xl shadow-lg relative ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                      <button
                        className={`absolute top-4 right-4 ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setShowReportForm(false)}
                      >
                        {t.close}
                      </button>
                      <ReportForm
                        onSubmitSuccess={() => {
                          setShowReportForm(false);
                          handleReportCreated();
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <NotificationsPanel />
            </div>
          </div>

          {/* Reports Section */}
          <div className="mb-8">
            <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
              {t.reportsSectionTitle}
            </h2>
            <div className={theme === 'dark' ? 'bg-[#18230F]' : 'bg-white'}>
              <CommunityReportsCards
                searchQuery={searchQuery}
                isPersonal={false}
              />
            </div>
          </div>
        </div>
      </PageContent>
      <Footer text="© 2024 AYTO. All rights reserved." darkMode={theme === 'dark'} />
    </div>
  );
};

export default ResidentDashboard;