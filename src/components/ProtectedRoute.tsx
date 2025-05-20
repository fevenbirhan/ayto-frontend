import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface ProtectedRouteProps {
    allowedRoles: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const { isAuthenticated, isLoading, userRole } = useAuth();
    const [checkedAuth, setCheckedAuth] = useState(false);
    const location = useLocation();
    const { toast } = useToast();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Wait for auth state to be determined
                if (!isLoading) {
                    setCheckedAuth(true);
                }
            } catch (error) {
                console.error("Error checking authentication:", error);
                toast({
                    title: "Authentication Error",
                    description: "There was a problem verifying your authentication status. Please try logging in again.",
                    variant: "destructive",
                });
                setCheckedAuth(true);
            }
        };

        checkAuth();
    }, [isLoading, toast]);

    // Show loading state while checking auth status
    if (isLoading || !checkedAuth) {
        return (
            <div className="flex flex-col min-h-screen bg-[#27391C]">
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-white text-xl">Loading...</div>
                </div>
            </div>
        );
    }
    
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    // Check if user has required role
    if (userRole && !allowedRoles.includes(userRole)) {
        toast({
            title: "Access Denied",
            description: "You don't have permission to access this page.",
            variant: "destructive",
        });
        return <Navigate to="/" replace />;
    }
    
    // Render child routes if all checks pass
    return <Outlet />;
};

export default ProtectedRoute;