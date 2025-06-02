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
    login: async (data: LoginData): Promise<AuthResponse> => {
        try {
            const response = await axios.post<AuthResponse>(`${API_URL}/login`, data);
            
            // Store the token and role in localStorage
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('role', response.data.role);
                localStorage.setItem('userId', response.data.userId);
                localStorage.setItem('accountStatus', response.data.accountStatus);
            }

            return response.data;
        } catch (error: any) {
            console.error('Login error:', error.response?.data);
            throw error;
        }
    },

    registerGovernment: async (data: GovernmentRegisterData) => {
        const fullData = {
            ...data,
            role: 'GOVERNMENT_OFFICE',
            accountStatus: 'PENDING',
            description: data.description || 'Government office'
        };
        return axios.post(`http://localhost:8080/ayto/government-offices/signup`, fullData);
    },

    registerResident: async (data: ResidentRegisterData) => {
        const fullData = {
            ...data,
            role: 'RESIDENT',
            accountStatus: 'ACTIVE'
        };
        return axios.post(`http://localhost:8080/ayto/residents/signup`, fullData);
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        localStorage.removeItem('accountStatus');
    }
};
