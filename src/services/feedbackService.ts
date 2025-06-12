import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/ayto';

export interface Discussion {
  id: string;
  title: string;
  message: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Reply {
  id: string;
  message: string;
  authorId: string;
  authorName: string;
  parentId: string;
  parentType: 'DISCUSSION' | 'ANNOUNCEMENT';
  createdAt: string;
  updatedAt: string;
}

class FeedbackService {
  private getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Discussion endpoints
  async getDiscussions() {
    const response = await axios.get(`${API_BASE_URL}/discussions`, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }

  async getDiscussion(id: string) {
    const response = await axios.get(`${API_BASE_URL}/discussions/${id}`, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }

  async createDiscussion(data: { title: string; message: string }) {
    const response = await axios.post(`${API_BASE_URL}/discussions`, data, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }

  async updateDiscussion(id: string, data: { title: string; message: string }) {
    const response = await axios.put(`${API_BASE_URL}/discussions/${id}`, data, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }

  async deleteDiscussion(id: string) {
    const response = await axios.delete(`${API_BASE_URL}/discussions/${id}`, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }

  async searchDiscussions(query: string) {
    const response = await axios.get(`${API_BASE_URL}/discussions/search?query=${encodeURIComponent(query)}`, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }

  async getResidentDiscussions(residentId: string) {
    const response = await axios.get(`${API_BASE_URL}/discussions/resident/${residentId}`, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }

  // Announcement endpoints
  async getAnnouncements() {
    const response = await axios.get(`${API_BASE_URL}/discussions/announcements`, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }

  async getAnnouncement(id: string) {
    const response = await axios.get(`${API_BASE_URL}/discussions/announcements/${id}`, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }

  async createAnnouncement(data: { title: string; message: string }) {
    const response = await axios.post(`${API_BASE_URL}/discussions/announcements`, data, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }

  async updateAnnouncement(id: string, data: { title: string; message: string }) {
    const response = await axios.put(`${API_BASE_URL}/discussions/announcements/${id}`, data, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }

  async deleteAnnouncement(id: string) {
    const response = await axios.delete(`${API_BASE_URL}/discussions/announcements/${id}`, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }

  // Reply endpoints
  async getReplies(parentId: string) {
    const response = await axios.get(`${API_BASE_URL}/discussions/${parentId}/replies`, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }

  async createReply(parentId: string, data: { message: string }) {
    const response = await axios.post(`${API_BASE_URL}/discussions/${parentId}/replies`, data, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }

  async updateReply(id: string, data: { message: string }) {
    const response = await axios.put(`${API_BASE_URL}/discussions/replies/${id}`, data, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }

  async deleteReply(id: string) {
    const response = await axios.delete(`${API_BASE_URL}/discussions/replies/${id}`, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }
}

export const feedbackService = new FeedbackService(); 