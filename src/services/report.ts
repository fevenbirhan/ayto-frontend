import axios from 'axios';

export interface Report {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string; // Stored as "latitude,longitude" in backend
  locationName: string; // Human-readable location name
  imageUrls: string[];
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
  residentName: string;
  createdAt: string;
  updatedAt: string;
  votes?: number;  // optional
  comments?: any[];
  isEdited: boolean;
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

      const response = await axios.post(this.baseUrl, formData, {
        headers: {
          ...this.getHeaders(token),
        }
      });
      return response.data;
    } catch (error: any) {
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
      const response = await axios.get(`${this.baseUrl}/resident/${userId}`, {
        headers: this.getHeaders(token)
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('You do not have permission to view these reports.');
      }
      throw error;
    }
  }

  async updateReportStatus(reportId: string, status: UpdateReportStatusData, token: string): Promise<Report> {
    try {
      const response = await axios.put(`${this.baseUrl}/${reportId}/status`, status, {
        headers: {
          ...this.getHeaders(token),
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error: any) {
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