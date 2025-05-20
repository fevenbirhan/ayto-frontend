import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { NotificationsPanel } from "@/components/dashboard/NotificationsPanel";
import { HelpSupport as HelpSupportSection } from "@/components/dashboard/HelpSupport";

const HelpSupport = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-[#1A1A1A] py-8 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h1 className="text-white text-3xl md:text-4xl font-bold">Help & Support</h1>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <NotificationsPanel />
            </div>
          </div>

          <HelpSupportSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HelpSupport; 