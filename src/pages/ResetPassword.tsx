import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageContent } from "@/components/layout/PageContent";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { authService } from "@/services/auth";
import { PasswordInput } from "@/components/ui/password-input";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/context/AuthContext";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme } = useTheme();
  const { language } = useAuth();
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Translations
  const translations = {
    en: {
      title: "Reset Password",
      tokenLabel: "Reset Token",
      tokenPlaceholder: "Enter the token from your email",
      newPasswordLabel: "New Password",
      newPasswordPlaceholder: "Enter new password",
      confirmPasswordLabel: "Confirm Password",
      confirmPasswordPlaceholder: "Confirm new password",
      submitButton: "Reset Password",
      submittingButton: "Resetting Password...",
      backToLogin: "Back to Login",
      passwordMismatch: "Passwords do not match",
      passwordTooShort: "Password must be at least 6 characters long",
      successMessage: "Password has been reset successfully. Please login with your new password.",
      errorMessage: "Failed to reset password. Please try again."
    },
    am: {
      title: "የይለፍ ቃል ዳግም ማስጀመር",
      tokenLabel: "ዳግም ማስጀመሪያ ቶከን",
      tokenPlaceholder: "ከኢሜልዎ የተላከውን ቶከን ያስገቡ",
      newPasswordLabel: "አዲስ የይለፍ ቃል",
      newPasswordPlaceholder: "አዲስ የይለፍ ቃል ያስገቡ",
      confirmPasswordLabel: "የይለፍ ቃል አረጋግጥ",
      confirmPasswordPlaceholder: "አዲሱን የይለፍ ቃል ያረጋግጡ",
      submitButton: "የይለፍ ቃል ዳግም ማስጀመር",
      submittingButton: "የይለፍ ቃል እየተሰራ ነው...",
      backToLogin: "ወደ መግቢያ ተመለስ",
      passwordMismatch: "የይለፍ ቃላቶች አይዛመዱም",
      passwordTooShort: "የይለፍ ቃል ቢያንስ 6 ቁምፊዎች ሊኖሩት ይገባል",
      successMessage: "የይለፍ ቃል በተሳካ ሁኔታ ተስተካክሏል። እባክዎ አዲሱን የይለፍ ቃል በመጠቀም ይግቡ።",
      errorMessage: "የይለፍ ቃል ማስተካከል አልተሳካም። እባክዎ እንደገና �ስገቡ።"
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: language === 'am' ? 'ስህተት' : 'Error',
        description: t.passwordMismatch,
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: language === 'am' ? 'ስህተት' : 'Error',
        description: t.passwordTooShort,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await authService.resetPassword(token, newPassword, confirmPassword);

      toast({
        title: language === 'am' ? 'ተሳክቷል' : 'Success',
        description: t.successMessage,
      });

      navigate("/login");
    } catch (error: any) {
      console.error('Reset password error:', error);
      const errorMessage = error.response?.data?.message || 
                         error.response?.data || 
                         t.errorMessage;
      toast({
        title: language === 'am' ? 'ስህተት' : 'Error',
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`flex flex-col min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header />
      <PageContent>
        <div className={`w-full max-w-md p-8 rounded-2xl shadow-xl transition-all duration-300 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <h1 className={`text-3xl font-bold mb-8 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            {t.title}
          </h1>
          
          <form 
            onSubmit={handleSubmit} 
            className="space-y-6" 
            autoComplete="off"
          >
            <div className="space-y-3">
              <Label htmlFor="reset-token" className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                {t.tokenLabel}
              </Label>
              <Input
                id="reset-token"
                name="reset-token"
                type="text"
                placeholder={t.tokenPlaceholder}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className={`${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-500' : 'bg-white text-gray-900 border-gray-300 focus:border-blue-500'}`}
                required
                disabled={isSubmitting}
                autoComplete="off"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="new-password" className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                {t.newPasswordLabel}
              </Label>
              <PasswordInput
                id="new-password"
                name="new-password"
                placeholder={t.newPasswordPlaceholder}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-500' : 'bg-white text-gray-900 border-gray-300 focus:border-blue-500'}`}
                required
                disabled={isSubmitting}
                autoComplete="new-password"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="confirm-password" className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                {t.confirmPasswordLabel}
              </Label>
              <PasswordInput
                id="confirm-password"
                name="confirm-password"
                placeholder={t.confirmPasswordPlaceholder}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-500' : 'bg-white text-gray-900 border-gray-300 focus:border-blue-500'}`}
                required
                disabled={isSubmitting}
                autoComplete="new-password"
              />
            </div>
            
            <Button 
              type="submit" 
              className={`w-full mt-6 ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white font-semibold py-3 rounded-lg transition-colors duration-300`}
              disabled={isSubmitting}
            >
              {isSubmitting ? t.submittingButton : t.submitButton}
            </Button>

            <div className="text-center mt-4">
              <Button
                type="button"
                variant="link"
                className={`text-sm ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                onClick={() => navigate("/login")}
              >
                {t.backToLogin}
              </Button>
            </div>
          </form>
        </div>
      </PageContent>
      <Footer />
    </div>
  );
};

export default ResetPassword;