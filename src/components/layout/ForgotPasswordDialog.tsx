import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { authService } from "@/services/auth";
import { useNavigate } from "react-router-dom";

export const ForgotPasswordDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await authService.requestPasswordReset(email);
      
      toast({
        title: "Success",
        description: "If an account exists with this email, you will receive a reset token.",
      });
      
      setDialogOpen(false);
      navigate("/reset-password");
    } catch (error: any) {
      console.error('Forgot password error:', error);
      
      // Don't reveal if the email exists or not for security
      toast({
        title: "Success",
        description: "If an account exists with this email, you will receive a reset token.",
      });
      
      setDialogOpen(false);
      navigate("/reset-password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className="text-sm text-blue-500 hover:text-blue-700"
          onClick={() => setDialogOpen(true)}
        >
          Forgot password?
        </Button>
      </DialogTrigger>
      <DialogContent 
        className="sm:max-w-[425px] bg-[#2D2D2D] text-white"
      >
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
              className="bg-[#1A1A1A] text-white border-[#404040]"
              autoComplete="off"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              type="submit" 
              className="w-full bg-[#3B82F6] hover:bg-[#2563EB]" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Reset Token"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="w-full border-[#404040] hover:bg-[#404040]"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 