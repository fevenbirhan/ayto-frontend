import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth";

interface AuthContextType {
    token: string | null;
    userRole: string | null;
    userName: string | null;
    userId: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [userRole, setUserRole] = useState<string | null>(localStorage.getItem("role"));
    const [userName, setUserName] = useState<string | null>(localStorage.getItem("userName"));
    const [userId, setUserId] = useState<string | null>(localStorage.getItem("userId"));
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // Effect to verify token on app load
    useEffect(() => {
        const verifyToken = async () => {
            try {
                if (!token) {
                    setIsLoading(false);
                    return;
                }

                // Check if token is expired
                const tokenParts = token.split('.');
                if (tokenParts.length === 3) {
                    const payload = JSON.parse(atob(tokenParts[1]));
                    if (payload.exp && payload.exp * 1000 < Date.now()) {
                        // Token is expired
                        logout();
                        return;
                    }
                }
                setIsLoading(false);
            } catch (error) {
                console.error('Token verification failed:', error);
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
            
            setToken(response.token);
            setUserRole(response.role);
            setUserName(response.name);
            setUserId(response.userId);

            // Persist to localStorage
            localStorage.setItem("token", response.token);
            localStorage.setItem("role", response.role);
            localStorage.setItem("userName", response.name);
            localStorage.setItem("userId", response.userId);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Logout function
    const logout = () => {
        authService.logout(); // This will clear localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userName");
        localStorage.removeItem("userId");
        setToken(null);
        setUserRole(null);
        setUserName(null);
        setUserId(null);
        navigate("/login");
    };

    // Context value
    const value = {
        token,
        userRole,
        userName,
        userId,
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