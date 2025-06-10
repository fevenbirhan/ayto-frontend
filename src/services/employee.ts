import axios from 'axios';

export type AccountStatus = 'ACTIVE' | 'INACTIVE';
export type Role = 'ADMIN' | 'EMPLOYEE' | 'UTILITY_PROVIDER' | 'GOVERNMENT_OFFICE' | 'RESIDENT' | 'MAINTENANCE_TEAM';

export interface Employee {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  nationalId: string;
  role: Role;
  accountStatus: AccountStatus;
  utilityProviderId: string;
  isTeamLeader?: boolean;
}

export interface CreateEmployeeData {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  nationalId: string;
  password: string;
  role: Role;
  accountStatus: AccountStatus;
  utilityProviderId: string;
}

class EmployeeService {
  private baseUrl = 'http://localhost:8080/ayto/employees';

  private getHeaders(token: string) {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  async createEmployee(data: CreateEmployeeData, token: string): Promise<Employee> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/signup`,
        {
          ...data,
          role: 'EMPLOYEE'
        },
        { headers: this.getHeaders(token) }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('You do not have permission to create employees.');
      }
      throw error;
    }
  }

  async getAllEmployees(token: string): Promise<Employee[]> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/all`,
        { headers: this.getHeaders(token) }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('You do not have permission to view employees.');
      }
      throw error;
    }
  }

  async getEmployeesByProvider(providerId: string, token: string): Promise<Employee[]> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/utility-provider/${providerId}`,
        { headers: this.getHeaders(token) }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('You do not have permission to view provider employees.');
      }
      throw error;
    }
  }

  async updateEmployee(employeeId: string, data: Partial<Employee>, token: string): Promise<Employee> {
    try {
      // When updating team leader status, we need to ensure the role stays as EMPLOYEE
      const updateData = {
        ...data,
        role: 'EMPLOYEE'
      };

      const response = await axios.put(
        `${this.baseUrl}/update/${employeeId}`,
        updateData,
        { headers: this.getHeaders(token) }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('You do not have permission to update employees.');
      }
      throw error;
    }
  }

  async deleteEmployee(employeeId: string, token: string): Promise<void> {
    try {
      await axios.delete(
        `${this.baseUrl}/delete/${employeeId}`,
        { headers: this.getHeaders(token) }
      );
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('You do not have permission to delete employees.');
      }
      throw error;
    }
  }
}

export const employeeService = new EmployeeService(); 