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

const ResetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await authService.resetPassword(token, newPassword, confirmPassword);

      toast({
        title: "Success",
        description: "Password has been reset successfully. Please login with your new password.",
      });

      navigate("/login");
    } catch (error: any) {
      console.error('Reset password error:', error);
      const errorMessage = error.response?.data?.message || 
                         error.response?.data || 
                         "Failed to reset password. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <PageContent className="flex items-center justify-center">
        <div className="w-full max-w-md bg-[#2D2D2D] p-8 rounded-lg shadow-lg">
          <h1 className="text-white text-3xl font-bold mb-6 text-center">Reset Password</h1>
          
          <form 
            onSubmit={handleSubmit} 
            className="space-y-4" 
            autoComplete="off"
          >
            <div className="space-y-2">
              <Label htmlFor="reset-token" className="text-white">Reset Token</Label>
              <Input
                id="reset-token"
                name="reset-token"
                type="text"
                placeholder="Enter the token from your email"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="bg-[#1A1A1A] text-white border-[#404040]"
                required
                disabled={isSubmitting}
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-white">New Password</Label>
              <PasswordInput
                id="new-password"
                name="new-password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-[#1A1A1A] text-white border-[#404040]"
                required
                disabled={isSubmitting}
                autoComplete="new-password"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-white">Confirm Password</Label>
              <PasswordInput
                id="confirm-password"
                name="confirm-password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-[#1A1A1A] text-white border-[#404040]"
                required
                disabled={isSubmitting}
                autoComplete="new-password"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white mt-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Resetting Password..." : "Reset Password"}
            </Button>

            <div className="text-center mt-4">
              <Button
                type="button"
                variant="link"
                className="text-sm text-blue-500 hover:text-blue-700"
                onClick={() => navigate("/login")}
              >
                Back to Login
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