import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/motion1";

const NotFound = () => {
  const location = useLocation();
  const { theme } = useTheme();
  const { language } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Translations
  const translations = {
    en: {
      title: "404",
      subtitle: "Oops! Page not found",
      message: "The page you're looking for doesn't exist or has been moved.",
      button: "Return to Home"
    },
    am: {
      title: "404",
      subtitle: "ይቅርታ! ገጹ አልተገኘም",
      message: "የሚፈልጉት ገጽ አልተገኘም ወይም ተቀይሯል።",
      button: "ወደ መነሻ ገጽ ተመለስ"
    }
  };

  const currentLanguage = translations[language as keyof typeof translations] || translations.en;

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={fadeIn('up', 'tween', 0.2, 1)}
      className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-[#1A1A1A]' : 'bg-gray-50'
      }`}
    >
      <div className="text-center p-8 max-w-md">
        <motion.div
          variants={fadeIn('up', 'tween', 0.4, 1)}
          className={`p-8 rounded-2xl shadow-xl ${
            theme === 'dark' ? 'bg-[#2D2D2D]' : 'bg-white'
          }`}
        >
          <div className="relative">
            <motion.h1 
              variants={fadeIn('up', 'tween', 0.6, 1)}
              className={`text-9xl font-bold mb-4 bg-gradient-to-r ${
                theme === 'dark' 
                  ? 'from-blue-400 to-purple-600' 
                  : 'from-blue-500 to-purple-700'
              } bg-clip-text text-transparent`}
            >
              {currentLanguage.title}
            </motion.h1>
            <motion.div
              variants={fadeIn('up', 'tween', 0.8, 1)}
              className="absolute -bottom-1 -right-1 w-16 h-16 rounded-full bg-red-500 opacity-20 animate-pulse"
            />
          </div>
          
          <motion.h2 
            variants={fadeIn('up', 'tween', 1.0, 1)}
            className={`text-2xl font-semibold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}
          >
            {currentLanguage.subtitle}
          </motion.h2>
          
          <motion.p 
            variants={fadeIn('up', 'tween', 1.2, 1)}
            className={`mb-6 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            {currentLanguage.message}
          </motion.p>
          
          <motion.div variants={fadeIn('up', 'tween', 1.4, 1)}>
            <a
              href="/"
              className={`inline-block px-6 py-3 rounded-lg font-medium transition-all ${
                theme === 'dark'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {currentLanguage.button}
            </a>
          </motion.div>
        </motion.div>

        <motion.div 
          variants={fadeIn('up', 'tween', 1.6, 1)}
          className={`mt-8 text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}
        >
          <p>
            {language === 'am' 
              ? 'ስህተት: የማይገኝ ገጽ -' 
              : 'Error: Page not found -'} {location.pathname}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default NotFound;