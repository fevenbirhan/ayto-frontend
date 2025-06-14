import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageContent } from "@/components/layout/PageContent";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ForgotPasswordDialog } from "@/components/layout/ForgotPasswordDialog";
import { PasswordInput } from "@/components/ui/password-input";
import { Icons } from "@/components/ui/icons";
import { fadeIn, staggerContainer } from "@/lib/motion1";
import { AuthResponse } from "@/types/authTypes";
import { authService } from "@/services/auth";
import { Role } from "@/services/employee";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, logout, language, setLanguage } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Translations including Amharic
  const translations = {
    en: {
      login: {
        title: "Login",
        emailLabel: "Email",
        emailPlaceholder: "Enter your email",
        passwordLabel: "Password",
        passwordPlaceholder: "Enter your password",
        loginButton: "Login",
        loadingText: "Logging in...",
        noAccount: "Don't have an account?",
        registerLink: "Register here",
        forgotPassword: "Forgot password?",
        toastSuccessTitle: "Success",
        toastSuccessDescription: "Login successful!",
        toastErrorTitle: "Error",
        invalidCredentials: "Invalid email or password"
      }
    },
    am: {
      login: {
        title: "ግባ",
        emailLabel: "ኢሜይል",
        emailPlaceholder: "ኢሜይል ያስገቡ",
        passwordLabel: "የይለፍ ቃል",
        passwordPlaceholder: "የይለፍ ቃልዎን ያስገቡ",
        loginButton: "ግባ",
        loadingText: "በመግባት ላይ...",
        noAccount: "መለያ የሎትህ?",
        registerLink: "እዚህ ይመዝገቡ",
        forgotPassword: "የይለፍ ቃል ረሳኽው?",
        toastSuccessTitle: "ተሳክቷል",
        toastSuccessDescription: "በተሳካ ንገላ ገብተዋል!",
        toastErrorTitle: "ስህተት",
        invalidCredentials: "ልክ ያልሆነ ኢሜይል ወይም የይለፍ ቃል"
      }
    }
  };

  const t = translations[language].login;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Get the response from the auth service first to check status
      const response = await authService.login({ email, password }) as AuthResponse;
      
      // Handle government users' first login
      if (response.role === 'GOVERNMENT_OFFICE' && response.accountStatus === 'PENDING') {
        toast({
          title: t.toastErrorTitle,
          description: "Your account is pending approval by an administrator.",
          variant: "destructive"
        });
        navigate("/pending-approval");
        return;
      }

      // Check if the account is active for all roles
      if (response.accountStatus !== 'ACTIVE') {
        toast({
          title: t.toastErrorTitle,
          description: "Your account is not active. Please contact the administrator.",
          variant: "destructive"
        });
        navigate("/pending-approval");
        return;
      }

      // If account is active, proceed with login
      await login(email, password);

      // Show success message
      toast({
        title: t.toastSuccessTitle,
        description: t.toastSuccessDescription
      });

      // Navigate to the correct dashboard based on role
      switch(response.role as Role) {
        case 'GOVERNMENT_OFFICE':
          navigate("/government-dashboard");
          break;
        case 'RESIDENT':
          navigate("/resident-dashboard");
          break;
        case 'UTILITY_PROVIDER':
          navigate("/utility-provider-dashboard");
          break;
        case 'MAINTENANCE_TEAM':
        case 'EMPLOYEE':  // Handle both role types for maintenance team members
          navigate("/maintenance-team-dashboard");
          break;
        case 'ADMIN':
          navigate("/admin");
          break;
        default:
          console.error('Unknown role:', response.role);
          navigate("/");
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || t.invalidCredentials;
      
      // Handle specific error cases
      if (error.response?.status === 404) {
        toast({
          title: t.toastErrorTitle,
          description: "Account not found. Please check your credentials or register.",
          variant: "destructive"
        });
        navigate("/");
      } else {
        toast({
          title: t.toastErrorTitle,
          description: errorMessage,
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={staggerContainer()}
      className={`flex flex-col min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}
    >
      <Header />
      <PageContent>
        <div className="flex items-center justify-center p-4">
          <motion.div
            variants={fadeIn("up", "tween", 0.2, 0.5)}
            className={`w-full max-w-md p-8 rounded-xl shadow-lg ${theme === 'dark' ? 'bg-card text-card-foreground border border-border' : 'bg-white border border-gray-200'}`}
          >
            <div className="flex justify-between items-center mb-8">
              <motion.h1
                variants={fadeIn("right", "tween", 0.3, 0.5)}
                className="text-3xl font-bold"
              >
                {t.title}
              </motion.h1>
              
              <motion.div 
                className="flex gap-2"
                variants={fadeIn("left", "tween", 0.3, 0.5)}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
                  className="text-sm"
                >
                  {language === 'en' ? 'አማ' : 'ENG'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="text-sm"
                >
                  {theme === 'dark' ? <Icons.Sun className="h-4 w-4" /> : <Icons.Moon className="h-4 w-4" />}
                </Button>
              </motion.div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                variants={fadeIn("up", "tween", 0.4, 0.5)}
                className="space-y-2"
              >
                <Label htmlFor="email">{t.emailLabel}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background"
                  required
                  disabled={isLoading}
                />
              </motion.div>
              
              <motion.div
                variants={fadeIn("up", "tween", 0.5, 0.5)}
                className="space-y-2"
              >
                <Label htmlFor="password">{t.passwordLabel}</Label>
                <PasswordInput
                  id="password"
                  placeholder={t.passwordPlaceholder}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background"
                  required
                  disabled={isLoading}
                />
              </motion.div>

              <motion.div
                variants={fadeIn("up", "tween", 0.6, 0.5)}
              >
                <Button
                  type="submit"
                  className="w-full mt-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Icons.Spinner className="h-4 w-4 animate-spin" />
                      {t.loadingText}
                    </div>
                  ) : t.loginButton}
                </Button>
              </motion.div>
            </form>

            <motion.div
              variants={fadeIn("up", "tween", 0.7, 0.5)}
              className="mt-6 flex flex-col items-center gap-3 text-sm"
            >
              <ForgotPasswordDialog 
                
                
              />
              <p className="text-muted-foreground">
                {t.noAccount}{" "}
                <Link
                  to="/verify-email"
                  className="font-medium text-primary hover:underline"
                >
                  {t.registerLink}
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </PageContent>
      <Footer text="© 2024 AYTO. All rights reserved." darkMode={theme === 'dark'} />
    </motion.div>
  );
};

export default Login;