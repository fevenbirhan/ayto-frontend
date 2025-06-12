import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EmailVerification from "./pages/EmailVerification";
import ResidentDashboard from "./pages/ResidentDashboard";
import MyReports from "./pages/MyReports";
import Feedback from "./pages/Feedback";
import HelpSupport from "./pages/HelpSupport";
import GovernmentDashboard from "./pages/GovernmentDashboard";
import NotFound from "./pages/NotFound";
import ResetPassword from "./pages/ResetPassword";
import { ThemeProvider } from "./components/ThemeProvider";
import UtilityProviderDashboard from "./components/utility-provider/UtilityProviderDashboard";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import MaintenanceTeamDashboard from "./components/maintenance-team/MaintenanceTeamDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ResidentDetail from "./pages/ResidentDetail";
import GovernmentOfficeDetail from "./pages/GovernmentOfficeDetail";

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthProvider>
            
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/verify-email" element={<EmailVerification />} />
                <Route path="/register" element={<Register />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route element={<ProtectedRoute allowedRoles={["RESIDENT"]} />}>
                  <Route path="/resident-dashboard" element={<ResidentDashboard />} />
                  <Route path="/my-reports" element={<MyReports />} />
                  <Route path="/feedback" element={<Feedback />} />
                  <Route path="/help-support" element={<HelpSupport />} />
                </Route>
                <Route element={<ProtectedRoute allowedRoles={["ADMIN", "GOVERNMENT_OFFICE"]} />}>
                  <Route path="/government-dashboard" element={<GovernmentDashboard />} />
                  <Route path="/analytics" element={<AnalyticsDashboard />} />
                </Route>
                <Route element={<ProtectedRoute allowedRoles={["UTILITY_PROVIDER"]} />}>
                  <Route path="/utility-provider-dashboard" element={<UtilityProviderDashboard />} />
                </Route>
                <Route element={<ProtectedRoute allowedRoles={["MAINTENANCE_TEAM"]} />}>
                  <Route path="/maintenance-team-dashboard" element={<MaintenanceTeamDashboard />} />
                </Route>
                <Route>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/resident/:id" element={<ResidentDetail />} />
                  <Route path="/admin/office/:id" element={<GovernmentOfficeDetail />} />
                </Route>
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
