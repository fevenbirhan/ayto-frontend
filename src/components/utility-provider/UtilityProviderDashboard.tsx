import { useState, useEffect, useContext } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { AuthContext } from "@/context/AuthContext";
import { BarChart3, Bell, Building2, Home, Settings, User, LogOut, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateMaintenanceTeam } from "@/components/utility-provider/CreateMaintenanceTeam";
import CreateEmployee from "@/components/utility-provider/CreateEmployee";
import { ReportsList } from "@/components/utility-provider/ReportsList";
import ReturnedReports from "@/components/utility-provider/ReturnedReports";
import FeedbackSection from "@/components/utility-provider/FeedbackSection";
import MaintenanceTeamsList from "@/components/utility-provider/MaintenanceTeamsList";
import { employeeService, Employee } from "@/services/employee";

const UtilityProviderDashboard = () => {
  const [activeTab, setActiveTab] = useState("reports");
  const [isLoading, setIsLoading] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const { toast } = useToast();
  const { token, userId, userName, logout } = useContext(AuthContext);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      if (token && userId) {
        const employeesData = await employeeService.getEmployeesByProvider(userId, token);
        setEmployees(employeesData);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast({
        title: "Error",
        description: "Failed to load employees data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token && userId) {
      fetchEmployees();
    }
  }, [token, userId, refreshTrigger]);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const handleEmployeeCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleTeamCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 bg-[#1A1A1A]">
        {/* Sticky Header Section */}
        <div className="sticky top-0 z-10 bg-[#1A1A1A] border-b border-[#404040]">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-white text-3xl font-bold">{userName}</h1>
                <p className="text-gray-400 mt-1">Utility Provider Dashboard</p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  className="p-2 text-white hover:bg-[#2D2D2D] rounded-full"
                  onClick={() => window.location.href = '/'}
                >
                  <Home className="h-5 w-5" />
                  <span className="sr-only">Home</span>
                </Button>

                {/* Notifications */}
                <Button 
                  variant="ghost" 
                  className="relative p-2 text-white hover:bg-[#2D2D2D] rounded-full"
                >
                  <Bell className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
                    >
                      {unreadNotifications}
                    </Badge>
                  )}
                </Button>

                {/* Profile Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="p-2 text-white hover:bg-[#2D2D2D] rounded-full"
                    >
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-[#2D2D2D] text-white border-[#404040]">
                    <DropdownMenuItem className="hover:bg-[#404040] cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-[#404040] cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-[#404040]" />
                    <DropdownMenuItem 
                      className="text-red-400 hover:bg-[#404040] cursor-pointer"
                      onClick={handleLogout}
                    >
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
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-[#2D2D2D] border border-[#404040]">
              <TabsTrigger
                value="reports"
                className="data-[state=active]:bg-[#3B82F6] data-[state=active]:text-white"
              >
                Incoming Reports
              </TabsTrigger>
              <TabsTrigger
                value="employees"
                className="data-[state=active]:bg-[#3B82F6] data-[state=active]:text-white"
              >
                Employees
              </TabsTrigger>
              <TabsTrigger
                value="maintenance-teams"
                className="data-[state=active]:bg-[#3B82F6] data-[state=active]:text-white"
              >
                Maintenance Teams
              </TabsTrigger>
              <TabsTrigger
                value="returned-reports"
                className="data-[state=active]:bg-[#3B82F6] data-[state=active]:text-white"
              >
                Returned Reports
              </TabsTrigger>
              <TabsTrigger
                value="feedback"
                className="data-[state=active]:bg-[#3B82F6] data-[state=active]:text-white"
              >
                Feedback
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reports" className="mt-6">
              <ReportsList />
            </TabsContent>

            <TabsContent value="employees" className="mt-6">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">Employees</h2>
                  <CreateEmployee onSuccess={handleEmployeeCreated} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {employees.map((employee) => (
                    <Card key={employee.id} className="bg-[#2D2D2D] border-[#404040]">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-white text-lg">{employee.name}</CardTitle>
                          <Badge 
                            className={employee.isTeamLeader 
                              ? "bg-purple-500/20 text-purple-500"
                              : "bg-blue-500/20 text-blue-500"
                            }
                          >
                            {employee.isTeamLeader ? "Team Leader" : "Employee"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <p className="text-sm text-gray-400">Email</p>
                          <p className="text-white">{employee.email}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm text-gray-400">Phone</p>
                          <p className="text-white">{employee.phoneNumber}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm text-gray-400">Address</p>
                          <p className="text-white">{employee.address}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {employees.length === 0 && !isLoading && (
                    <div className="col-span-full text-center py-12">
                      <p className="text-gray-400">No employees available</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="maintenance-teams" className="mt-6">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">Maintenance Teams</h2>
                  <CreateMaintenanceTeam onClose={handleTeamCreated} />
                </div>
                <MaintenanceTeamsList refreshTrigger={refreshTrigger} />
              </div>
            </TabsContent>

            <TabsContent value="returned-reports" className="mt-6">
              <ReturnedReports />
            </TabsContent>

            <TabsContent value="feedback" className="mt-6">
              <FeedbackSection />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer text="© 2024 AYTO. All rights reserved." darkMode={true} />
    </div>
  );
};

export default UtilityProviderDashboard; 