import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { authService } from "@/services/auth";
import { useNavigate } from "react-router-dom";
import { Sun, Moon, Languages } from "lucide-react";

export const ForgotPasswordDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [darkMode, setDarkMode] = useState(true); // Default to dark mode
  const [amharic, setAmharic] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await authService.requestPasswordReset(email);
      
      toast({
        title: amharic ? "ተሳክቷል" : "Success",
        description: amharic 
          ? "በዚህ ኢሜይል የተመዘገበ መለያ ካለ፣ የዳሰሳ ቶከን ይደርስዎታል።" 
          : "If an account exists with this email, you will receive a reset token.",
      });
      
      setDialogOpen(false);
      navigate("/reset-password");
    } catch (error: any) {
      console.error('Forgot password error:', error);
      
      // Generic success message regardless of error for security
      toast({
        title: amharic ? "ተሳክቷል" : "Success",
        description: amharic 
          ? "በዚህ ኢሜይል የተመዘገበ መለያ ካለ፣ የዳሰሳ ቶከን ይደርስዎታል።" 
          : "If an account exists with this email, you will receive a reset token.",
      });
      
      setDialogOpen(false);
      navigate("/reset-password");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Translations
  const translations = {
    trigger: amharic ? "የይለፍ ቃል ረሳኽው?" : "Forgot password?",
    title: amharic ? "የይለፍ ቃል ዳሰሳ" : "Reset Password",
    description: amharic 
      ? "የዳሰሳ ቶከን ለማግኘት ኢሜይል አድራሻዎን ያስገቡ" 
      : "Enter your email to receive a reset token",
    emailLabel: amharic ? "ኢሜይል" : "Email",
    emailPlaceholder: amharic ? "ኢሜይል አድራሻዎን ያስገቡ" : "Enter your email address",
    submit: amharic ? "የዳሰሳ ቶከን ላክ" : "Send Reset Token",
    submitting: amharic ? "በመላክ ላይ..." : "Sending...",
    cancel: amharic ? "ሰርዝ" : "Cancel"
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className={`text-sm ${darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"}`}
          onClick={() => setDialogOpen(true)}
        >
          {translations.trigger}
        </Button>
      </DialogTrigger>
      <DialogContent 
        className={`sm:max-w-[425px] ${darkMode ? "bg-[#1E1E1E] text-white" : "bg-white text-gray-900"}`}
      >
        <div className="absolute top-4 right-4 flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setDarkMode(!darkMode)}
            className="rounded-full"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setAmharic(!amharic)}
            className="rounded-full"
          >
            <Languages className="h-4 w-4" />
          </Button>
        </div>
        
        <DialogHeader>
          <DialogTitle>{translations.title}</DialogTitle>
          <DialogDescription className={darkMode ? "text-gray-300" : "text-gray-600"}>
            {translations.description}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="email">{translations.emailLabel}</Label>
            <Input
              id="email"
              type="email"
              placeholder={translations.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
              className={`${darkMode ? "bg-[#2A2A2A] text-white border-[#404040]" : "bg-gray-50 text-gray-900 border-gray-300"}`}
              autoComplete="email"
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              type="submit" 
              className={`w-full ${darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white`}
              disabled={isSubmitting}
            >
              {isSubmitting ? translations.submitting : translations.submit}
            </Button>
            <Button
              type="button"
              variant={darkMode ? "secondary" : "outline"}
              onClick={() => setDialogOpen(false)}
              className="w-full"
              disabled={isSubmitting}
            >
              {translations.cancel}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};