import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
    allowedRoles: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const { isAuthenticated, isLoading, userRole } = useAuth();
    const [checkedAuth, setCheckedAuth] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            setCheckedAuth(true);
        }
    }, [isLoading]);

    // Show loading state while checking auth status
    if (isLoading || !checkedAuth) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }
    
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    
    // Check if user has required role
    if (userRole && !allowedRoles.includes(userRole)) {
        return <Navigate to="/" replace />; // Or to an "unauthorized" page
    }
    
    // Render child routes if all checks pass
    return <Outlet />;
};

export default ProtectedRoute;