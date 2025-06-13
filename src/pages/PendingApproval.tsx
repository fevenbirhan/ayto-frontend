import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/motion1";

const PendingApproval = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userRole, language } = useAuth();
  const { theme } = useTheme();

  // Redirect if user is not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const translations = {
    en: {
      title: "Account Pending Approval",
      message: "Your account is currently pending approval by an administrator. You will be notified once your account is activated.",
      governmentMessage: "As a government office, your account requires approval before you can access the system.",
      otherMessage: "Your account is currently inactive. Please contact the administrator for assistance.",
      backToLogin: "Back to Login",
      contactAdmin: "Contact Administrator"
    },
    am: {
      title: "መለያ በጸድቋል",
      message: "መለያዎ በአስተዳዳሪ እየተገመገመ ነው። መለያዎ እንደተግባበት ይሳተፋሉ።",
      governmentMessage: "እንደ መንግስት ቢሮ፣ ስርዓቱን እንዲጠቀሙ መለያዎ ማጽደቅ አለበት።",
      otherMessage: "መለያዎ አሁን እያልተሰራ ነው። እባክዎ እርዳታ ለማግኘት አስተዳዳሪውን ያነጋግሩ።",
      backToLogin: "ወደ መግቢያ ተመለስ",
      contactAdmin: "አስተዳዳሪን ያነጋግሩ"
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  const getMessage = () => {
    if (userRole === 'GOVERNMENT_OFFICE') {
      return t.governmentMessage;
    }
    return t.otherMessage;
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={staggerContainer()}
      className={`flex flex-col min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}
    >
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div
          variants={fadeIn("up", "tween", 0.2, 0.5)}
          className={`w-full max-w-md p-8 rounded-xl shadow-lg text-center ${
            theme === 'dark' ? 'bg-card text-card-foreground border border-border' : 'bg-white border border-gray-200'
          }`}
        >
          <h1 className="text-2xl font-bold mb-4">{t.title}</h1>
          <p className="text-muted-foreground mb-6">{getMessage()}</p>
          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/login")}
            >
              {t.backToLogin}
            </Button>
            <Button
              variant="default"
              className="w-full"
              onClick={() => navigate("/help-support")}
            >
              {t.contactAdmin}
            </Button>
          </div>
        </motion.div>
      </main>
      <Footer text="© 2024 AYTO. All rights reserved." darkMode={theme === 'dark'} />
    </motion.div>
  );
};

export default PendingApproval; 