import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { authService } from "@/services/auth";
import { useToast } from "@/components/ui/use-toast";
import { PasswordInput } from "@/components/ui/password-input";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    nationalId: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Get user type and verified email from location state
  const userType = location.state?.userType || "resident";
  const verifiedEmail = location.state?.verifiedEmail;

  // Check for verified email on component mount
  useEffect(() => {
    if (!verifiedEmail || !authService.isEmailVerified(verifiedEmail, userType)) {
      toast({
        title: "Email Verification Required",
        description: "Please verify your email before registering",
        variant: "destructive",
      });
      navigate("/verify-email");
      return;
    }

    // Pre-fill the email field with verified email
    setFormData(prev => ({
      ...prev,
      email: verifiedEmail
    }));
  }, [verifiedEmail, userType, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Double check email verification
    if (!authService.isEmailVerified(formData.email, userType)) {
      toast({
        title: "Error",
        description: "Email verification has expired. Please verify your email again.",
        variant: "destructive",
      });
      navigate("/verify-email");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      if (userType === 'government') {
        const governmentData = {
          name: formData.firstName,
          email: formData.email,
          password: formData.password,
          phoneNumber: formData.phoneNumber
        };
        await authService.registerGovernment(governmentData);
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
      
      // Clear email verification after successful registration
      authService.clearEmailVerification();
      
      toast({
        title: "Success",
        description: userType === 'government' 
          ? "Registration successful! Please wait for approval."
          : "Registration successful! You can now login.",
      });
      navigate("/login");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Registration failed";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-[#1A1A1A] py-16">
        <div className="w-full max-w-md bg-[#2D2D2D] p-8 rounded-lg shadow-lg">
          <h1 className="text-white text-3xl font-bold mb-6 text-center">
            {userType === 'government' ? 'Government Office Registration' : 'Resident Registration'}
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {userType === 'resident' ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-white">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="bg-[#1A1A1A] text-white border-[#404040]"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-white">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="bg-[#1A1A1A] text-white border-[#404040]"
                    required
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-white">Office Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="Office name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="bg-[#1A1A1A] text-white border-[#404040]"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                className="bg-[#1A1A1A] text-white border-[#404040]"
                required
                disabled // Email is pre-filled and cannot be changed
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-white">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="Phone number"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="bg-[#1A1A1A] text-white border-[#404040]"
                required
              />
            </div>

            {userType === 'resident' && (
              <div className="space-y-2">
                <Label htmlFor="nationalId" className="text-white">National ID</Label>
                <Input
                  id="nationalId"
                  name="nationalId"
                  placeholder="National ID"
                  value={formData.nationalId}
                  onChange={handleChange}
                  className="bg-[#1A1A1A] text-white border-[#404040]"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <PasswordInput
                id="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="bg-[#1A1A1A] text-white border-[#404040]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="bg-[#1A1A1A] text-white border-[#404040]"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white mt-4"
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-white">
              Already have an account?{" "}
              <Link to="/login" className="text-[#3B82F6] hover:underline font-medium">
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
    