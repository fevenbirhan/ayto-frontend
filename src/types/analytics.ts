export type TimeRange = 'week' | 'month' | 'quarter' | 'year';

export interface MonthlyTrendsResponse {
  month: string;
  totalReports: number;
  resolvedReports: number;
  pendingReports: number;
  resolutionRate: number;
}

export interface CategoryDistributionResponse {
  category: string;
  count: number;
  percentage: number;
}

export interface StatusDistributionResponse {
  status: string;
  count: number;
  percentage: number;
}

export interface TeamPerformanceResponse {
  teamName: string;
  teamId: string;
  totalTasks: number;
  completedTasks: number;
  averageResolutionTime: number;
  completionRate: number;
  onTimeCompletionRate: number;
  statusCount: {
    assigned: number;
    inProgress: number;
    completed: number;
    overdue: number;
  };
}

export interface ProviderStatsResponse {
  providerId: string;
  totalReports: number;
  resolvedReports: number;
  averageResponseTime: number;
  categoryDistribution: CategoryDistributionResponse[];
}

export interface SystemSummaryResponse {
  totalReports: number;
  activeReports: number;
  resolvedReports: number;
  averageResolutionTime: number;
  topCategories: CategoryDistributionResponse[];
  topTeams: TeamPerformanceResponse[];
} 