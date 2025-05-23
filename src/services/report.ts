import axios from 'axios';

export interface Report {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface CreateReportData {
  title: string;
  description: string;
  category: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  latitude: number;
  longitude: number;
}

class ReportService {
  private baseUrl = '/api/reports';

  async createReport(data: CreateReportData): Promise<Report> {
    const response = await axios.post(this.baseUrl, data);
    return response.data;
  }

  async getReports(): Promise<Report[]> {
    const response = await axios.get(this.baseUrl);
    return response.data;
  }

  async getReportById(id: string): Promise<Report> {
    const response = await axios.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async updateReport(id: string, data: Partial<CreateReportData>): Promise<Report> {
    const response = await axios.patch(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  async deleteReport(id: string): Promise<void> {
    await axios.delete(`${this.baseUrl}/${id}`);
  }

  async getReportsByUser(userId: string): Promise<Report[]> {
    const response = await axios.get(`${this.baseUrl}/user/${userId}`);
    return response.data;
  }

  async getReportsByStatus(status: Report['status']): Promise<Report[]> {
    const response = await axios.get(`${this.baseUrl}/status/${status}`);
    return response.data;
  }

  async updateReportStatus(id: string, status: Report['status']): Promise<Report> {
    const response = await axios.patch(`${this.baseUrl}/${id}/status`, { status });
    return response.data;
  }
}

export const reportService = new ReportService(); 