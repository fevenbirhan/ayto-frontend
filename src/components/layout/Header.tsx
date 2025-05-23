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
import { Menu, UserCircle2, LogOut, Key, Sun, Moon } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/components/ThemeProvider";
import { Switch } from "@/components/ui/switch";
import { ChangePasswordDialog } from "./ChangePasswordDialog";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, userName, logout, userRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation items for non-logged-in users
  const publicNavItems = [
    { label: "Home", href: "/" },
    { label: "Features", href: "/#features" },
    { label: "Analytics", href: "/#analytics" },
  ];

  // Navigation items for logged-in residents
  const residentNavItems = [
    { label: "Home", href: "/resident-dashboard" },
    { label: "My Reports", href: "/my-reports" },
    { label: "Feedback", href: "/feedback" },
    { label: "Help & Support", href: "/help-support" },
  ];

  // Authentication items (Login/SignUp)
  const authNavItems = [
    { label: "Login", href: "/login" },
    { label: "Sign Up", href: "/register" },
  ];

  // Determine which navigation items to show based on auth status
  const navItems = isAuthenticated && userRole === "RESIDENT" 
    ? residentNavItems 
    : publicNavItems;

  const handleNavigation = (href: string) => {
    if (href.startsWith("/#")) {
      // For hash links, first navigate to home if not already there
      if (location.pathname !== "/") {
        navigate("/");
        // Wait for navigation to complete before scrolling
        setTimeout(() => {
          const sectionId = href.substring(2);
          const section = document.getElementById(sectionId);
          if (section) {
            section.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      } else {
        // If already on home page, just scroll
        const sectionId = href.substring(2);
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      }
    } else {
      // For regular links, use React Router navigation
      navigate(href);
    }
  };

  const isActiveLink = (href: string) => {
    if (href.startsWith("/#")) {
      // For hash links, check if we're on the home page and the section is visible
      if (location.pathname !== "/") return false;
      const sectionId = href.substring(2);
      const section = document.getElementById(sectionId);
      if (!section) return false;
      const rect = section.getBoundingClientRect();
      return rect.top >= 0 && rect.top <= window.innerHeight;
    }
    
    // For regular links, check if the pathname matches and tab matches if present
    const [path, search] = href.split("?");
    if (search) {
      const [param, value] = search.split("=");
      const currentSearch = new URLSearchParams(location.search);
      return location.pathname === path && currentSearch.get(param) === value;
    }
    return location.pathname === path;
  };

  // Effect to handle hash links on page load
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1A1A1A] border-b border-[#404040] w-full">
      <div className="max-w-none mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link 
              to={isAuthenticated && userRole === "RESIDENT" ? "/resident-dashboard" : "/"} 
              className="flex items-center gap-2"
            >
              <div className="text-[40px] font-bold">
                <span className="text-[#3B82F6]">AY</span>
                <span className="text-white">TO</span>
              </div>
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/94a901d7d5339ddc92de5cc277e0f8e5a94872b9"
                alt="Logo"
                className="w-[49px] h-[49px]"
              />
            </Link>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="h-8 w-8" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="bg-[#1A1A1A] border-[#404040]"
              >
                <nav className="flex flex-col gap-4 mt-8">
                  {navItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        handleNavigation(item.href);
                        setIsOpen(false);
                      }}
                      className={`text-left text-white text-lg font-medium hover:text-[#3B82F6] transition-colors ${
                        isActiveLink(item.href) ? "text-[#3B82F6] border-b-2 border-[#3B82F6]" : ""
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}

                  {!isAuthenticated && authNavItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        handleNavigation(item.href);
                        setIsOpen(false);
                      }}
                      className="text-left text-white text-lg font-medium hover:text-[#3B82F6] transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}

                  {isAuthenticated && (
                    <>
                      <div className="text-white text-lg font-medium mt-6">Profile</div>
                      <div className="flex flex-col gap-2">
                        <div className="text-white">{userName}</div>
                        <ChangePasswordDialog />
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {theme === 'dark' ? (
                              <Moon className="mr-2 h-4 w-4" />
                            ) : (
                              <Sun className="mr-2 h-4 w-4" />
                            )}
                            <span className="text-white">Theme</span>
                          </div>
                          <Switch
                            checked={theme === 'dark'}
                            onCheckedChange={toggleTheme}
                            className="scale-75"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          className="text-red-600 flex items-center justify-start gap-2 px-0"
                          onClick={logout}
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </Button>
                      </div>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigation(item.href)}
                className={`text-white text-lg font-medium hover:text-[#3B82F6] transition-colors ${
                  isActiveLink(item.href) ? "text-[#3B82F6] border-b-2 border-[#3B82F6]" : ""
                }`}
              >
                {item.label}
              </button>
            ))}
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 text-white hover:text-[#3B82F6]">
                    <UserCircle2 className="h-6 w-6" />
                    <span className="font-medium">{userName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-[#2D2D2D] border-[#404040]">
                  <DropdownMenuItem className="flex flex-col items-start gap-1 cursor-default">
                    <span className="font-medium text-white">{userName}</span>
                    <span className="text-xs text-[#A3A3A3]">Logged in</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#404040]" />
                  <ChangePasswordDialog />
                  <DropdownMenuItem className="cursor-pointer" onClick={(e) => e.preventDefault()}>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        {theme === 'dark' ? (
                          <Moon className="mr-2 h-4 w-4" />
                        ) : (
                          <Sun className="mr-2 h-4 w-4" />
                        )}
                        <span className="text-white">Theme</span>
                      </div>
                      <Switch
                        checked={theme === 'dark'}
                        onCheckedChange={toggleTheme}
                        className="scale-75"
                      />
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#404040]" />
                  <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-8">
                {authNavItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleNavigation(item.href)}
                    className="text-white text-lg font-medium hover:text-[#3B82F6] transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};
