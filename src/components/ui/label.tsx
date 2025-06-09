import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Translation context
const LabelContext = React.createContext<{
  language: 'en' | 'am';
  setLanguage: (lang: 'en' | 'am') => void;
}>({
  language: 'en',
  setLanguage: () => {},
});

// Variants with dark mode support
const labelVariants = cva(
  "text-sm font-medium leading-none transition-colors duration-200",
  {
    variants: {
      variant: {
        default: "text-gray-700 dark:text-gray-300",
        primary: "text-blue-600 dark:text-blue-400",
        destructive: "text-red-600 dark:text-red-400",
        success: "text-green-600 dark:text-green-400",
        warning: "text-yellow-600 dark:text-yellow-400",
      },
      size: {
        sm: "text-xs",
        default: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// Wrapper component for language context
const LabelProvider = ({ 
  children,
  language = 'en'
}: {
  children: React.ReactNode;
  language?: 'en' | 'am';
}) => {
  const [currentLanguage, setCurrentLanguage] = React.useState<'en' | 'am'>(language);

  return (
    <LabelContext.Provider value={{ 
      language: currentLanguage, 
      setLanguage: setCurrentLanguage 
    }}>
      {children}
    </LabelContext.Provider>
  );
};

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants> & {
      translatedText?: {
        en: string;
        am: string;
      };
    }
>(({ className, variant, size, translatedText, children, ...props }, ref) => {
  const { language } = React.useContext(LabelContext);
  
  // Get translated content if available
  const content = translatedText 
    ? translatedText[language] 
    : children;

  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(
        labelVariants({ variant, size, className }),
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        "flex items-center gap-1.5" // Added for better icon alignment
      )}
      {...props}
    >
      {content}
    </LabelPrimitive.Root>
  );
});
Label.displayName = LabelPrimitive.Root.displayName;

// Language switcher component for labels
const LabelLanguageSwitcher = () => {
  const { language, setLanguage } = React.useContext(LabelContext);
  
  return (
    <button
      type="button"
      onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
      className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors ml-2"
    >
      {language === 'en' ? 'አማርኛ' : 'English'}
    </button>
  );
};

export { Label, LabelProvider, LabelLanguageSwitcher }