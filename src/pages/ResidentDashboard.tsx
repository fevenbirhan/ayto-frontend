
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProfileSection } from "@/components/dashboard/ProfileSection";
import { ReportForm } from "@/components/dashboard/ReportForm";
import { ReportsList } from "@/components/dashboard/ReportsList";
import { FeedbackSection } from "@/components/dashboard/FeedbackSection";
import { HelpSupport } from "@/components/dashboard/HelpSupport";
import { NotificationsPanel } from "@/components/dashboard/NotificationsPanel";
import { CommunityReportsCards } from "@/components/CommunityReportsCards";

const ResidentDashboard = () => {
  const [activeTab, setActiveTab] = useState("reports");
  const [searchQuery, setSearchQuery] = useState("");
  const [showReportForm, setShowReportForm] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-[#27391C] py-8 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h1 className="text-white text-3xl md:text-4xl font-bold">Resident Dashboard</h1>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/60" />
                <Input
                  type="search"
                  placeholder="Search reports..."
                  className="pl-8 bg-[#18230F] text-white border-[#255F38]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="relative">
                <Button
                  className="bg-[#6C7719] hover:bg-[#5a6415] text-white"
                  onClick={() => setShowReportForm(true)}
                >
                  New Report
                </Button>

                {showReportForm && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    {/* Modal Card */}
                    <div className="bg-[#1E2A13] p-6 rounded-2xl w-full max-w-2xl shadow-lg relative animate-fade-in">
                      <button
                        className="absolute top-4 right-4 text-white hover:text-gray-300"
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
            <Card className="mb-8 bg-[#18230F] border-[#255F38]">
              <CardContent className="pt-6">
                <ReportForm onSubmitSuccess={() => setShowReportForm(false)} />
              </CardContent>
            </Card>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-[#18230F] border border-[#255F38] p-1 mb-6">
              <TabsTrigger 
                value="reports" 
                className="data-[state=active]:bg-[#255F38] data-[state=active]:text-white text-white/70"
              >
                My Reports
              </TabsTrigger>
              <TabsTrigger 
                value="community" 
                className="data-[state=active]:bg-[#255F38] data-[state=active]:text-white text-white/70"
              >
                Community Reports
              </TabsTrigger>
              <TabsTrigger 
                value="feedback" 
                className="data-[state=active]:bg-[#255F38] data-[state=active]:text-white text-white/70"
              >
                Feedback & Communication
              </TabsTrigger>
              <TabsTrigger 
                value="profile" 
                className="data-[state=active]:bg-[#255F38] data-[state=active]:text-white text-white/70"
              >
                Profile
              </TabsTrigger>
              <TabsTrigger 
                value="help" 
                className="data-[state=active]:bg-[#255F38] data-[state=active]:text-white text-white/70"
              >
                Help & Support
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reports" className="mt-0">
              <ReportsList 
                searchQuery={searchQuery} 
                isPersonal={true} 
              />
            </TabsContent>

            <TabsContent value="community" className="mt-0">
              <CommunityReportsCards searchQuery={""} isPersonal={false} />
            </TabsContent>

            <TabsContent value="feedback" className="mt-0">
              <FeedbackSection />
            </TabsContent>

            <TabsContent value="profile" className="mt-0">
              <ProfileSection />
            </TabsContent>

            <TabsContent value="help" className="mt-0">
              <HelpSupport />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResidentDashboard;
