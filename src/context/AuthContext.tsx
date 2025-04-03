import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth";

interface AuthContextType {
    token: string | null;
    userRole: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [userRole, setUserRole] = useState<string | null>(localStorage.getItem("role"));
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // Effect to verify token on app load
    useEffect(() => {
        const verifyToken = async () => {
            try {
                if (token) {
                    // In a real app, you would verify the token with your backend here
                    // For now, we'll just assume it's valid if it exists
                    setIsLoading(false);
                } else {
                    setIsLoading(false);
                }
            } catch (error) {
                logout();
                setIsLoading(false);
            }
        };

        verifyToken();
    }, [token]);

    // Login function
    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await authService.login({ email, password });
            
            // Store token and role
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", response.data.role);
            
            setToken(response.data.token);
            setUserRole(response.data.role);
            setIsLoading(false);
            
            // Redirect based on role
            if (response.data.role === "ADMIN" || response.data.role === "GOVERNMENT") {
                navigate("/government-dashboard");
            } else {
                navigate("/resident-dashboard");
            }
        } catch (error) {
            setIsLoading(false);
            throw error;
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setToken(null);
        setUserRole(null);
        navigate("/login");
    };

    // Context value
    const value = {
        token,
        userRole,
        login,
        logout,
        isAuthenticated: !!token,
        isLoading,
    };

    return (
        <AuthContext.Provider value={value}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};