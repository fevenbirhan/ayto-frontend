import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';
const AYTO_URL = 'http://localhost:8080/ayto';

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
    role?: string;
    accountStatus?: string;
}

interface ResidentRegisterData {
    name: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    nationalId: string;
    role?: string;
    accountStatus?: string;
}

interface EmailVerificationResponse {
    success: boolean;
    message: string;
}

interface OTPResponse {
    success: boolean;
    message: string;
    expiresIn?: number;
}

interface VerifyOTPResponse {
    success: boolean;
    message: string;
    email: string;
    isVerified: boolean;
}

interface ResetPasswordResponse {
    success: boolean;
    message: string;
}

interface ResetPasswordRequest {
    token: string;
    newPassword: string;
    confirmPassword: string;
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

    // Government Office Email Verification and Registration
    initiateGovernmentSignup: async (email: string): Promise<EmailVerificationResponse> => {
        try {
            const response = await axios.post(`${AYTO_URL}/government-offices/initiate-signup`, { email });
            return {
                success: true,
                message: response.data.message || "OTP sent successfully"
            };
        } catch (error: any) {
            console.error('Government signup initiation error:', error.response?.data);
            throw error;
        }
    },

    verifyGovernmentEmail: async (email: string, otp: string): Promise<EmailVerificationResponse> => {
        try {
            const response = await axios.post(`${AYTO_URL}/government-offices/verify-email`, { 
                email, 
                otp
            });
            
            // Check if the response indicates success
            const success = response.data === "Email verified successfully";
            
            if (success) {
                // Store verified email in localStorage for registration
                localStorage.setItem('verifiedEmail', email);
                localStorage.setItem('emailVerificationType', 'government');
                localStorage.setItem('emailVerificationTimestamp', Date.now().toString());
            }
            
            return {
                success,
                message: response.data || (success ? "Email verified successfully" : "Failed to verify email")
            };
        } catch (error: any) {
            console.error('Government email verification error:', error.response?.data);
            throw error;
        }
    },

    registerGovernment: async (data: GovernmentRegisterData) => {
        const fullData = {
            ...data,
            role: 'GOVERNMENT_OFFICE',
            accountStatus: 'PENDING'
        };
        return axios.post(`${AYTO_URL}/government-offices/signup`, fullData);
    },

    // Resident Email Verification and Registration
    initiateResidentSignup: async (email: string): Promise<EmailVerificationResponse> => {
        try {
            const response = await axios.post(`${AYTO_URL}/residents/initiate-signup`, { email });
            return {
                success: true,
                message: response.data.message || "OTP sent successfully"
            };
        } catch (error: any) {
            console.error('Resident signup initiation error:', error.response?.data);
            throw error;
        }
    },

    verifyResidentEmail: async (email: string, otp: string): Promise<EmailVerificationResponse> => {
        try {
            const response = await axios.post(`${AYTO_URL}/residents/verify-email`, { 
                email, 
                otp
            });
            
            // Check if the response indicates success based on the controller's response
            const success = response.data === "Email verified successfully";
            
            if (success) {
                // Store verified email in localStorage for registration
                localStorage.setItem('verifiedEmail', email);
                localStorage.setItem('emailVerificationType', 'resident');
                localStorage.setItem('emailVerificationTimestamp', Date.now().toString());
            }
            
            return {
                success,
                message: response.data || (success ? "Email verified successfully" : "Failed to verify email")
            };
        } catch (error: any) {
            console.error('Resident email verification error:', error.response?.data);
            throw error;
        }
    },

    registerResident: async (data: ResidentRegisterData) => {
        const fullData = {
            ...data,
            role: 'RESIDENT',
            accountStatus: 'ACTIVE'
        };
        return axios.post(`${AYTO_URL}/residents/signup`, fullData);
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        localStorage.removeItem('accountStatus');
        localStorage.removeItem('verifiedEmail');
        localStorage.removeItem('emailVerificationType');
        localStorage.removeItem('emailVerificationTimestamp');
    },

    // New OTP methods
    requestOTP: async (email: string): Promise<OTPResponse> => {
        try {
            const response = await axios.post<OTPResponse>(`${API_URL}/request-otp`, { email });
            return response.data;
        } catch (error: any) {
            console.error('OTP request error:', error.response?.data);
            throw error;
        }
    },

    verifyOTP: async (email: string, otp: string): Promise<VerifyOTPResponse> => {
        try {
            const response = await axios.post<VerifyOTPResponse>(`${API_URL}/verify-otp`, { 
                email, 
                otp 
            });
            
            if (response.data.success) {
                // Store verified email in localStorage for registration
                localStorage.setItem('verifiedEmail', email);
                localStorage.setItem('emailVerificationTimestamp', Date.now().toString());
            }
            
            return response.data;
        } catch (error: any) {
            console.error('OTP verification error:', error.response?.data);
            throw error;
        }
    },

    isEmailVerified: (email: string, type: 'government' | 'resident'): boolean => {
        const verifiedEmail = localStorage.getItem('verifiedEmail');
        const verificationType = localStorage.getItem('emailVerificationType');
        const verificationTimestamp = localStorage.getItem('emailVerificationTimestamp');
        
        if (!verifiedEmail || !verificationTimestamp || !verificationType) {
            return false;
        }

        // Check if verification is not older than 30 minutes
        const thirtyMinutes = 30 * 60 * 1000;
        const isExpired = Date.now() - parseInt(verificationTimestamp) > thirtyMinutes;

        if (isExpired) {
            authService.clearEmailVerification();
            return false;
        }

        return verifiedEmail === email && verificationType === type;
    },

    clearEmailVerification: () => {
        localStorage.removeItem('verifiedEmail');
        localStorage.removeItem('emailVerificationType');
        localStorage.removeItem('emailVerificationTimestamp');
    },

    // Password Reset Methods
    requestPasswordReset: async (email: string): Promise<ResetPasswordResponse> => {
        try {
            const response = await axios.post(`${API_URL}/forgot-password`, { email });
            return {
                success: true,
                message: response.data.message || "Reset token sent successfully"
            };
        } catch (error: any) {
            console.error('Password reset request error:', error.response?.data);
            throw error;
        }
    },

    resetPassword: async (token: string, newPassword: string, confirmPassword: string): Promise<ResetPasswordResponse> => {
        try {
            const data: ResetPasswordRequest = {
                token,
                newPassword,
                confirmPassword
            };
            const response = await axios.post(`${API_URL}/reset-password`, data);
            return {
                success: true,
                message: response.data.message || "Password reset successfully"
            };
        } catch (error: any) {
            console.error('Password reset error:', error.response?.data);
            throw error;
        }
    }
};
