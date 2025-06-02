import { useContext, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageContent } from "@/components/layout/PageContent";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ReportForm } from "@/components/dashboard/ReportForm";
import { NotificationsPanel } from "@/components/dashboard/NotificationsPanel";
import { ReportsList } from "@/components/dashboard/ReportsList";
import { AuthContext } from "@/context/AuthContext";

const MyReports = () => {
  const { token, userId } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [showReportForm, setShowReportForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <PageContent>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h1 className="text-white text-3xl md:text-4xl font-bold">My Reports</h1>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#A3A3A3]" />
                <Input
                  type="search"
                  placeholder="Search reports..."
                  className="pl-8 bg-[#2D2D2D] text-white border-[#404040]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="relative">
                <Button
                  className="bg-[#3B82F6] hover:bg-[#2563EB] text-white"
                  onClick={() => setShowReportForm(true)}
                >
                  New Report
                </Button>

                {showReportForm && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#2D2D2D] p-6 rounded-2xl w-full max-w-2xl shadow-lg relative animate-fade-in">
                      <button
                        className="absolute top-4 right-4 text-white hover:text-[#A3A3A3]"
                        onClick={() => setShowReportForm(false)}
                      >
                        ✕
                      </button>
                      <ReportForm onSubmitSuccess={() => setShowReportForm(false)} />
                    </div>
                  </div>
                )}
              </div>

              <NotificationsPanel />
            </div>
          </div>

          {showReportForm && (
            <Card className="mb-8 bg-[#2D2D2D] border-[#404040]">
              <CardContent className="pt-6">
                <ReportForm onSubmitSuccess={() => setShowReportForm(false)} />
              </CardContent>
            </Card>
          )}

          <ReportsList searchQuery={searchQuery} token={token} userId={userId} />
        </div>
      </PageContent>
      <Footer />
    </div>
  );
};

export default MyReports; 