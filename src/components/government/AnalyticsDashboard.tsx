
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

export const AnalyticsDashboard = () => {
  const [timeFrame, setTimeFrame] = React.useState('month');
  
  // Calculate statistics
  const totalReports = monthlyReportsData.reduce((acc, item) => acc + item.reports, 0);
  const resolvedReports = 65; // From statusData
  const pendingReports = 45; // From statusData
  const avgResponseTime = responseTimeData.reduce((acc, item) => acc + item.avgDays, 0) / responseTimeData.length;
  
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Reports</CardDescription>
            <CardTitle className="text-2xl">{totalReports}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500 font-medium">12% increase</span> from last month
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Resolved Reports</CardDescription>
            <CardTitle className="text-2xl">{resolvedReports}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(resolvedReports / totalReports) * 100}%` }}></div>
              </div>
              <div className="mt-1">{Math.round((resolvedReports / totalReports) * 100)}% resolution rate</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Reports</CardDescription>
            <CardTitle className="text-2xl">{pendingReports}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground flex items-center">
              <Activity className="h-3 w-3 mr-1 text-amber-500" />
              <span className="text-amber-500 font-medium">8 reports</span> require immediate attention
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg. Response Time</CardDescription>
            <CardTitle className="text-2xl">{avgResponseTime.toFixed(1)} days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground flex items-center">
              <Calendar className="h-3 w-3 mr-1 text-blue-500" />
              <span className="text-blue-500 font-medium">0.5 days faster</span> than last month
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Monthly Reports
              </CardTitle>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsBarChart data={monthlyReportsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(23, 23, 23, 0.8)', 
                    border: 'none',
                    borderRadius: '4px',
                    color: 'white'
                  }} 
                />
                <Bar dataKey="reports" fill="#8884d8" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Reports by Category
              </CardTitle>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
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
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Reports by Status
              </CardTitle>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsBarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(23, 23, 23, 0.8)', 
                    border: 'none',
                    borderRadius: '4px',
                    color: 'white'
                  }} 
                />
                <Bar dataKey="reports" fill="#82ca9d" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Avg. Response Time by Department
              </CardTitle>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsBarChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(23, 23, 23, 0.8)', 
                    border: 'none',
                    borderRadius: '4px',
                    color: 'white'
                  }} 
                />
                <Bar dataKey="avgDays" fill="#FF8042" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
