import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

interface LoginData {
    email: string;
    password: string;
}

interface AuthResponse {
    token: string;
    userId: string;
    email: string;
    name: string;
    role: 'ADMIN' | 'GOVERNMENT_OFFICE' | 'RESIDENT' | 'UTILITY_PROVIDER' | 'EMPLOYEE';
    accountStatus: 'ACTIVE' | 'INACTIVE' | 'PENDING';
}

interface GovernmentRegisterData {
    name: string;
    email: string;
    password: string;
    phoneNumber: string;
    location: string;
    description: string;
}

interface ResidentRegisterData {
    name: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
}

export const authService = {
    // Login (works for all user types)
    login: async (data: LoginData): Promise<AuthResponse> => {
        const response = await axios.post<AuthResponse>(`${API_URL}/signin`, data);
        return response.data;
    },

    // Government registration
    registerGovernment: async (data: GovernmentRegisterData) => {
        const fullData = {
            ...data,
            role: 'GOVERNMENT_OFFICE',
            accountStatus: 'PENDING', // Default status
            description: data.description || 'Government office'
        };
        return axios.post(`http://localhost:8080/ayto/government-offices/signup`, fullData);
    },

    // Resident registration
    registerResident: async (data: ResidentRegisterData) => {
        const fullData = {
            ...data,
            role: 'RESIDENT',
            accountStatus: 'ACTIVE' // Residents are typically active immediately
        };
        return axios.post(`http://localhost:8080/ayto/residents/signup`, fullData);
    }
};
