import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageContent } from "@/components/layout/PageContent";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "@/services/auth";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, isAuthenticated, userRole } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await authService.login({ email, password });
      
      // Store auth data (sync with AuthContext)
      localStorage.setItem("token", response.token);
      localStorage.setItem("userId", response.userId);
      localStorage.setItem("role", response.role);
      localStorage.setItem("accountStatus", response.accountStatus);
      
      // Update AuthContext state
      await login(email, password); // This will sync isAuthenticated/userRole
      
      toast({ title: "Success", description: "Login successful!" });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Invalid email or password";
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect when auth state is confirmed
  useEffect(() => {
    if (isAuthenticated && userRole) {
      const accountStatus = localStorage.getItem("accountStatus");
      if (accountStatus !== 'ACTIVE') {
        navigate("/pending-approval");
      } else if (userRole === 'GOVERNMENT_OFFICE') {
        navigate("/government-dashboard");
      } else if (userRole === 'RESIDENT') {
        navigate("/resident-dashboard?tab=community");
      }
    }
  }, [isAuthenticated, userRole, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <PageContent className="flex items-center justify-center">
        <div className="w-full max-w-md bg-[#2D2D2D] p-8 rounded-lg shadow-lg">
          <h1 className="text-white text-3xl font-bold mb-6 text-center">Login</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#1A1A1A] text-white border-[#404040]"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#1A1A1A] text-white border-[#404040]"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white mt-4"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-white">
              Don't have an account?{" "}
              <Link to="/register" className="text-[#3B82F6] hover:underline font-medium">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </PageContent>
      <Footer />
    </div>
  );
};

export default Login;
