import {
    createContext,
    useContext,
    ReactNode,
    useState,
    useEffect
} from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth";
import { Role } from "@/services/employee";


// ----------------- Auth Context -----------------
export interface AuthContextType {
    token: string | null;
    userRole: Role | null;
    userName: string | null;
    userId: string | null;
    maintenanceTeamId?: string;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
    // Language related properties
    language: "en" | "am";
    setLanguage: (lang: "en" | "am") => void;
    toggleLanguage: () => void;
    // Theme related properties
    theme: "light" | "dark";
    toggleTheme: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ----------------- Auth Provider -----------------
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [userRole, setUserRole] = useState<Role | null>(localStorage.getItem("role") as Role | null);
    const [userName, setUserName] = useState<string | null>(localStorage.getItem("userName"));
    const [userId, setUserId] = useState<string | null>(localStorage.getItem("userId"));
    const [maintenanceTeamId, setMaintenanceTeamId] = useState<string | undefined>(
        localStorage.getItem("maintenanceTeamId") || undefined
    );
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    // ----------------- Theme state -----------------
    const [theme, setTheme] = useState<"light" | "dark">(() => {
        return (localStorage.getItem("theme") as "light" | "dark") || "light";
    });

    useEffect(() => {
        document.body.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === "light" ? "dark" : "light"));
    };

    // ----------------- Language state -----------------
    const [language, setLanguage] = useState<"en" | "am">(() => {
        return (localStorage.getItem("language") as "en" | "am") || "en";
    });

    useEffect(() => {
        localStorage.setItem("language", language);
    }, [language]);

    const toggleLanguage = () => {
        setLanguage(prev => (prev === "en" ? "am" : "en"));
    };

    // ----------------- Auth Token Verification -----------------
    useEffect(() => {
        const verifyToken = async () => {
            try {
                if (!token) {
                    setIsLoading(false);
                    return;
                }

                const tokenParts = token.split(".");
                if (tokenParts.length === 3) {
                    const payload = JSON.parse(atob(tokenParts[1]));
                    if (payload.exp && payload.exp * 1000 < Date.now()) {
                        logout();
                        return;
                    }
                }
                setIsLoading(false);
            } catch (error) {
                console.error("Token verification failed:", error);
                logout();
                setIsLoading(false);
            }
        };

        verifyToken();
    }, [token]);
    // Navigate to admin dashboard if user is admin
useEffect(() => {
    if (token && userRole === "admin") {
      navigate("/adminDashboard");
    }
  }, [token, userRole, navigate]);
  

    // ----------------- Auth Functions -----------------
    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await authService.login({ email, password });

            setToken(response.token);
            setUserRole(response.role as Role);
            setUserName(response.name);
            setUserId(response.userId);

            if (response.role === 'MAINTENANCE_TEAM') {
                setMaintenanceTeamId(response.maintenanceTeamId);
            }

            localStorage.setItem("token", response.token);
            localStorage.setItem("role", response.role);
            localStorage.setItem("userName", response.name);
            localStorage.setItem("userId", response.userId);
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userName");
        localStorage.removeItem("userId");
        localStorage.removeItem("maintenanceTeamId");
        setToken(null);
        setUserRole(null);
        setUserName(null);
        setUserId(null);
        setMaintenanceTeamId(undefined);
        navigate("/login");
    };

    const authValue: AuthContextType = {
        token,
        userRole,
        userName,
        userId,
        maintenanceTeamId,
        login,
        logout,
        isAuthenticated: !!token,
        isLoading,
        // Language context
        language,
        setLanguage,
        toggleLanguage,
        // Theme context
        theme,
        toggleTheme,
    };

    return (
        <AuthContext.Provider value={authValue}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};

// ----------------- Custom Hook -----------------
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};