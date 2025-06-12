import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Clock, ChevronDown, Download, Bell, Building2, BarChart3, ArrowLeft, Home, User, Settings, LogOut, Sun, Moon, Languages } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
    overview: "ለመንግስት አገልግሎቶች አጠቃላይ እይታ �ና ትንታኔ",
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
  const [activeTab, setActiveTab] = useState("analytics");
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, userName } = useAuth();
  
  const t = translations[language as keyof typeof translations] || translations.en;

  const priorityOptions = ["Urgent", "High", "Medium", "Low"];
  const statusOptions = ["Pending", "Assigned", "In Progress", "Resolved", "Rejected"];
  const departmentOptions = [
    "Ethio Telecom",
    "Road Ministry",
    "Water & Sewerage Authority",
    "Power Corporation"
  ];

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (value: string) => {
    setIsLoading(true);
    setActiveTab(value);
    // Simulate loading state when switching tabs
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "am" : "en");
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
      <Header />
      <main className="flex-1 bg-background">
        {/* Sticky Header Section */}
        <div className="sticky top-0 z-10 bg-background border-b">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              {/* Left Section: Title and Back Button */}
              <div className="flex items-center gap-4">
                {activeTab !== "analytics" && (
                  <Button
                    variant="ghost"
                    onClick={() => handleTabChange("analytics")}
                    className="hover:bg-accent"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t.backToDashboard}
                  </Button>
                )}
                <div className="space-y-1">
                  <h1 className="text-3xl md:text-4xl font-bold">
                    {activeTab === "analytics" && `${userName} ${t.dashboard}`}
                    {activeTab === "create-provider" && t.createProvider}
                    {activeTab === "manage-providers" && t.manageProviders}
                  </h1>
                </div>
              </div>

              {/* Right Section: Action Buttons */}
              <div className="flex items-center gap-2">
                {/* Theme Toggle */}
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={toggleTheme}
                  className="rounded-full"
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                  <span className="sr-only">Toggle theme</span>
                </Button>

                {/* Language Toggle */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="rounded-full"
                    >
                      <Languages className="h-5 w-5" />
                      <span className="sr-only">{t.language}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem 
                      onClick={() => setLanguage("en")}
                      className={cn(language === "en" && "bg-accent")}
                    >
                      {t.english}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setLanguage("am")}
                      className={cn(language === "am" && "bg-accent")}
                    >
                      {t.amharic}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Home Button */}
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="rounded-full"
                  onClick={() => window.location.href = '/'}
                >
                  <Home className="h-5 w-5" />
                  <span className="sr-only">{t.home}</span>
                </Button>

                {/* Notification Button */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="relative rounded-full"
                    >
                      <Bell className="h-5 w-5" />
                      <span className="sr-only">{t.notifications}</span>
                      {unreadNotifications > 0 && (
                        <Badge 
                          variant="destructive" 
                          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
                        >
                          {unreadNotifications}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>{t.notifications}</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 space-y-4">
                      {/* Example notifications */}
                      <div className="p-4 bg-accent rounded-lg">
                        <p className="text-sm font-medium">{t.newProvider}</p>
                        <p className="text-xs text-muted-foreground mt-1">Ethio Telecom has registered as a new provider</p>
                        <p className="text-xs text-muted-foreground mt-2">2 hours ago</p>
                      </div>
                      <div className="p-4 bg-accent rounded-lg">
                        <p className="text-sm font-medium">{t.statusUpdate}</p>
                        <p className="text-xs text-muted-foreground mt-1">Addis Ababa Water Supply has been suspended</p>
                        <p className="text-xs text-muted-foreground mt-2">5 hours ago</p>
                      </div>
                      <div className="p-4 bg-accent rounded-lg">
                        <p className="text-sm font-medium">{t.systemAlert}</p>
                        <p className="text-xs text-muted-foreground mt-1">High number of pending reports in Electricity sector</p>
                        <p className="text-xs text-muted-foreground mt-2">1 day ago</p>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Profile Button */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="rounded-full"
                    >
                      <User className="h-5 w-5" />
                      <span className="sr-only">{t.profile}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>{t.profile}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>{t.settings}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{t.logout}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="py-8 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            {/* Navigation Tabs */}
            <div className="space-y-6">
              <div className="flex gap-2 bg-muted p-1 rounded-lg">
                <Button
                  variant="ghost"
                  onClick={() => handleTabChange("analytics")}
                  className={cn(
                    "flex-1",
                    activeTab === "analytics" 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-accent"
                  )}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  {t.analytics}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => handleTabChange("create-provider")}
                  className={cn(
                    "flex-1",
                    activeTab === "create-provider" 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-accent"
                  )}
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  {t.create}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => handleTabChange("manage-providers")}
                  className={cn(
                    "flex-1",
                    activeTab === "manage-providers" 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-accent"
                  )}
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  {t.manage}
                </Button>
              </div>

              {/* Description Text */}
              <div className="px-2">
                <p className="text-muted-foreground text-sm">
                  {activeTab === "analytics" && t.overview}
                  {activeTab === "create-provider" && t.addNew}
                  {activeTab === "manage-providers" && t.manageExisting}
                </p>
              </div>

              {/* Content Area */}
              <div className="mt-6">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer text="© 2024 AYTO. All rights reserved." darkMode={theme === 'dark'} />
    </div>
  );
};

export default GovernmentDashboard;