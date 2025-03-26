import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "#" },
    { label: "Features", href: "#features" },
    { label: "Login", href: "#login" },
    { label: "SignUp", href: "#signup" },
  ];

  return (
    <header className="bg-[#18230F] w-full">
      <div className="max-w-none mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-[40px] font-bold">
              <span className="text-[#255F38]">AY</span>
              <span className="text-white">TO</span>
            </div>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/94a901d7d5339ddc92de5cc277e0f8e5a94872b9"
              alt="Logo"
              className="w-[49px] h-[49px]"
            />
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
                className="bg-[#18230F] border-[#255F38]"
              >
                <nav className="flex flex-col gap-4 mt-8">
                  {navItems.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="text-white text-2xl font-bold hover:text-[#255F38] transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-12">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-white text-[40px] font-bold hover:text-[#255F38] transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
};
