import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { authService } from "@/services/auth";
import { useToast } from "@/components/ui/use-toast";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    nationalId: "",
    location: "",
    description: ""
  });
  
  const [userType, setUserType] = useState<"resident"|"government">("resident");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({ title: "Error", description: "Passwords don't match!", variant: "destructive" });
      return;
    }

    try {
      setIsLoading(true);
      
      if (userType === "government") {
        await authService.registerGovernment({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password,
          phoneNumber: formData.phoneNumber,
          location: formData.location,
          description: formData.description
        });
      } else {
        await authService.registerResident({
          name: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          phoneNumber: formData.phoneNumber,
          nationalId: formData.nationalId
        });
      }

      toast({ title: "Success", description: "Registration successful! Please login." });
      navigate("/login");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-[#27391C] py-16">
        <div className="w-full max-w-md bg-[#18230F] p-8 rounded-lg shadow-lg">
          <h1 className="text-[#255F38] text-3xl font-bold mb-6 text-center">Register</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-white">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First name"
                  required
                  className="bg-[#1E2A13] text-white border-[#255F38]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-white">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last name"
                  required
                  className="bg-[#1E2A13] text-white border-[#255F38]"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email address"
                required
                className="bg-[#1E2A13] text-white border-[#255F38]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-white">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Phone number"
                required
                className="bg-[#1E2A13] text-white border-[#255F38]"
              />
            </div>
            
            {userType === "resident" && (
              <div className="space-y-2">
                <Label htmlFor="nationalId" className="text-white">National ID</Label>
                <Input
                  id="nationalId"
                  value={formData.nationalId}
                  onChange={handleInputChange}
                  placeholder="National ID"
                  required
                  className="bg-[#1E2A13] text-white border-[#255F38]"
                />
              </div>
            )}
            
            {userType === "government" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-white">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Office location"
                    required
                    className="bg-[#1E2A13] text-white border-[#255F38]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Office description"
                    required
                    className="bg-[#1E2A13] text-white border-[#255F38]"
                  />
                </div>
              </>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                required
                className="bg-[#1E2A13] text-white border-[#255F38]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm password"
                required
                className="bg-[#1E2A13] text-white border-[#255F38]"
              />
            </div>
            
            <div className="space-y-2 pt-2">
              <Label className="text-white">User Type</Label>
              <RadioGroup 
                value={userType}
                onValueChange={(value) => setUserType(value as "resident" | "government")}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="resident" id="user-resident" />
                  <Label htmlFor="user-resident" className="text-white">Resident</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="government" id="user-government" />
                  <Label htmlFor="user-government" className="text-white">Government</Label>
                </div>
              </RadioGroup>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-[#6C7719] text-white hover:bg-[#5a6415] mt-4"
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
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