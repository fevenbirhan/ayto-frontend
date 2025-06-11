import React, { useState, useEffect } from 'react';
import { TimeRange } from '../types/analytics';
import TimeRangeSelector from '../components/analytics/TimeRangeSelector';
import TrendChart from '../components/analytics/TrendChart';
import DistributionChart from '../components/analytics/DistributionChart';
import {
  fetchMonthlyTrends,
  fetchCategoryDistribution,
  fetchStatusDistribution,
  fetchTeamPerformance,
  fetchSystemSummary,
} from '../services/analyticsService';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, TrendingUp, Calendar } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/context/AuthContext";

const translations = {
  en: {
    title: "Analytics Dashboard",
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
    }
  },
  am: {
    title: "የትንታኔ ዳሽቦርድ",
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
    }
  }
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [categoryDistribution, setCategoryDistribution] = useState([]);
  const [statusDistribution, setStatusDistribution] = useState([]);
  const [teamPerformance, setTeamPerformance] = useState([]);
  const [systemSummary, setSystemSummary] = useState(null);
  const { theme } = useTheme();
  const { language } = useAuth();

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
          fetchMonthlyTrends(timeRange),
          fetchCategoryDistribution(timeRange),
          fetchStatusDistribution(timeRange),
          fetchTeamPerformance(timeRange),
          fetchSystemSummary(timeRange),
        ]);

        setMonthlyTrends(trendsData);
        setCategoryDistribution(categoriesData);
        setStatusDistribution(statusData);
        setTeamPerformance(teamsData);
        setSystemSummary(summaryData);
      } catch (err) {
        setError('Failed to fetch analytics data. Please try again later.');
        console.error('Analytics fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{t.title}</h1>
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="col-span-2">
          <TrendChart
            title={t.charts.monthlyTrends}
            labels={monthlyTrends.map((trend: any) => trend.month)}
            datasets={[
              {
                label: t.charts.totalReports,
                data: monthlyTrends.map((trend: any) => trend.totalReports),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
              },
              {
                label: t.charts.resolvedReports,
                data: monthlyTrends.map((trend: any) => trend.resolvedReports),
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
              },
            ]}
          />
        </div>

        <div>
          <DistributionChart
            title={t.charts.reportCategories}
            labels={categoryDistribution.map((cat: any) => cat.category)}
            data={categoryDistribution.map((cat: any) => cat.count)}
            backgroundColor={COLORS}
          />
        </div>

        <div>
          <DistributionChart
            title={t.charts.teamPerformance}
            labels={teamPerformance.map((team: any) => team.teamName)}
            data={teamPerformance.map((team: any) => team.completedTasks)}
            backgroundColor={COLORS}
          />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 