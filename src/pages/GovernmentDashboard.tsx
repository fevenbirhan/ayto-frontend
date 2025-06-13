import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Clock, ChevronDown, Download, Bell, Building2, BarChart3, ArrowLeft, Home, User, Settings, LogOut, Sun, Moon, Languages } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/context/AuthContext";

// Import our components
import { CreateUtilityProvider } from "@/components/government/CreateUtilityProvider";
import ManageUtilityProviders from "@/components/government/ManageUtilityProviders";
import { AnalyticsDashboard } from "@/components/government/AnalyticsDashboard";

// Translation dictionary
const translations = {
  en: {
    dashboard: "Government Dashboard",
    createProvider: "Create Utility Provider",
    manageProviders: "Manage Utility Providers",
    backToDashboard: "Back to Dashboard",
    analytics: "Analytics",
    create: "Create Provider",
    manage: "Manage Providers",
    overview: "Overview and analytics for government services",
    addNew: "Add new utility providers to the system",
    manageExisting: "Manage existing utility providers",
    notifications: "Notifications",
    profile: "Profile",
    settings: "Settings",
    logout: "Logout",
    newProvider: "New Provider Registration",
    statusUpdate: "Status Update",
    systemAlert: "System Alert",
    home: "Home",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    language: "Language",
    english: "English",
    amharic: "Amharic",
  },
  am: {
    dashboard: "የመንግስት ዳሽቦርድ",
    createProvider: "የተጠቃሚ አገልግሎት ማስተዳደሪያ ይፍጠሩ",
    manageProviders: "የተጠቃሚ አገልግሎቶችን ያስተዳድሩ",
    backToDashboard: "ወደ ዳሽቦርድ ተመለስ",
    analytics: "ትንታኔ",
    create: "ፕሮቫይደር ይፍጠሩ",
    manage: "ፕሮቫይደሮችን ያስተዳድሩ",
    overview: "ለመንግስት አገልግሎቶች አጠቃላይ እይታ ና ትንታኔ",
    addNew: "አዲስ የተጠቃሚ አገልግሎት ማስተዳደሪያዎችን ወደ ስርዓቱ ያክሉ",
    manageExisting: "ነባር የተጠቃሚ አገልግሎት ማስተዳደሪያዎችን ያስተዳድሩ",
    notifications: "ማስታወቂያዎች",
    profile: "መገለጫ",
    settings: "ቅንብሮች",
    logout: "ውጣ",
    newProvider: "አዲስ ፕሮቫይደር ምዝገባ",
    statusUpdate: "የሁኔታ ማዘመኛ",
    systemAlert: "የስርዓት ማንቂያ",
    home: "ዋና ገጽ",
    lightMode: "ብርሃናማ ሞድ",
    darkMode: "ጨለማ ሞድ",
    language: "ቋንቋ",
    english: "እንግሊዝኛ",
    amharic: "አማርኛ",
  },
};

const GovernmentDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();
  const { language, userName } = useAuth();
  
  const t = translations[language as keyof typeof translations] || translations.en;

  // Get active tab from URL or default to analytics
  const activeTab = searchParams.get('tab') || 'analytics';

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (tab: string) => {
    setIsLoading(true);
    setSearchParams({ tab });
    // Simulate loading state when switching tabs
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-8 w-[250px]" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      );
    }

    switch (activeTab) {
      case "analytics":
        return <AnalyticsDashboard />;
      case "create-provider":
        return <CreateUtilityProvider />;
      case "manage-providers":
        return <ManageUtilityProviders />;
      default:
        return <AnalyticsDashboard />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header onTabChange={handleTabChange} activeTab={activeTab} />
      <main className="flex-1 bg-background">
        {/* Sticky Header Section */}
        <div className="sticky top-0 z-10 bg-background border-b">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
            {/* Title - Now static */}
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {userName} {t.dashboard}
            </h1>

            {/* Description Text */}
            <div className="px-2 mb-6">
              <p className="text-muted-foreground text-sm">
                {activeTab === "analytics" && t.overview}
                {activeTab === "create-provider" && t.addNew}
                {activeTab === "manage-providers" && t.manageExisting}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="py-8 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>
      <Footer text="© 2024 AYTO. All rights reserved." darkMode={theme === 'dark'} />
    </div>
  );
};

export default GovernmentDashboard;