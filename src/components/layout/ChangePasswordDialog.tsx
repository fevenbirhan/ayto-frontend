import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Key, X } from "lucide-react";
import { ChangePasswordForm } from "./ChangePasswordForm";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/context/AuthContext";
interface ChangePasswordDialogProps {
  buttonText?: string;
}

export const ChangePasswordDialog = ({ buttonText }: ChangePasswordDialogProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { theme } = useTheme();
  const { language } = useAuth();

  // Translations
  const translations = {
    en: {
      title: "Change Password",
      description: "Enter your current and new password below",
      buttonText: "Change Password",
      cancel: "Cancel",
      submit: "Submit"
    },
    am: {
      title: "የይለፍ ቃል ይቀይሩ",
      description: "አሁን ያለዎትን እና አዲሱን የይለፍ ቃል ከዚህ በታች ያስገቡ",
      buttonText: "የይለፍ ቃል ይቀይሩ",
      cancel: "ይቅር",
      submit: "አስገባ"
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start hover:bg-accent/50"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDialogOpen(true);
          }}
        >
          <Key className="mr-2 h-4 w-4 text-primary" />
          <span className="text-foreground">{t.buttonText}</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className={`sm:max-w-[425px] rounded-lg ${theme === 'dark' ? 'dark' : ''}`}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 rounded-full h-8 w-8"
            onClick={() => setDialogOpen(false)}
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </Button>

          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-foreground">
              {t.title}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-2">
              {t.description}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6">
            <ChangePasswordForm
              onSuccess={() => setDialogOpen(false)}
              onCancel={() => setDialogOpen(false)}
              cancelText={t.cancel}
              submitText={t.submit}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};