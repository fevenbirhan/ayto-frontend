import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { authService } from "@/services/auth";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const EmailVerification = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [userType, setUserType] = useState<"resident" | "government">("resident");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGetOTP = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = userType === "government" 
        ? await authService.initiateGovernmentSignup(email)
        : await authService.initiateResidentSignup(email);
      
      toast({
        title: "Success",
        description: response.message || "OTP sent successfully! Please check your email.",
      });
      
      setIsOtpSent(true);
      // Start countdown for resend (2 minutes)
      setCountdown(120);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to send OTP";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      toast({
        title: "Error",
        description: "Please enter the OTP",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = userType === "government"
        ? await authService.verifyGovernmentEmail(email, otp)
        : await authService.verifyResidentEmail(email, otp);
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Email verified successfully!",
        });
        // Navigate to register page with verified email and type
        navigate("/register", { 
          state: { 
            verifiedEmail: email,
            userType 
          } 
        });
      } else {
        toast({
          title: "Error",
          description: response.message || "Invalid OTP",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to verify OTP";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-[#1A1A1A] py-16">
        <div className="w-full max-w-md bg-[#2D2D2D] p-8 rounded-lg shadow-lg">
          <h1 className="text-white text-3xl font-bold mb-6 text-center">
            Email Verification
          </h1>

          <div className="space-y-6">
            {!isOtpSent && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Account Type</Label>
                  <RadioGroup
                    value={userType}
                    onValueChange={(value: "resident" | "government") => setUserType(value)}
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
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isOtpSent}
                className="bg-[#1A1A1A] text-white border-[#404040]"
                required
              />
            </div>

            {!isOtpSent ? (
              <Button
                onClick={handleGetOTP}
                disabled={isLoading || !email}
                className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white"
              >
                {isLoading ? "Sending..." : "Get OTP"}
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-white">
                    Enter OTP
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="bg-[#1A1A1A] text-white border-[#404040]"
                    maxLength={6}
                    required
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <Button
                    onClick={handleVerifyOTP}
                    disabled={isLoading || !otp}
                    className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white"
                  >
                    {isLoading ? "Verifying..." : "Verify OTP"}
                  </Button>

                  {countdown > 0 ? (
                    <p className="text-center text-sm text-white/60">
                      Resend OTP in {formatTime(countdown)}
                    </p>
                  ) : (
                    <Button
                      onClick={handleGetOTP}
                      disabled={isLoading}
                      variant="outline"
                      className="border-[#404040] text-white hover:bg-[#404040]"
                    >
                      Resend OTP
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EmailVerification; 