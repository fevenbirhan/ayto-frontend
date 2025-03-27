
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, CheckCircle2, Clock, AlertCircle, Download } from "lucide-react";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Mock data for utility providers
const utilityProviders = [
  {
    id: "telecom",
    name: "Ethio Telecom",
    reports: [
      { id: "#2001", title: "Network outage", location: "Eastern District", status: "In Progress", priority: "High", assignedDate: "2023-10-14", dueDate: "2023-10-16" },
      { id: "#2008", title: "Internet connectivity issues", location: "Central Business District", status: "Assigned", priority: "Medium", assignedDate: "2023-10-15", dueDate: "2023-10-18" },
    ],
    stats: {
      assigned: 4,
      inProgress: 2,
      completed: 12,
      overdue: 1,
      avgResponseTime: "1.8 days"
    }
  },
  {
    id: "road",
    name: "Road Ministry",
    reports: [
      { id: "#2003", title: "Pothole on main street", location: "Main Street", status: "Assigned", priority: "Medium", assignedDate: "2023-10-14", dueDate: "2023-10-19" },
      { id: "#2005", title: "Traffic light malfunction", location: "5th Avenue Junction", status: "In Progress", priority: "High", assignedDate: "2023-10-13", dueDate: "2023-10-15" },
      { id: "#2009", title: "Road markings faded", location: "Highway 101", status: "Assigned", priority: "Low", assignedDate: "2023-10-15", dueDate: "2023-10-25" },
    ],
    stats: {
      assigned: 5,
      inProgress: 3,
      completed: 8,
      overdue: 2,
      avgResponseTime: "5.2 days"
    }
  },
  {
    id: "water",
    name: "Water & Sewerage Authority",
    reports: [
      { id: "#2002", title: "Broken water pipe", location: "Main St & 5th Ave", status: "In Progress", priority: "High", assignedDate: "2023-10-13", dueDate: "2023-10-15" },
      { id: "#2007", title: "Sewage backup", location: "Residential Area B", status: "Completed", priority: "Urgent", assignedDate: "2023-10-12", dueDate: "2023-10-14" },
    ],
    stats: {
      assigned: 3,
      inProgress: 2,
      completed: 15,
      overdue: 0,
      avgResponseTime: "2.5 days"
    }
  },
  {
    id: "power",
    name: "Power Corporation",
    reports: [
      { id: "#2004", title: "Street light outage", location: "Center Ave", status: "Assigned", priority: "Low", assignedDate: "2023-10-14", dueDate: "2023-10-20" },
      { id: "#2006", title: "Power line down", location: "Industrial Zone", status: "In Progress", priority: "Urgent", assignedDate: "2023-10-13", dueDate: "2023-10-14" },
    ],
    stats: {
      assigned: 4,
      inProgress: 2,
      completed: 10,
      overdue: 1,
      avgResponseTime: "3.1 days"
    }
  }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const UtilityProvidersDashboard = () => {
  const [activeProvider, setActiveProvider] = useState("telecom");
  const [searchQuery, setSearchQuery] = useState("");
  
  const currentProvider = utilityProviders.find(provider => provider.id === activeProvider);
  
  // Generate chart data from the selected provider's stats
  const chartData = currentProvider ? [
    { name: 'Assigned', value: currentProvider.stats.assigned },
    { name: 'In Progress', value: currentProvider.stats.inProgress },
    { name: 'Completed', value: currentProvider.stats.completed },
    { name: 'Overdue', value: currentProvider.stats.overdue },
  ] : [];
  
  // Filter reports based on search query
  const filteredReports = currentProvider ? currentProvider.reports.filter(report => 
    report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.id.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Utility Providers Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeProvider} onValueChange={setActiveProvider}>
            <TabsList className="grid grid-cols-4 mb-6">
              {utilityProviders.map(provider => (
                <TabsTrigger key={provider.id} value={provider.id}>
                  {provider.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {currentProvider && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">{currentProvider.name} Overview</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Active Reports</p>
                            <h4 className="text-3xl font-bold mt-1">
                              {currentProvider.stats.assigned + currentProvider.stats.inProgress}
                            </h4>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Completed</p>
                            <h4 className="text-3xl font-bold mt-1">
                              {currentProvider.stats.completed}
                            </h4>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Avg. Response</p>
                            <h4 className="text-3xl font-bold mt-1">
                              {currentProvider.stats.avgResponseTime}
                            </h4>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Overdue</p>
                            <h4 className="text-3xl font-bold mt-1 text-red-500">
                              {currentProvider.stats.overdue}
                            </h4>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Report Status Distribution</h3>
                    <Card>
                      <CardContent className="pt-6">
                        <ResponsiveContainer width="100%" height={200}>
                          <PieChart>
                            <Pie
                              data={chartData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'rgba(23, 23, 23, 0.8)', 
                                border: 'none',
                                borderRadius: '4px',
                                color: 'white'
                              }} 
                            />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Assigned Reports</h3>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Search reports..."
                          className="pl-8 w-[250px]"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <Button variant="outline" className="gap-1">
                        <Filter className="h-4 w-4" />
                        Filter
                      </Button>
                      <Button variant="outline" className="gap-1">
                        <Download className="h-4 w-4" />
                        Export
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Assigned</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredReports.length > 0 ? (
                          filteredReports.map((report) => (
                            <TableRow key={report.id}>
                              <TableCell className="font-medium">{report.id}</TableCell>
                              <TableCell>{report.title}</TableCell>
                              <TableCell>{report.location}</TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  report.status === 'Assigned' ? 'bg-blue-100 text-blue-800' :
                                  report.status === 'In Progress' ? 'bg-amber-100 text-amber-800' :
                                  report.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {report.status}
                                </span>
                              </TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  report.priority === 'Urgent' ? 'bg-red-100 text-red-800' :
                                  report.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                                  report.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  {report.priority}
                                </span>
                              </TableCell>
                              <TableCell>{report.assignedDate}</TableCell>
                              <TableCell>
                                {new Date(report.dueDate) < new Date() ? (
                                  <span className="text-red-500 flex items-center">
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    {report.dueDate}
                                  </span>
                                ) : (
                                  report.dueDate
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm">View</Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className={`${
                                      report.status === 'Completed' ? 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100' : ''
                                    }`}
                                    disabled={report.status === 'Completed'}
                                  >
                                    {report.status === 'Completed' ? (
                                      <>
                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                        Completed
                                      </>
                                    ) : (
                                      <>
                                        <Clock className="h-3 w-3 mr-1" />
                                        Update
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                              No reports found. Try adjusting your search.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {filteredReports.length > 0 && (
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">
                        Showing {filteredReports.length} of {currentProvider.reports.length} reports
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled>Previous</Button>
                        <Button variant="outline" size="sm">Next</Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
