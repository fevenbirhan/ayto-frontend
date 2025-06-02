import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, BarChart3, PieChart, Calendar, TrendingUp, Activity } from "lucide-react";
import { LineChart, Line, BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data for the charts
const monthlyReportsData = [
  { name: 'Jan', reports: 65 },
  { name: 'Feb', reports: 59 },
  { name: 'Mar', reports: 80 },
  { name: 'Apr', reports: 81 },
  { name: 'May', reports: 56 },
  { name: 'Jun', reports: 55 },
  { name: 'Jul', reports: 40 },
  { name: 'Aug', reports: 70 },
  { name: 'Sep', reports: 90 },
  { name: 'Oct', reports: 72 },
  { name: 'Nov', reports: 0 },
  { name: 'Dec', reports: 0 },
];

const categoryData = [
  { name: 'Water Issues', value: 40 },
  { name: 'Road Damage', value: 30 },
  { name: 'Electricity', value: 20 },
  { name: 'Telecom', value: 10 },
];

const statusData = [
  { name: 'Pending', reports: 45 },
  { name: 'Assigned', reports: 30 },
  { name: 'In Progress', reports: 20 },
  { name: 'Resolved', reports: 65 },
  { name: 'Rejected', reports: 10 },
];

const responseTimeData = [
  { name: 'Water', avgDays: 2.5 },
  { name: 'Roads', avgDays: 5.2 },
  { name: 'Electricity', avgDays: 1.8 },
  { name: 'Telecom', avgDays: 3.1 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Mock data - replace with actual API data
const reportCategories = [
  { name: "Water", value: 35 },
  { name: "Electricity", value: 25 },
  { name: "Waste", value: 20 },
  { name: "Roads", value: 15 },
  { name: "Other", value: 5 },
];

const monthlyTrends = [
  { month: "Jan", reports: 65, resolved: 45 },
  { month: "Feb", reports: 75, resolved: 60 },
  { month: "Mar", reports: 85, resolved: 70 },
  { month: "Apr", reports: 95, resolved: 80 },
  { month: "May", reports: 105, resolved: 90 },
  { month: "Jun", reports: 115, resolved: 100 },
];

const teamPerformance = [
  { team: "Water", tasks: 120, avgTime: 2.5 },
  { team: "Electricity", tasks: 95, avgTime: 3.2 },
  { team: "Waste", tasks: 85, avgTime: 2.8 },
  { team: "Roads", tasks: 75, avgTime: 4.1 },
];

export const AnalyticsDashboard = () => {
  const [timeFrame, setTimeFrame] = React.useState('month');
  
  // Calculate statistics
  const totalReports = monthlyReportsData.reduce((acc, item) => acc + item.reports, 0);
  const resolvedReports = 65; // From statusData
  const pendingReports = 45; // From statusData
  const avgResponseTime = responseTimeData.reduce((acc, item) => acc + item.avgDays, 0) / responseTimeData.length;
  
  const totalResolved = monthlyTrends.reduce((sum, month) => sum + month.resolved, 0);
  const avgResolutionTime = teamPerformance.reduce((sum, team) => sum + team.avgTime, 0) / teamPerformance.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <div className="flex items-center gap-2 mt-2 md:mt-0">
          <Tabs value={timeFrame} onValueChange={setTimeFrame}>
            <TabsList>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="quarter">Quarter</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" className="ml-2 gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReports}</div>
            <p className="text-xs text-muted-foreground">
              +{((totalReports - 500) / 500 * 100).toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalResolved}</div>
            <p className="text-xs text-muted-foreground">
              {((totalResolved / totalReports) * 100).toFixed(1)}% resolution rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Resolution Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgResolutionTime.toFixed(1)} days</div>
            <p className="text-xs text-muted-foreground">
              -0.5 days from last month
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="reports"
                    stroke="#8884d8"
                    name="Total Reports"
                  />
                  <Line
                    type="monotone"
                    dataKey="resolved"
                    stroke="#82ca9d"
                    name="Resolved Reports"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Report Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={reportCategories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {reportCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Team Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={teamPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="team" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Bar
                    yAxisId="left"
                    dataKey="tasks"
                    fill="#8884d8"
                    name="Tasks Completed"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="avgTime"
                    fill="#82ca9d"
                    name="Avg. Resolution Time (days)"
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
