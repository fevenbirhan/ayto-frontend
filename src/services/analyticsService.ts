import axios from 'axios';
import {
  TimeRange,
  MonthlyTrendsResponse,
  CategoryDistributionResponse,
  StatusDistributionResponse,
  TeamPerformanceResponse,
  ProviderStatsResponse,
  SystemSummaryResponse
} from '../types/analytics';

// Add base URL for the API
const API_BASE_URL = 'http://localhost:8080'; // Update this with your actual backend URL

const ANALYTICS_API = {
  monthlyTrends: `${API_BASE_URL}/ayto/analytics/reports/monthly`,
  categoryDistribution: `${API_BASE_URL}/ayto/analytics/reports/categories`,
  statusDistribution: `${API_BASE_URL}/ayto/analytics/reports/status`,
  responseTimes: `${API_BASE_URL}/ayto/analytics/reports/response-time`,
  teamPerformance: `${API_BASE_URL}/ayto/analytics/teams/performance`,
  providerStats: (providerId: string) => `${API_BASE_URL}/ayto/analytics/providers/${providerId}/stats`,
  overallProviderStats: `${API_BASE_URL}/ayto/analytics/providers/overall`,
  systemSummary: `${API_BASE_URL}/ayto/analytics/summary`
};

// Function to get auth token
const getAuthToken = () => {
  const token = localStorage.getItem('token');
  console.log('Auth token status:', token ? 'Token exists' : 'No token found');
  return token;
};

// Add axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Adding auth token to request:', config.url);
    } else {
      console.warn('No auth token available for request:', config.url);
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      console.error('Authentication error: Please check your login status');
      // Optionally redirect to login page or refresh token
    }
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
);

export const fetchMonthlyTrends = async (timeRange: TimeRange): Promise<MonthlyTrendsResponse[]> => {
  try {
    const response = await api.get(`${ANALYTICS_API.monthlyTrends}?timeRange=${timeRange}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching monthly trends:', error);
    return [];
  }
};

export const fetchCategoryDistribution = async (timeRange: TimeRange): Promise<CategoryDistributionResponse[]> => {
  try {
    const response = await api.get(`${ANALYTICS_API.categoryDistribution}?timeRange=${timeRange}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching category distribution:', error);
    return [];
  }
};

export const fetchStatusDistribution = async (timeRange: TimeRange): Promise<StatusDistributionResponse[]> => {
  try {
    const response = await api.get(`${ANALYTICS_API.statusDistribution}?timeRange=${timeRange}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching status distribution:', error);
    return [];
  }
};

export const fetchTeamPerformance = async (timeRange: TimeRange): Promise<TeamPerformanceResponse[]> => {
  try {
    const response = await api.get(`${ANALYTICS_API.teamPerformance}?timeRange=${timeRange}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching team performance:', error);
    return [];
  }
};

export const fetchProviderStats = async (providerId: string, timeRange: TimeRange): Promise<ProviderStatsResponse> => {
  try {
    const response = await api.get(`${ANALYTICS_API.providerStats(providerId)}?timeRange=${timeRange}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching provider stats:', error);
    return {
      providerId,
      totalReports: 0,
      resolvedReports: 0,
      averageResponseTime: 0,
      categoryDistribution: []
    };
  }
};

export const fetchOverallProviderStats = async (timeRange: TimeRange): Promise<ProviderStatsResponse[]> => {
  try {
    const response = await api.get(`${ANALYTICS_API.overallProviderStats}?timeRange=${timeRange}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching overall provider stats:', error);
    return [];
  }
};

export const fetchSystemSummary = async (timeRange: TimeRange): Promise<SystemSummaryResponse> => {
  try {
    const response = await api.get(`${ANALYTICS_API.systemSummary}?timeRange=${timeRange}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching system summary:', error);
    return {
      totalReports: 0,
      activeReports: 0,
      resolvedReports: 0,
      averageResolutionTime: 0,
      topCategories: [],
      topTeams: []
    };
  }
}; 