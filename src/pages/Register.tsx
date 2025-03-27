
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isGovernment, setIsGovernment] = useState<"yes" | "no" | null>(null);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Registration attempt with:", { fullName, email, password, isGovernment });
    
    // Check if passwords match
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    
    // Redirect based on user type
    if (isGovernment === "yes") {
      navigate("/government-dashboard");
    } else {
      navigate("/resident-dashboard");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-[#27391C] py-16">
        <div className="w-full max-w-md bg-[#18230F] p-8 rounded-lg shadow-lg">
          <h1 className="text-[#255F38] text-3xl font-bold mb-6 text-center">Register</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-white text-lg">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                required
                className="bg-[#1E2A13] text-white border-[#255F38]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white text-lg">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
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
                placeholder="Create a password"
                required
                className="bg-[#1E2A13] text-white border-[#255F38]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white text-lg">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                className="bg-[#1E2A13] text-white border-[#255F38]"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-white text-lg">Are you a government body?</Label>
              <RadioGroup 
                value={isGovernment || ""} 
                onValueChange={(value) => setIsGovernment(value as "yes" | "no")}
                className="flex flex-col gap-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="yes" 
                    id="government-yes"
                    className="text-[#255F38] border-[#255F38]" 
                  />
                  <Label htmlFor="government-yes" className="text-white">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="no" 
                    id="government-no"
                    className="text-[#255F38] border-[#255F38]" 
                  />
                  <Label htmlFor="government-no" className="text-white">No</Label>
                </div>
              </RadioGroup>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-[#6C7719] text-white text-xl font-bold hover:bg-[#5a6415]"
              disabled={!fullName || !email || !password || !confirmPassword || !isGovernment}
            >
              Register
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-white">
              Already have an account?{" "}
              <Link to="/login" className="text-[#255F38] hover:underline font-medium">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
