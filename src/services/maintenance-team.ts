import axios from 'axios';
import { Employee } from './employee';

export type WorkStatus = 'FREE' | 'BUSY' | 'OFFLINE';
export type AccountStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING';

export interface MaintenanceTeam {
    maintenanceTeamId: string;
    name: string;
    email: string;
    phoneNumber: string;
    skills: string;
    description: string;
    workStatus: WorkStatus;
    accountStatus: AccountStatus;
    utilityProviderId: string;
    teamLeader: Employee;
    employees: Employee[];
    createdAt: string;
}

export interface CreateMaintenanceTeamData {
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    skills: string;
    description: string;
    utilityProviderId: string;
    teamLeaderId: string;
    employeeIds: string[];
}

class MaintenanceTeamService {
    private baseUrl = 'http://localhost:8080/api/maintenance-teams';

    private getHeaders(token: string) {
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }

    async createMaintenanceTeam(data: CreateMaintenanceTeamData, token: string): Promise<MaintenanceTeam> {
        try {
            const response = await axios.post(
                `${this.baseUrl}/register`,
                {
                    ...data,
                    workStatus: 'FREE',
                    accountStatus: 'ACTIVE'
                },
                { headers: this.getHeaders(token) }
            );
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 403) {
                throw new Error('You do not have permission to create maintenance teams.');
            }
            throw error;
        }
    }

    async getAllMaintenanceTeams(token: string): Promise<MaintenanceTeam[]> {
        try {
            const response = await axios.get(
                `${this.baseUrl}/all`,
                { headers: this.getHeaders(token) }
            );
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 403) {
                throw new Error('You do not have permission to view maintenance teams.');
            }
            throw error;
        }
    }

    async getMaintenanceTeams(utilityProviderId: string, token: string): Promise<MaintenanceTeam[]> {
        try {
            const response = await axios.get(`${this.baseUrl}/utility-provider/${utilityProviderId}`, {
                headers: this.getHeaders(token)
            });
            return response.data;
        } catch (error: any) {
            console.error('Error fetching maintenance teams:', error);
            throw error;
        }
    }

    async getMaintenanceTeamById(teamId: string, token: string): Promise<MaintenanceTeam> {
        try {
            const response = await axios.get(`${this.baseUrl}/${teamId}`, {
                headers: this.getHeaders(token)
            });
            return response.data;
        } catch (error: any) {
            console.error('Error fetching maintenance team:', error);
            throw error;
        }
    }

    async updateMaintenanceTeam(teamId: string, data: Partial<MaintenanceTeam>, token: string): Promise<MaintenanceTeam> {
        try {
            const response = await axios.put(
                `${this.baseUrl}/${teamId}`,
                data,
                { headers: this.getHeaders(token) }
            );
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 403) {
                throw new Error('You do not have permission to update maintenance teams.');
            }
            throw error;
        }
    }

    async deleteMaintenanceTeam(teamId: string, token: string): Promise<void> {
        try {
            await axios.delete(
                `${this.baseUrl}/${teamId}`,
                { headers: this.getHeaders(token) }
            );
        } catch (error: any) {
            if (error.response?.status === 403) {
                throw new Error('You do not have permission to delete maintenance teams.');
            }
            throw error;
        }
    }

    async assignTeamToReport(teamId: string, reportId: string, token: string): Promise<void> {
        try {
            await axios.post(
                `${this.baseUrl}/${teamId}/assign/${reportId}`,
                {},
                { headers: this.getHeaders(token) }
            );
        } catch (error: any) {
            if (error.response?.status === 403) {
                throw new Error('You do not have permission to assign teams to reports.');
            }
            throw error;
        }
    }
}

export const maintenanceTeamService = new MaintenanceTeamService(); 