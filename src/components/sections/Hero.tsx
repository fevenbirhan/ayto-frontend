import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/components/ThemeProvider";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/utils/motion";

export const Hero = () => {
  const { isAuthenticated, userRole, language, toggleLanguage} = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleDashboardRedirect = () => {
    if (userRole === "GOVERNMENT_OFFICE") {
      navigate("/government-dashboard");
    } else if (userRole === "RESIDENT") {
      navigate("/resident-dashboard");
    }
  };

  const content = {
    en: {
      titlePart1: "Together, ",
      titleHighlight: "We Solve, Report",
      titlePart2: ", and Transform!",
      description: "Empower your voice and transform your community. By sharing what you see, from road issues to power outages, you play a vital role in creating a better city.",
      cta: "Get Started!",
      dashboard: "Dashboard"
    },
    am: {
      titlePart1: "በጋራ፣ ",
      titleHighlight: "እናስተናግዳለን፣ እንሪፖርት እናደርጋለን",
      titlePart2: "፣ እና እንለውጣለን!",
      description: "ድምጽዎን አጠናክሩ እና ማህበረሰብዎን ይቀይሩ። ከመንገድ ችግሮች እስከ ኃይል መቋረጥ �ጠይቁ።",
      cta: "ጀምር!",
      dashboard: "ዳሽቦርድ"
    }
  };

  const isDark = theme === "dark";
  const currentContent = content[language];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={`w-full py-20 transition-colors duration-500 ${
        isDark ? "bg-gradient-to-br from-gray-900 to-gray-800" : "bg-white"
      }`}
    >
      {/* Modern decorative elements */}
      {!isDark && (
        <>
          <motion.div 
            animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-10 top-1/4 w-80 h-80 bg-indigo-50 rounded-full filter blur-[100px]"
          />
          <motion.div 
            animate={{ x: [0, -80, 0], y: [0, 60, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-20 bottom-1/3 w-96 h-96 bg-blue-50 rounded-full filter blur-[120px]"
          />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />
        </>
      )}
      {isDark && (
        <>
          <motion.div 
            animate={{ x: [0, 120, 0], y: [0, -60, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-10 top-1/4 w-80 h-80 bg-gray-800/50 rounded-full filter blur-[100px]"
          />
          <motion.div 
            animate={{ x: [0, -100, 0], y: [0, 80, 0] }}
            transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-20 bottom-1/3 w-96 h-96 bg-gray-900/50 rounded-full filter blur-[120px]"
          />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
        </>
      )}

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Theme and Language Toggle - Modern Floating Style */}
        <div className="absolute top-6 right-6 flex gap-4 z-20">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleLanguage()}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              isDark 
                ? "bg-gray-700 hover:bg-gray-600 text-emerald-400 border border-gray-600" 
                : "bg-white hover:bg-gray-50 text-blue-600 border border-gray-200"
            } shadow-md backdrop-blur-sm`}
          >
            {language === "en" ? "አማርኛ" : "English"}
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className={`p-3 rounded-full transition-all ${
              isDark 
                ? "bg-gray-700 hover:bg-gray-600 text-yellow-300 border border-gray-600" 
                : "bg-white hover:bg-gray-50 text-blue-600 border border-gray-200"
            } shadow-md backdrop-blur-sm`}
          >
            {isDark ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </motion.button>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12 pt-16">
          <motion.div 
            variants={staggerContainer(0.1, 0.2)}
            initial="hidden"
            whileInView="show"
            className="flex-1 space-y-8"
          >
            <motion.h1 
              variants={fadeIn("right", "spring", 0.2, 1)}
              className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              <span>{currentContent.titlePart1}</span>
              <motion.span 
                whileHover={{ scale: 1.05 }}
                className={`inline-block mx-2 bg-clip-text text-transparent ${
                  isDark 
                    ? "bg-gradient-to-r from-emerald-400 to-teal-300" 
                    : "bg-gradient-to-r from-blue-600 to-indigo-500"
                }`}
              >
                {currentContent.titleHighlight}
              </motion.span>
              <span>{currentContent.titlePart2}</span>
            </motion.h1>

            <motion.p 
              variants={fadeIn("right", "spring", 0.4, 1)}
              className={`text-xl md:text-2xl ${
                isDark ? "text-gray-300" : "text-gray-600"
              } max-w-2xl`}
            >
              {currentContent.description}
            </motion.p>

            <motion.div 
              variants={fadeIn("right", "spring", 0.6, 1)}
              className="flex flex-wrap gap-4 pt-4"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/register"
                  className={`inline-flex items-center justify-center gap-2 text-lg font-bold rounded-xl px-8 py-4 transition-all ${
                    isDark 
                      ? "bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-white shadow-lg hover:shadow-emerald-500/30" 
                      : "bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white shadow-lg hover:shadow-blue-500/30"
                  }`}
                >
                  {currentContent.cta}
                </Link>
              </motion.div>

              {isAuthenticated && userRole && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={()=>{handleDashboardRedirect()}}
                    className={`text-lg font-bold rounded-xl px-8 py-4 ${
                      isDark 
                        ? "bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 hover:border-emerald-400" 
                        : "bg-white hover:bg-gray-50 text-blue-600 border border-gray-200 hover:border-blue-400"
                    } shadow-sm`}
                  >
                    {currentContent.dashboard}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>

          <motion.div 
            variants={fadeIn("left", "spring", 0.4, 1)}
            className="flex-1 flex justify-center"
          >
            <div className="relative group">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className={`w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl ${
                  isDark ? "border border-gray-700" : "border border-gray-200"
                }`}
              >
                <img
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt={language === "en" ? "Community working together" : "ማህበረሰብ አብሮ ሥራ"}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </motion.div>
              <div className={`absolute inset-0 rounded-3xl pointer-events-none ${
                isDark ? "mix-blend-overlay" : "mix-blend-multiply"
              } bg-gradient-to-br ${
                isDark ? "from-emerald-900/20 to-gray-900/40" : "from-blue-100/30 to-indigo-100/20"
              }`} />
              
              {/* Modern floating cards effect */}
              {!isDark && (
                <>
                  <motion.div 
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -left-8 -bottom-8 w-32 h-32 bg-white rounded-2xl shadow-lg border border-gray-100 p-4 hidden lg:block"
                  >
                    <div className="bg-blue-100 w-8 h-8 rounded-lg mb-2" />
                    <div className="h-2 bg-gray-200 rounded-full mb-1 w-3/4" />
                    <div className="h-2 bg-gray-200 rounded-full w-1/2" />
                  </motion.div>
                  <motion.div 
                    animate={{ y: [0, 15, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="absolute -right-8 -top-8 w-40 h-40 bg-white rounded-2xl shadow-lg border border-gray-100 p-4 hidden lg:block"
                  >
                    <div className="bg-indigo-100 w-10 h-10 rounded-lg mb-3" />
                    <div className="h-2 bg-gray-200 rounded-full mb-2 w-full" />
                    <div className="h-2 bg-gray-200 rounded-full mb-2 w-2/3" />
                    <div className="h-2 bg-gray-200 rounded-full w-1/2" />
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};