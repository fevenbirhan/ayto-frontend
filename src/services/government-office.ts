import axios from "axios";
import { API_URL } from "@/config";

export const governmentOfficeService = {
  initiateRegistration: async (data: { email: string; name: string }) => {
    const response = await axios.post(`${API_URL}/ayto/government-offices/initiate-signup`, data);
    return response.data;
  },

  verifyEmail: async (data: { email: string; otp: string }) => {
    const response = await axios.post(`${API_URL}/ayto/government-offices/verify-email`, data);
    return response.data;
  },

  registerGovernmentOffice: async (data: any, token: string) => {
    const response = await axios.post(`${API_URL}/ayto/government-offices/signup`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  // Add other methods as needed for your application
  getAllGovernmentOffices: async (token: string) => {
    const response = await axios.get(`${API_URL}/ayto/government-offices/all`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  updateGovernmentOffice: async (id: string, data: any, token: string) => {
    const response = await axios.put(`${API_URL}/ayto/government-offices/update/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  // ... other CRUD operations
};