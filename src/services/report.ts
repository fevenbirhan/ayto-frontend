import axios from 'axios';
import { ReportRouter } from './report-router';

export interface Report {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string; // Stored as "latitude,longitude" in backend
  locationName: string; // Human-readable location name
  imageUrls: string[];
  status: 'PENDING' | 'IN_PROGRESS' | 'HELP_REQUESTED' | 'RESOLVED' | 'REJECTED';
  residentName: string;
  createdAt: string;
  updatedAt: string;
  upvotes: number;  // Separate count for upvotes
  downvotes: number;  // Separate count for downvotes
  isEdited: boolean;
  assignedTeamId?: string;
  utilityProviderId?: string;
}

export interface CreateReportFormFields {
  title: string;
  description: string;
  category: string;
  latitude: number;
  longitude: number;
  images: File[];
}

export interface UpdateReportStatusData {
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
}

class ReportService {
  private baseUrl = 'http://localhost:8080/ayto/reports';

  private getHeaders(token: string) {
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${token}`,
    };
    return headers;
  }

  async getAllReports(token: string): Promise<Report[]> {
    try {
      const response = await axios.get(this.baseUrl, {
        headers: this.getHeaders(token)
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('You do not have permission to view reports.');
      }
      throw error;
    }
  }

  async createReport(formData: FormData, token: string): Promise<Report> {
    try {
      // Ensure locationName is included in formData if not already present
      if (!formData.has('locationName')) {
        const location = formData.get('location') as string;
        if (location) {
          const [lat, lng] = location.split(',');
          const locationName = await this.getLocationName(parseFloat(lat), parseFloat(lng));
          formData.append('locationName', locationName);
        }
      }

      console.log('Creating report with data:', {
        title: formData.get('title'),
        category: formData.get('category'),
        location: formData.get('location'),
        locationName: formData.get('locationName')
      });

      // Create the report
      const response = await axios.post(this.baseUrl, formData, {
        headers: {
          ...this.getHeaders(token),
        }
      });

      const createdReport = response.data;
      console.log('Report created successfully:', createdReport);

      // Find matching provider
      const matchingProvider = await ReportRouter.findMatchingProvider(createdReport, token);
      
      if (matchingProvider) {
        console.log('Found matching provider:', matchingProvider.id);
        try {
          // Update the report with the provider ID
          const updatedReport = await axios.put(
            `${this.baseUrl}/${createdReport.id}/status`,
            { 
              status: 'PENDING',
              utilityProviderId: matchingProvider.id 
            },
            {
              headers: {
                ...this.getHeaders(token),
                'Content-Type': 'application/json'
              }
            }
          );
          console.log('Report assigned to provider:', updatedReport.data);
          return updatedReport.data;
        } catch (error) {
          console.error('Failed to assign provider, but report was created:', error);
          return createdReport;
        }
      }

      return createdReport;
    } catch (error: any) {
      console.error('Error in createReport:', error);
      if (error.response?.status === 403) {
        throw new Error('You do not have permission to create reports.');
      }
      throw error;
    }
  }

  async getReportById(reportId: string, token: string): Promise<Report> {
    try {
      const response = await axios.get(`${this.baseUrl}/${reportId}`, {
        headers: this.getHeaders(token)
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('You do not have permission to view this report.');
      }
      throw error;
    }
  }

  async getReportsByUser(userId: string, token: string): Promise<Report[]> {
    try {
      // First get the user's reports
      const response = await axios.get(`${this.baseUrl}/resident/${userId}`, {
        headers: this.getHeaders(token)
      });
      
      // Then get the full details for each report to ensure we have current vote counts
      const reports = await Promise.all(
        response.data.map(async (report: Report) => {
          const fullReport = await this.getReportById(report.id, token);
          return fullReport;
        })
      );
      
      return reports;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('You do not have permission to view these reports.');
      }
      throw error;
    }
  }

  async updateReportStatus(
    reportId: string, 
    data: UpdateReportStatusData & { utilityProviderId?: string }, 
    token: string
  ): Promise<Report> {
    try {
      console.log('Updating report status:', {
        reportId,
        status: data.status,
        utilityProviderId: data.utilityProviderId
      });

      const response = await axios.put(
        `${this.baseUrl}/${reportId}/status`,
        data,
        {
          headers: {
            ...this.getHeaders(token),
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error updating report status:', error);
      if (error.response?.status === 403) {
        throw new Error('You do not have permission to update report status.');
      }
      throw error;
    }
  }

  async deleteReport(reportId: string, token: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${reportId}`, {
        headers: this.getHeaders(token)
      });
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('You do not have permission to delete reports.');
      }
      throw error;
    }
  }

  async upvoteReport(reportId: string, token: string): Promise<Report> {
    try {
      const response = await axios.post(`${this.baseUrl}/${reportId}/upvote`, {}, {
        headers: this.getHeaders(token)
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('You do not have permission to vote on reports.');
      }
      throw error;
    }
  }

  async downvoteReport(reportId: string, token: string): Promise<Report> {
    try {
      const response = await axios.post(`${this.baseUrl}/${reportId}/downvote`, {}, {
        headers: this.getHeaders(token)
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('You do not have permission to vote on reports.');
      }
      throw error;
    }
  }

  async updateReport(reportId: string, formData: FormData, token: string): Promise<Report> {
    try {
      // Ensure locationName is included in formData if not already present
      if (!formData.has('locationName')) {
        const location = formData.get('location') as string;
        if (location) {
          const [lat, lng] = location.split(',');
          const locationName = await this.getLocationName(parseFloat(lat), parseFloat(lng));
          formData.append('locationName', locationName);
        }
      }

      // Set isEdited flag
      formData.append('isEdited', 'true');

      const response = await axios.put(`${this.baseUrl}/${reportId}`, formData, {
        headers: {
          ...this.getHeaders(token),
        }
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('You do not have permission to update reports.');
      }
      throw error;
    }
  }

  async assignMaintenanceTeam(reportId: string, teamId: string, token: string): Promise<Report> {
    try {
      const response = await axios.post(
        `http://localhost:8080/ayto/utility-provider/reports/${reportId}/assign/${teamId}`,
        {},
        { headers: this.getHeaders(token) }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('You do not have permission to assign maintenance teams.');
      }
      throw error;
    }
  }

  async getAssignedReports(maintenanceTeamId: string, token: string): Promise<Report[]> {
    try {
      // Since the team ID should be in the JWT token, we don't need to pass it in the URL
      const response = await axios.get(
        `http://localhost:8080/api/maintenance-teams/assigned-reports`,
        { headers: this.getHeaders(token) }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('You do not have permission to view assigned reports.');
      }
      throw error;
    }
  }

  async updateReportStatusByMaintenanceTeam(
    reportId: string,
    status: 'IN_PROGRESS' | 'HELP_REQUESTED' | 'RESOLVED' | 'REJECTED',
    token: string
  ): Promise<Report> {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/maintenance-teams/reports/${reportId}/status`,
        { status },
        { headers: this.getHeaders(token) }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('You do not have permission to update report status.');
      }
      throw error;
    }
  }

  // Helper function to get location name from coordinates using reverse geocoding
  private async getLocationName(lat: number, lng: number): Promise<string> {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      return response.data.display_name || `${lat}, ${lng}`;
    } catch (error) {
      console.error('Error getting location name:', error);
      return `${lat}, ${lng}`;
    }
  }
}

export const reportService = new ReportService();