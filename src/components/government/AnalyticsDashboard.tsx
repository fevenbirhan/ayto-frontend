import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, BarChart3, PieChart, Calendar, TrendingUp, Activity, Sun, Moon } from "lucide-react";
import { LineChart, Line, BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/context/AuthContext";

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

// Translation dictionary
const translations = {
  en: {
    title: "Analytics Dashboard",
    timeFrames: {
      week: "Week",
      month: "Month",
      quarter: "Quarter",
      year: "Year"
    },
    cards: {
      totalReports: "Total Reports",
      resolvedReports: "Resolved Reports",
      avgResolutionTime: "Avg. Resolution Time",
      fromLastMonth: "from last month",
      resolutionRate: "resolution rate"
    },
    charts: {
      monthlyTrends: "Monthly Trends",
      reportCategories: "Report Categories",
      teamPerformance: "Team Performance",
      totalReports: "Total Reports",
      resolvedReports: "Resolved Reports",
      tasksCompleted: "Tasks Completed",
      avgResTime: "Avg. Resolution Time (days)"
    },
    buttons: {
      export: "Export",
      toggleLanguage: "ቋንቋ ቀይር",
      toggleTheme: "Toggle Theme"
    }
  },
  am: {
    title: "የትንታኔ ዳሽቦርድ",
    timeFrames: {
      week: "ሳምንት",
      month: "ወር",
      quarter: "ሩብ ዓመት",
      year: "ዓመት"
    },
    cards: {
      totalReports: "ጠቅላላ ሪፖርቶች",
      resolvedReports: "የተፈቱ ሪፖርቶች",
      avgResolutionTime: "አማካይ የፍትህ ጊዜ",
      fromLastMonth: "ከባለፈው ወር",
      resolutionRate: "የፍትህ መጠን"
    },
    charts: {
      monthlyTrends: "ወርሃዊ አዝማሚያዎች",
      reportCategories: "የሪፖርት ምድቦች",
      teamPerformance: "የቡድን አፈፃፀም",
      totalReports: "ጠቅላላ ሪፖርቶች",
      resolvedReports: "የተፈቱ ሪፖርቶች",
      tasksCompleted: "የተጠናቀቁ ተግባራት",
      avgResTime: "አማካይ የፍትህ ጊዜ (ቀናት)"
    },
    buttons: {
      export: "ምረቃ",
      toggleLanguage: "Change Language",
      toggleTheme: "ጨረቃ ቀይር"
    }
  }
};

export const AnalyticsDashboard = () => {
  const [timeFrame, setTimeFrame] = React.useState('month');
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useAuth();
  
  const t = translations[language as keyof typeof translations] || translations.en;
  
  // Calculate statistics
  const totalReports = monthlyReportsData.reduce((acc, item) => acc + item.reports, 0);
  const resolvedReports = 65; // From statusData
  const pendingReports = 45; // From statusData
  const avgResponseTime = responseTimeData.reduce((acc, item) => acc + item.avgDays, 0) / responseTimeData.length;
  
  const totalResolved = monthlyTrends.reduce((sum, month) => sum + month.resolved, 0);
  const avgResolutionTime = teamPerformance.reduce((sum, team) => sum + team.avgTime, 0) / teamPerformance.length;

  

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "am" : "en");
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          {t.title}
        </h2>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleLanguage}
            className="gap-1"
          >
            {t.buttons.toggleLanguage}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleTheme}
            className="gap-1"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {t.buttons.toggleTheme}
          </Button>
          
          <Tabs value={timeFrame} onValueChange={setTimeFrame}>
            <TabsList className="bg-background">
              <TabsTrigger value="week">{t.timeFrames.week}</TabsTrigger>
              <TabsTrigger value="month">{t.timeFrames.month}</TabsTrigger>
              <TabsTrigger value="quarter">{t.timeFrames.quarter}</TabsTrigger>
              <TabsTrigger value="year">{t.timeFrames.year}</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button variant="outline" className="gap-1">
            <Download className="h-4 w-4" />
            {t.buttons.export}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t.cards.totalReports}
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReports}</div>
            <p className="text-xs text-muted-foreground">
              +{((totalReports - 500) / 500 * 100).toFixed(1)}% {t.cards.fromLastMonth}
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t.cards.resolvedReports}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalResolved}</div>
            <p className="text-xs text-muted-foreground">
              {((totalResolved / totalReports) * 100).toFixed(1)}% {t.cards.resolutionRate}
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t.cards.avgResolutionTime}
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgResolutionTime.toFixed(1)} {language === 'am' ? 'ቀናት' : 'days'}</div>
            <p className="text-xs text-muted-foreground">
              -0.5 {language === 'am' ? 'ቀናት' : 'days'} {t.cards.fromLastMonth}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              {t.charts.monthlyTrends}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                  <XAxis dataKey="month" stroke="hsl(var(--foreground))" />
                  <YAxis stroke="hsl(var(--foreground))" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "var(--radius)"
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="reports"
                    stroke="hsl(var(--primary))"
                    name={t.charts.totalReports}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="resolved"
                    stroke="hsl(var(--secondary))"
                    name={t.charts.resolvedReports}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              {t.charts.reportCategories}
            </CardTitle>
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
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "var(--radius)"
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              {t.charts.teamPerformance}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={teamPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                  <XAxis dataKey="team" stroke="hsl(var(--foreground))" />
                  <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--primary))" />
                  <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--secondary))" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "var(--radius)"
                    }}
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="tasks"
                    fill="hsl(var(--primary))"
                    name={t.charts.tasksCompleted}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="avgTime"
                    fill="hsl(var(--secondary))"
                    name={t.charts.avgResTime}
                    radius={[4, 4, 0, 0]}
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