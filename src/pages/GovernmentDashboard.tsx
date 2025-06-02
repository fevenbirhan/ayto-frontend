import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Clock, ChevronDown, Download, Bell, Building2, BarChart3, ArrowLeft, Home, User, Settings, LogOut } from "lucide-react";
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

// Import our components
import { CreateUtilityProvider } from "@/components/government/CreateUtilityProvider";
import ManageUtilityProviders from "@/components/government/ManageUtilityProviders";
import { AnalyticsDashboard } from "@/components/government/AnalyticsDashboard";

const GovernmentDashboard = () => {
  const [activeTab, setActiveTab] = useState("analytics");
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [unreadNotifications, setUnreadNotifications] = useState(3);

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
      <main className="flex-1 bg-[#1A1A1A]">
        {/* Sticky Header Section */}
        <div className="sticky top-0 z-10 bg-[#1A1A1A] border-b border-[#404040]">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              {/* Left Section: Title and Back Button */}
              <div className="flex items-center gap-4">
                {activeTab !== "analytics" && (
                  <Button
                    variant="ghost"
                    onClick={() => handleTabChange("analytics")}
                    className="text-white hover:bg-[#2D2D2D]"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Button>
                )}
                <div className="space-y-1">
                  <h1 className="text-white text-3xl md:text-4xl font-bold">
                    {activeTab === "analytics" && "Government Dashboard"}
                    {activeTab === "create-provider" && "Create Utility Provider"}
                    {activeTab === "manage-providers" && "Manage Utility Providers"}
                  </h1>
                </div>
              </div>

              {/* Right Section: Action Buttons */}
              <div className="flex items-center gap-4">
                {/* Home Button */}
                <Button 
                  variant="ghost" 
                  className="p-2 text-white hover:bg-[#2D2D2D] rounded-full transition-colors"
                  onClick={() => window.location.href = '/'}
                >
                  <Home className="h-5 w-5" />
                  <span className="sr-only">Home</span>
                </Button>

                {/* Notification Button */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="relative p-2 text-white hover:bg-[#2D2D2D] rounded-full transition-colors"
                    >
                      <Bell className="h-5 w-5" />
                      <span className="sr-only">Notifications</span>
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
                  <SheetContent className="bg-[#2D2D2D] text-white border-[#404040]">
                    <SheetHeader>
                      <SheetTitle className="text-white">Notifications</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 space-y-4">
                      {/* Example notifications */}
                      <div className="p-4 bg-[#404040] rounded-lg">
                        <p className="text-sm font-medium">New Provider Registration</p>
                        <p className="text-xs text-[#A3A3A3] mt-1">Ethio Telecom has registered as a new provider</p>
                        <p className="text-xs text-[#A3A3A3] mt-2">2 hours ago</p>
                      </div>
                      <div className="p-4 bg-[#404040] rounded-lg">
                        <p className="text-sm font-medium">Status Update</p>
                        <p className="text-xs text-[#A3A3A3] mt-1">Addis Ababa Water Supply has been suspended</p>
                        <p className="text-xs text-[#A3A3A3] mt-2">5 hours ago</p>
                      </div>
                      <div className="p-4 bg-[#404040] rounded-lg">
                        <p className="text-sm font-medium">System Alert</p>
                        <p className="text-xs text-[#A3A3A3] mt-1">High number of pending reports in Electricity sector</p>
                        <p className="text-xs text-[#A3A3A3] mt-2">1 day ago</p>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Profile Button */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="p-2 text-white hover:bg-[#2D2D2D] rounded-full transition-colors"
                    >
                      <User className="h-5 w-5" />
                      <span className="sr-only">Profile</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-[#2D2D2D] text-white border-[#404040]">
                    <DropdownMenuItem className="cursor-pointer hover:bg-[#404040]">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer hover:bg-[#404040]">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-[#404040]" />
                    <DropdownMenuItem className="cursor-pointer hover:bg-[#404040] text-red-400">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
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
              <div className="flex gap-2 bg-[#2D2D2D] border border-[#404040] p-1 rounded-md">
                <Button
                  variant="ghost"
                  onClick={() => handleTabChange("analytics")}
                  className={cn(
                    "flex-1",
                    activeTab === "analytics" 
                      ? "bg-[#3B82F6] text-white" 
                      : "text-white/70 hover:bg-[#404040] hover:text-white"
                  )}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => handleTabChange("create-provider")}
                  className={cn(
                    "flex-1",
                    activeTab === "create-provider" 
                      ? "bg-[#3B82F6] text-white" 
                      : "text-white/70 hover:bg-[#404040] hover:text-white"
                  )}
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  Create Provider
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => handleTabChange("manage-providers")}
                  className={cn(
                    "flex-1",
                    activeTab === "manage-providers" 
                      ? "bg-[#3B82F6] text-white" 
                      : "text-white/70 hover:bg-[#404040] hover:text-white"
                  )}
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  Manage Providers
                </Button>
              </div>

              {/* Description Text */}
              <div className="px-2">
                <p className="text-[#A3A3A3] text-sm">
                  {activeTab === "analytics" && "Overview and analytics for government services"}
                  {activeTab === "create-provider" && "Add new utility providers to the system"}
                  {activeTab === "manage-providers" && "Manage existing utility providers"}
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
      <Footer />
    </div>
  );
};

export default GovernmentDashboard;
