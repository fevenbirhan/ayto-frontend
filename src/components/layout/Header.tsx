// Header.tsx
import { useState } from "react";
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
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/components/ThemeProvider";
import { Switch } from "@/components/ui/switch";
import { ChangePasswordDialog } from "./ChangePasswordDialog";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, userName, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const baseNavItems = [
    { label: "Home", href: "/" },
    { label: "Features", href: "/#features" },
    { label: "Analytics", href: "/#analytics" },
  ];

  const authNavItems = [
    { label: "Login", href: "/login" },
    { label: "SignUp", href: "/register" },
  ];

  const navItems = baseNavItems;

  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("/#")) {
      e.preventDefault();
      const sectionId = href.substring(2);
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className="bg-[#18230F] dark:bg-[#0F1507] w-full">
      <div className="max-w-none mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="text-[40px] font-bold">
                <span className="text-[#255F38]">AY</span>
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
          <div className="md:hidden flex items-center gap-4">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="h-8 w-8" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="bg-[#18230F] dark:bg-[#0F1507] border-[#255F38]"
              >
                <nav className="flex flex-col gap-4 mt-8">
                  {[...navItems, ...(!isAuthenticated ? authNavItems : [])].map((item) => (
                    <Link
                      key={item.label}
                      to={item.href}
                      className="text-white text-lg font-medium hover:text-[#255F38] transition-colors"
                      onClick={(e) => {
                        handleSectionClick(e, item.href);
                        setIsOpen(false);
                      }}
                    >
                      {item.label}
                    </Link>
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
              <Link
                key={item.label}
                to={item.href}
                className="text-white text-lg font-medium hover:text-[#255F38] transition-colors"
                onClick={(e) => handleSectionClick(e, item.href)}
              >
                {item.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 text-white hover:text-[#255F38]">
                    <UserCircle2 className="h-6 w-6" />
                    <span className="font-medium">{userName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem className="flex flex-col items-start gap-1 cursor-default">
                    <span className="font-medium">{userName}</span>
                    <span className="text-xs text-gray-500">Logged in</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />

                  <ChangePasswordDialog />

                  <DropdownMenuItem className="cursor-pointer" onClick={(e) => e.preventDefault()}>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        {theme === 'dark' ? (
                          <Moon className="mr-2 h-4 w-4" />
                        ) : (
                          <Sun className="mr-2 h-4 w-4" />
                        )}
                        <span>Theme</span>
                      </div>
                      <Switch
                        checked={theme === 'dark'}
                        onCheckedChange={toggleTheme}
                        className="scale-75"
                      />
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-8">
                {authNavItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="text-white text-lg font-medium hover:text-[#255F38] transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};
