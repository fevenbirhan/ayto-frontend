import axios from 'axios';
import { Report } from './report';

export interface UtilityProvider {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: 'ADMIN';
  accountStatus: 'ACTIVE' | 'INACTIVE';
  location: string;
  description: string;
  providerType: string;
}

export interface CreateUtilityProviderData {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: 'ADMIN';
  accountStatus: 'ACTIVE';
  location: string;
  description: string;
  providerType: string;
}

class UtilityProviderService {
  private baseUrl = 'http://localhost:8080/ayto/utility-provider';

  private getHeaders(token: string) {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  async createUtilityProvider(data: CreateUtilityProviderData, token: string): Promise<UtilityProvider> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/register`,
        data,
        { headers: this.getHeaders(token) }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('You do not have permission to create utility providers.');
      }
      throw error;
    }
  }

  async getAllUtilityProviders(token: string): Promise<UtilityProvider[]> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/all`,
        { headers: this.getHeaders(token) }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('You do not have permission to view utility providers.');
      }
      throw error;
    }
  }

  async getProviderReports(providerId: string, token: string): Promise<Report[]> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/${providerId}/reports`,
        { headers: this.getHeaders(token) }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('You do not have permission to view provider reports.');
      }
      throw error;
    }
  }

  async activateUtilityProvider(providerId: string, token: string): Promise<UtilityProvider> {
    try {
      const response = await axios.put(
        `${this.baseUrl}/${providerId}/activate`,
        {},
        { headers: this.getHeaders(token) }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('You do not have permission to activate utility providers.');
      }
      throw error;
    }
  }

  async deactivateUtilityProvider(providerId: string, token: string): Promise<UtilityProvider> {
    try {
      const response = await axios.put(
        `${this.baseUrl}/${providerId}/deactivate`,
        {},
        { headers: this.getHeaders(token) }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('You do not have permission to deactivate utility providers.');
      }
      throw error;
    }
  }
}

export const utilityProviderService = new UtilityProviderService(); 