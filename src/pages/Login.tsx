import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "@/services/auth";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await authService.login({ email, password });
      
      // Store auth data
      localStorage.setItem("token", response.token);
      localStorage.setItem("userId", response.userId);
      localStorage.setItem("role", response.role);
      localStorage.setItem("accountStatus", response.accountStatus);
      
      // Redirect based on role and status
      if (response.accountStatus !== 'ACTIVE') {
        navigate("/pending-approval");
      } else if (response.role === 'GOVERNMENT_OFFICE') {
        navigate("/government-dashboard");
      } else if (response.role === 'RESIDENT') {
        navigate("/resident-dashboard");
      } else {
        navigate("/");
      }
      
      toast({ title: "Success", description: "Login successful!" });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Invalid email or password";
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-[#27391C] py-16">
        <div className="w-full max-w-md bg-[#18230F] p-8 rounded-lg shadow-lg">
          <h1 className="text-[#255F38] text-3xl font-bold mb-6 text-center">Login</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                className="bg-[#1E2A13] text-white border-[#255F38]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="bg-[#1E2A13] text-white border-[#255F38]"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-[#6C7719] text-white hover:bg-[#5a6415] mt-4"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-white">
              Don't have an account?{" "}
              <Link to="/register" className="text-[#255F38] hover:underline font-medium">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;