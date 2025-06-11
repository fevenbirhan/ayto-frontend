import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, BarChart3, PieChart, Calendar, TrendingUp, Activity, Sun, Moon } from "lucide-react";
import { LineChart, Line, BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/context/AuthContext";
import { TimeRange, CategoryDistributionResponse, StatusDistributionResponse, TeamPerformanceResponse, SystemSummaryResponse, MonthlyTrendsResponse } from "@/types/analytics";
import {
  fetchMonthlyTrends,
  fetchCategoryDistribution,
  fetchStatusDistribution,
  fetchTeamPerformance,
  fetchSystemSummary,
} from "@/services/analyticsService";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

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
  const [timeFrame, setTimeFrame] = React.useState<TimeRange>('month');
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [monthlyTrends, setMonthlyTrends] = React.useState<MonthlyTrendsResponse[]>([]);
  const [categoryDistribution, setCategoryDistribution] = React.useState<CategoryDistributionResponse[]>([]);
  const [statusDistribution, setStatusDistribution] = React.useState<StatusDistributionResponse[]>([]);
  const [teamPerformance, setTeamPerformance] = React.useState<TeamPerformanceResponse[]>([]);
  const [systemSummary, setSystemSummary] = React.useState<SystemSummaryResponse | null>(null);
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useAuth();
  
  const t = translations[language as keyof typeof translations] || translations.en;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [
          trendsData,
          categoriesData,
          statusData,
          teamsData,
          summaryData,
        ] = await Promise.all([
          fetchMonthlyTrends(timeFrame),
          fetchCategoryDistribution(timeFrame),
          fetchStatusDistribution(timeFrame),
          fetchTeamPerformance(timeFrame),
          fetchSystemSummary(timeFrame),
        ]);

        console.log('API Responses:', {
          trendsData,
          categoriesData,
          statusData,
          teamsData,
          summaryData
        });

        setMonthlyTrends(trendsData);
        setCategoryDistribution(categoriesData);
        setStatusDistribution(statusData);
        setTeamPerformance(teamsData);
        setSystemSummary(summaryData);
      } catch (err) {
        console.error('Analytics fetch error details:', err);
        setError('Failed to fetch analytics data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timeFrame]);

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "am" : "en");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

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
          
          <Tabs value={timeFrame} onValueChange={(value) => setTimeFrame(value as TimeRange)}>
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
            <div className="text-2xl font-bold">{systemSummary?.totalReports || 0}</div>
            <p className="text-xs text-muted-foreground">
              {t.cards.fromLastMonth}
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
            <div className="text-2xl font-bold">{systemSummary?.resolvedReports || 0}</div>
            <p className="text-xs text-muted-foreground">
              {((systemSummary?.resolvedReports / systemSummary?.totalReports) * 100 || 0).toFixed(1)}% {t.cards.resolutionRate}
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
            <div className="text-2xl font-bold">
              {systemSummary?.averageResolutionTime?.toFixed(1) || 0} {language === 'am' ? 'ቀናት' : 'days'}
            </div>
            <p className="text-xs text-muted-foreground">
              {t.cards.fromLastMonth}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-2">
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
                  <LineChart data={Array.isArray(monthlyTrends) ? monthlyTrends : []}>
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
                      dataKey="totalReports"
                      stroke="hsl(var(--primary))"
                      name={t.charts.totalReports}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="resolvedReports"
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
        </div>
        
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
                    data={Array.isArray(categoryDistribution) ? categoryDistribution : []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                  >
                    {Array.isArray(categoryDistribution) && categoryDistribution.map((entry, index) => (
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
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              {t.charts.teamPerformance}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={Array.isArray(teamPerformance) ? teamPerformance : []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                  <XAxis dataKey="teamName" stroke="hsl(var(--foreground))" />
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
                    dataKey="completedTasks"
                    fill="hsl(var(--primary))"
                    name={t.charts.tasksCompleted}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="averageResolutionTime"
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