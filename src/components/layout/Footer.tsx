import { Link } from "react-router-dom";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/context/AuthContext";
import { Mail, Phone } from "lucide-react";
interface FooterProps {
  text: string;
  darkMode: boolean;
  language?: 'en' | 'am';
}

export const Footer = ({ text, darkMode, language = 'en' }: FooterProps) => {
  const { theme } = useTheme();
  const { language: authLanguage } = useAuth();

  // Translations
  const translations = {
    en: {
      contacts: "Contacts",
      services: "Services",
      home: "Home",
      features: "Features",
      allRights: "© 2023 AYTO.",
    },
    am: {
      contacts: "አድራሻዎች",
      services: "አገልግሎቶች",
      home: "መነሻ",
      features: "ባህሪያት",
      allRights: "© 2023 አይቶ.",
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  const handleFeatureClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href === "/#features") {
      e.preventDefault();
      const featuresSection = document.getElementById("features");
      if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer className={`w-full py-6 mt-auto ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Brand Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold tracking-tighter">
                <span className="text-primary">AY</span>
                <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>TO</span>
              </div>
              <div className={`w-7 h-7 rounded-full ${theme === 'dark' ? 'bg-primary/90' : 'bg-primary'} flex items-center justify-center`}>
                <span className="text-white font-bold text-sm">A</span>
              </div>
            </div>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {t.allRights}
            </p>
          </div>

          {/* Contacts Section */}
          <div className="space-y-3">
            <h3 className={`text-base font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {t.contacts}
            </h3>
            <div className="space-y-2">
              <a
                href="tel:+251961236545"
                className={`flex items-center gap-2 ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
              >
                <Phone className="h-5 w-5 text-primary" />
                <span>+251 961236545</span>
              </a>
              <a
                href="tel:+251925252843"
                className={`flex items-center gap-2 ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
              >
                <Phone className="h-5 w-5 text-primary" />
                <span>+251 925252843</span>
              </a>
              <a
                href="mailto:kebedefiker11@gmail.com"
                className={`flex items-center gap-2 ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
              >
                <Mail className="h-5 w-5 text-primary" />
                <span>kebedefiker11@gmail.com</span>
              </a>
              <a
                href="mailto:admassuhenok123@gmail.com"
                className={`flex items-center gap-2 ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
              >
                <Mail className="h-5 w-5 text-primary" />
                <span>admassuhenok123@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Services Section */}
          <div className="space-y-3">
            <h3 className={`text-base font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {t.services}
            </h3>
            <div className="space-y-2">
              <Link
                to="/"
                className={`block ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
              >
                {t.home}
              </Link>
              <Link
                to="/#features"
                className={`block ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
                onClick={(e) => handleFeatureClick(e, "/#features")}
              >
                {t.features}
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className={`mt-6 pt-4 border-t ${theme === 'dark' ? 'border-gray-800 text-gray-400' : 'border-gray-200 text-gray-500'} text-sm text-center`}>
          {t.allRights}
        </div>
      </div>
    </footer>
  );
};