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
import { useTheme } from "@/components/ThemeProvider";
import { Sun, Moon, Languages } from "lucide-react";
import {useAuth} from "@/context/AuthContext";

const EmailVerification = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [userType, setUserType] = useState<"resident" | "government">("resident");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const {language, toggleLanguage} = useAuth();

  // Translations
  const translations = {
    en: {
      title: "Email Verification",
      accountType: "Account Type",
      resident: "Resident",
      government: "Government",
      emailPlaceholder: "Enter your email",
      getOtp: "Get OTP",
      enterOtp: "Enter OTP",
      verifyOtp: "Verify OTP",
      resendOtp: "Resend OTP",
      resendIn: "Resend OTP in",
      sending: "Sending...",
      verifying: "Verifying...",
      success: "Success",
      error: "Error",
      invalidEmail: "Please enter a valid email address",
      invalidOtp: "Please enter the OTP",
      otpSent: "OTP sent successfully! Please check your email.",
      emailVerified: "Email verified successfully!",
      invalidOtpMsg: "Invalid OTP",
    },
    am: {
      title: "የኢሜል ማረጋገጫ",
      accountType: "የመለያ አይነት",
      resident: "ተቀማጭ",
      government: "መንግስት",
      emailPlaceholder: "ኢሜልዎን ያስገቡ",
      getOtp: "OTP ያግኙ",
      enterOtp: "OTP ያስገቡ",
      verifyOtp: "OTP ያረጋግጡ",
      resendOtp: "OTP እንደገና ላክ",
      resendIn: "OTP እንደገና በ",
      sending: "በመላክ ላይ...",
      verifying: "በማረጋገጥ ላይ...",
      success: "ተሳክቷል",
      error: "ስህተት",
      invalidEmail: "እባክዎ ትክክለኛ ኢሜል ያስገቡ",
      invalidOtp: "እባክዎ OTP ያስገቡ",
      otpSent: "OTP በተሳካ ሁኔታ ተልኳል! እባክዎ ኢሜልዎን ያረጋግጡ።",
      emailVerified: "ኢሜል በተሳካ ሁኔታ ተረጋግጧል!",
      invalidOtpMsg: "ትክክል ያልሆነ OTP",
    },
  };

  const t = translations[language];

  



  const handleGetOTP = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: t.error,
        description: t.invalidEmail,
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
        title: t.success,
        description: response.message || t.otpSent,
      });
      
      setIsOtpSent(true);
      // Start countdown for resend (2 minutes)
      setCountdown(300);
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
      // Check if email is already in use
      if (errorMessage.toLowerCase().includes("email already in use")) {
        toast({
          title: t.error,
          description: "This email is already registered. Please use a different email or try logging in.",
          variant: "destructive",
        });
      } else {
        toast({
          title: t.error,
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      toast({
        title: t.error,
        description: t.invalidOtp,
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
          title: t.success,
          description: t.emailVerified,
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
          title: t.error,
          description: response.message || t.invalidOtpMsg,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to verify OTP";
      toast({
        title: t.error,
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
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />
      <main className="flex-1 flex items-center justify-center py-16">
        <div className="w-full max-w-md bg-card p-8 rounded-2xl shadow-2xl border border-border relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary/10 rounded-full blur-xl"></div>
          
          {/* Language and theme toggle */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Button 
              onClick={toggleLanguage}
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-muted"
            >
              <Languages className="h-5 w-5" />
            </Button>
            <Button 
              onClick={toggleTheme}
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-muted"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>

          <h1 className="text-3xl font-bold mb-6 text-center text-primary relative">
            {t.title}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
          </h1>

          <div className="space-y-6 relative z-10">
            {!isOtpSent && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{t.accountType}</Label>
                  <RadioGroup
                    value={userType}
                    onValueChange={(value: "resident" | "government") => setUserType(value)}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="resident" id="user-resident" />
                      <Label htmlFor="user-resident">{t.resident}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="government" id="user-government" />
                      <Label htmlFor="user-government">{t.government}</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isOtpSent}
                className="bg-background"
                required
              />
            </div>

            {!isOtpSent ? (
              <Button
                onClick={handleGetOTP}
                disabled={isLoading || !email}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/30 transition-all dark:bg-blue-500 dark:hover:bg-blue-600 dark:text-white"
              >
                {isLoading ? t.sending : t.getOtp}
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">
                    {t.enterOtp}
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder={t.enterOtp}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="bg-background"
                    maxLength={6}
                    required
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <Button
                    onClick={handleVerifyOTP}
                    disabled={isLoading || !otp}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/30 transition-all dark:bg-blue-500 dark:hover:bg-blue-600 dark:text-white"
                  >
                    {isLoading ? t.verifying : t.verifyOtp}
                  </Button>

                  {countdown > 0 ? (
                    <p className="text-center text-sm text-muted-foreground">
                      {t.resendIn} {formatTime(countdown)}
                    </p>
                  ) : (
                    <Button
                      onClick={handleGetOTP}
                      disabled={isLoading}
                      variant="outline"
                      className="w-full border-border hover:bg-muted/50 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white"
                    >
                      {t.resendOtp}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer text="© 2024 Community Reports. All rights reserved." darkMode={theme === "dark"} />
    </div>
  );
};

export default EmailVerification;