
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt with:", { email, password });
    // Here you would typically handle authentication
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-[#27391C] py-16">
        <div className="w-full max-w-md bg-[#18230F] p-8 rounded-lg shadow-lg">
          <h1 className="text-[#255F38] text-3xl font-bold mb-6 text-center">Login</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white text-lg">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="bg-[#1E2A13] text-white border-[#255F38]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white text-lg">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="bg-[#1E2A13] text-white border-[#255F38]"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-[#6C7719] text-white text-xl font-bold hover:bg-[#5a6415]"
            >
              Login
            </Button>
          </form>
          
          <div className="mt-6 text-center">
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
