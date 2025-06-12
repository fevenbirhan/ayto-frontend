// Header.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, UserCircle2, LogOut, Key, Sun, Moon, ChevronDown, Languages } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/components/ThemeProvider";
import { Switch } from "@/components/ui/switch";
import { ChangePasswordDialog } from "./ChangePasswordDialog";

interface HeaderProps {
  darkMode: boolean;
  language: 'en' | 'am';
}



// Translation dictionary
const translations = {
  en: {
    home: "Home",
    features: "Features",
    analytics: "Analytics",
    dashboard: "Dashboard",
    reports: "Reports",
    discussion: "Discussion",
    support: "Support",
    login: "Login",
    signUp: "Sign Up",
    loggedIn: "Logged in",
    logout: "Logout",
    theme: "Theme",
    language: "Language",
    amharic: "አማርኛ",
    english: "English",
    changePassword: "Change Password"
  },
  am: {
    home: "መነሻ",
    features: "ባህሪያት",
    analytics: "ትንታኔ",
    dashboard: "ዳሽቦርድ",
    reports: "ሪፖርቶች",
    discussion: "ግብረመልስ",
    support: "ድጋፍ",
    login: "ግባ",
    signUp: "ይመዝገቡ",
    loggedIn: "የገቡ ነው",
    logout: "ውጣ",
    theme: "ገጽታ",
    language: "ቋንቋ",
    amharic: "አማርኛ",
    english: "English",
    changePassword: "የይለፍ ቃል ይቀይሩ"
  }
};

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, userName, logout, userRole, language, toggleLanguage } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // Get translations based on current language
  const t = translations[language as keyof typeof translations] || translations.en;

  // Navigation items for non-logged-in users
  const publicNavItems = [
    { label: t.home, href: "/" },
    { label: t.features, href: "/#features" },
  ];

  // Navigation items for logged-in residents
  const residentNavItems = [
    { label: t.dashboard, href: "/resident-dashboard" },
    { label: t.reports, href: "/my-reports" },
    { label: t.discussion, href: "/feedback" },
    { label: t.support, href: "/help-support" },
  ];

  // Authentication items (Login/SignUp)
  const authNavItems = [
    { label: t.login, href: "/login" },
    { label: t.signUp, href: "/register" },
  ];

  // Determine which navigation items to show based on auth status
  const navItems = isAuthenticated && userRole === "RESIDENT"
    ? residentNavItems
    : publicNavItems;

  const handleNavigation = (href: string) => {
    if (href.startsWith("/#")) {
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          const sectionId = href.substring(2);
          const section = document.getElementById(sectionId);
          if (section) {
            section.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      } else {
        const sectionId = href.substring(2);
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      }
    } else {
      navigate(href);
    }
  };

  const isActiveLink = (href: string) => {
    if (href.startsWith("/#")) {
      if (location.pathname !== "/") return false;
      const sectionId = href.substring(2);
      const section = document.getElementById(sectionId);
      if (!section) return false;
      const rect = section.getBoundingClientRect();
      return rect.top >= 0 && rect.top <= window.innerHeight;
    }

    const [path, search] = href.split("?");
    if (search) {
      const [param, value] = search.split("=");
      const currentSearch = new URLSearchParams(location.search);
      return location.pathname === path && currentSearch.get(param) === value;
    }
    return location.pathname === path;
  };

  useEffect(() => {
    if (location.hash) {
      const sectionId = location.hash.substring(1);
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <header className="relative fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.08)] border-b border-border/30 before:content-[''] before:absolute before:-bottom-2 before:left-0 before:right-0 before:h-4 before:rounded-b-[50%] before:bg-background">



      <div className="container mx-auto px-4 sm:px-6">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link
              to={isAuthenticated && userRole === "RESIDENT" ? "/resident-dashboard" : "/"}
              className="flex items-center gap-2 group"
            >
              <div className="text-3xl font-bold tracking-tighter">
                <span className="text-primary group-hover:text-primary/80 transition-colors">AY</span>
                <span className="text-foreground group-hover:text-foreground/80 transition-colors">TO</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
            </Link>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full text-foreground/70 hover:text-foreground hover:bg-accent/50"
            >
              {theme === 'dark' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              className="rounded-full text-foreground/70 hover:text-foreground hover:bg-accent/50"
              aria-label="Toggle language"
            >
              <Languages className="h-5 w-5" />
            </Button>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-foreground/70 hover:text-foreground hover:bg-accent/50"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] max-w-sm">
                <nav className="flex flex-col h-full">
                  <div className="flex-1 flex flex-col gap-1 pt-6">
                    {navItems.map((item) => (
                      <Button
                        key={item.label}
                        variant={isActiveLink(item.href) ? "secondary" : "ghost"}
                        onClick={() => {
                          handleNavigation(item.href);
                          setIsOpen(false);
                        }}
                        className="justify-start rounded-lg h-12 text-base"
                      >
                        {item.label}
                      </Button>
                    ))}

                    {!isAuthenticated && authNavItems.map((item) => (
                      <Button
                        key={item.label}
                        variant={item.label === t.login ? "outline" : "default"}
                        onClick={() => {
                          handleNavigation(item.href);
                          setIsOpen(false);
                        }}
                        className="justify-start rounded-lg h-12 text-base"
                      >
                        {item.label}
                      </Button>
                    ))}
                  </div>

                  {isAuthenticated && (
                    <div className="mt-auto pb-6">
                      <div className="px-4 py-3 rounded-lg bg-accent/50 mb-4">
                        <div className="font-medium text-foreground">{userName}</div>
                        <div className="text-xs text-muted-foreground">{t.loggedIn}</div>
                      </div>

                      <ChangePasswordDialog buttonText={t.changePassword} />

                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 px-4 h-12 rounded-lg text-destructive hover:text-destructive"
                        onClick={logout}
                      >
                        <LogOut className="h-5 w-5" />
                        <span>{t.logout}</span>
                      </Button>
                    </div>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-1 mr-2">
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  variant={isActiveLink(item.href) ? "secondary" : "ghost"}
                  onClick={() => handleNavigation(item.href)}
                  className="rounded-lg px-4 font-medium"
                >
                  {item.label}
                </Button>
              ))}
            </div>

            <div className="h-8 w-px bg-border mx-2" />

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              className="rounded-full text-foreground/70 hover:text-foreground hover:bg-accent/50"
              aria-label="Toggle language"
            >
              <Languages className="h-5 w-5" />
              <span className="sr-only">{t.language}</span>
            </Button>

            {!isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={toggleTheme}
                  className="rounded-full w-10 h-10 p-0 text-foreground/70 hover:text-foreground hover:bg-accent/50"
                >
                  {theme === 'dark' ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <Sun className="h-5 w-5" />
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleNavigation("/login")}
                  className="rounded-lg px-4 font-medium"
                >
                  {t.login}
                </Button>
                <Button
                  onClick={() => handleNavigation("/register")}
                  className="rounded-lg px-4 font-medium"
                >
                  {t.signUp}
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={toggleTheme}
                  className="rounded-full w-10 h-10 p-0 text-foreground/70 hover:text-foreground hover:bg-accent/50"
                >
                  {theme === 'dark' ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <Sun className="h-5 w-5" />
                  )}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="rounded-lg pl-3 pr-2 h-10 gap-1 hover:bg-accent/50"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <UserCircle2 className="h-5 w-5 text-primary" />
                        </div>
                        <span className="font-medium text-foreground">{userName}</span>
                      </div>
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-xl p-2">
                    <DropdownMenuItem className="flex flex-col items-start gap-1 cursor-default rounded-lg p-3">
                      <span className="font-medium text-foreground">{userName}</span>
                      <span className="text-xs text-muted-foreground">{t.loggedIn}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="opacity-50" />
                    <ChangePasswordDialog buttonText={t.changePassword} />
                    <DropdownMenuItem
                      onClick={logout}
                      className="cursor-pointer text-destructive rounded-lg p-3 focus:bg-destructive/10"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{t.logout}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};