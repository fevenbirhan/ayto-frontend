import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Clock, UserCog, ChevronDown, Download, Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";

// Import components we'll create
import { ReportQueue } from "@/components/government/ReportQueue";
import { AssignmentPanel } from "@/components/government/AssignmentPanel";
import { AnalyticsDashboard } from "@/components/government/AnalyticsDashboard";
import { UtilityProvidersDashboard } from "@/components/government/UtilityProvidersDashboard";
import { MaintenanceTeamsDashboard } from "@/components/government/MaintenanceTeamsDashboard";
import { NotificationsCenter } from "@/components/government/NotificationsCenter";
import { AdminSettings } from "@/components/government/AdminSettings";

const GovernmentDashboard = () => {
  const [activeTab, setActiveTab] = useState("queue");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({
    from: null,
    to: null,
  });

  const priorityOptions = ["Urgent", "High", "Medium", "Low"];
  const statusOptions = ["Pending", "Assigned", "In Progress", "Resolved", "Rejected"];
  const departmentOptions = [
    "Ethio Telecom",
    "Road Ministry",
    "Water & Sewerage Authority",
    "Power Corporation"
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-[#27391C] py-8 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h1 className="text-white text-3xl md:text-4xl font-bold">Government Dashboard</h1>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/60" />
                <Input
                  type="search"
                  placeholder="Search reports..."
                  className="pl-8 bg-[#18230F] text-white border-[#255F38] w-full md:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-1 bg-[#18230F] text-white border-[#255F38] hover:bg-[#1e2a13]">
                    <Filter className="h-4 w-4" />
                    Filters
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-[#18230F] text-white border-[#255F38]">
                  <div className="p-2">
                    <p className="font-medium mb-2">Priority</p>
                    <div className="flex flex-wrap gap-1">
                      {priorityOptions.map(priority => (
                        <Button 
                          key={priority}
                          variant={selectedPriority === priority ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedPriority(
                            selectedPriority === priority ? null : priority
                          )}
                          className={`text-xs ${selectedPriority === priority ? 'bg-[#255F38] text-white' : 'bg-transparent text-white border-[#255F38]'}`}
                        >
                          {priority}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-[#255F38]/30" />
                  
                  <div className="p-2">
                    <p className="font-medium mb-2">Status</p>
                    <div className="flex flex-wrap gap-1">
                      {statusOptions.map(status => (
                        <Button 
                          key={status}
                          variant={selectedStatus === status ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedStatus(
                            selectedStatus === status ? null : status
                          )}
                          className="text-xs"
                        >
                          {status}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-[#255F38]/30" />
                  
                  <div className="p-2">
                    <p className="font-medium mb-2">Department</p>
                    <div className="flex flex-wrap gap-1">
                      {departmentOptions.map(dept => (
                        <Button 
                          key={dept}
                          variant={selectedDepartment === dept ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedDepartment(
                            selectedDepartment === dept ? null : dept
                          )}
                          className="text-xs"
                        >
                          {dept.split(' ')[0]}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-[#255F38]/30" />
                  
                  <div className="p-2 flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="bg-transparent text-white border-[#255F38]"
                      onClick={() => {
                        setSelectedPriority(null);
                        setSelectedStatus(null);
                        setSelectedDepartment(null);
                        setDateRange({ from: null, to: null });
                      }}
                    >
                      Clear All
                    </Button>
                    <Button 
                      size="sm"
                      className="bg-[#6C7719] text-white hover:bg-[#5a6415]"
                    >
                      Apply Filters
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button 
                variant="outline" 
                className="gap-1 bg-[#18230F] text-white border-[#255F38] hover:bg-[#1e2a13]"
              >
                <Clock className="h-4 w-4" />
                Recent
              </Button>
              
              <Button 
                variant="outline" 
                className="gap-1 bg-[#18230F] text-white border-[#255F38] hover:bg-[#1e2a13]"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
              
              <Button className="bg-[#6C7719] text-white hover:bg-[#5a6415]">
                <Bell className="h-4 w-4" />
                <span className="sr-only">Notifications</span>
                <span className="ml-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6 bg-[#18230F] border border-[#255F38] p-1">
              <TabsTrigger 
                value="queue" 
                className="data-[state=active]:bg-[#255F38] data-[state=active]:text-white text-white/70"
              >
                Incoming Queue
              </TabsTrigger>
              <TabsTrigger 
                value="assigned" 
                className="data-[state=active]:bg-[#255F38] data-[state=active]:text-white text-white/70"
              >
                Assigned Reports
              </TabsTrigger>
              <TabsTrigger 
                value="utility" 
                className="data-[state=active]:bg-[#255F38] data-[state=active]:text-white text-white/70"
              >
                Utility Providers
              </TabsTrigger>
              <TabsTrigger 
                value="maintenance" 
                className="data-[state=active]:bg-[#255F38] data-[state=active]:text-white text-white/70"
              >
                Maintenance Teams
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="data-[state=active]:bg-[#255F38] data-[state=active]:text-white text-white/70"
              >
                Analytics
              </TabsTrigger>
              <TabsTrigger 
                value="admin" 
                className="data-[state=active]:bg-[#255F38] data-[state=active]:text-white text-white/70"
              >
                Admin
              </TabsTrigger>
            </TabsList>

            <TabsContent value="queue" className="mt-0">
              <ReportQueue searchQuery={searchQuery} filters={{
                priority: selectedPriority,
                status: selectedStatus,
                department: selectedDepartment,
                dateRange
              }} />
            </TabsContent>

            <TabsContent value="assigned" className="mt-0">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Assigned Reports</h2>
                  
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Assigned To</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">#1234</TableCell>
                          <TableCell>Broken water pipe</TableCell>
                          <TableCell>Water & Sewerage</TableCell>
                          <TableCell>Maintenance Team A</TableCell>
                          <TableCell>
                            <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">In Progress</span>
                          </TableCell>
                          <TableCell>
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">High</span>
                          </TableCell>
                          <TableCell>2023-10-15</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">View</Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">#1235</TableCell>
                          <TableCell>Street light outage</TableCell>
                          <TableCell>Power Corporation</TableCell>
                          <TableCell>Team B</TableCell>
                          <TableCell>
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Resolved</span>
                          </TableCell>
                          <TableCell>
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">Medium</span>
                          </TableCell>
                          <TableCell>2023-10-14</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">View</Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">#1236</TableCell>
                          <TableCell>Pothole on main street</TableCell>
                          <TableCell>Road Ministry</TableCell>
                          <TableCell>Road Crew 2</TableCell>
                          <TableCell>
                            <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">Assigned</span>
                          </TableCell>
                          <TableCell>
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">Low</span>
                          </TableCell>
                          <TableCell>2023-10-13</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">View</Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-sm text-muted-foreground">Showing 3 of 24 reports</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" disabled>Previous</Button>
                      <Button variant="outline" size="sm">Next</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="utility" className="mt-0">
              <UtilityProvidersDashboard />
            </TabsContent>

            <TabsContent value="maintenance" className="mt-0">
              <MaintenanceTeamsDashboard />
            </TabsContent>

            <TabsContent value="analytics" className="mt-0">
              <AnalyticsDashboard />
            </TabsContent>

            <TabsContent value="admin" className="mt-0">
              <AdminSettings />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GovernmentDashboard;
