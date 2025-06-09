import * as React from "react"
import { cn } from "@/lib/utils"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  dir?: "ltr" | "rtl";
  lang?: "en" | "am";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, dir = "ltr", lang = "en", ...props }, ref) => (
    <div
      ref={ref}
      dir={dir}
      lang={lang}
      className={cn(
        "rounded-xl border bg-card text-card-foreground shadow-sm",
        "transition-all hover:shadow-md dark:border-gray-700",
        "dark:bg-gray-800 dark:text-gray-100",
        className
      )}
      {...props}
    />
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-1.5 p-6",
      "border-b dark:border-b-gray-700",
      className
    )}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

const CardTitle = React.forwardRef<HTMLParagraphElement, CardTitleProps>(
  ({ className, as: Component = "h3", ...props }, ref) => (
    <Component
      ref={ref}
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight",
        "dark:text-white",
        className
      )}
      {...props}
    />
  )
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-sm text-muted-foreground",
      "dark:text-gray-400",
      className
    )}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "p-6 pt-0",
      "text-gray-700 dark:text-gray-300",
      className
    )}
    {...props}
  />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center p-6 pt-0",
      "border-t dark:border-t-gray-700",
      className
    )}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// Translation context and provider
type TranslationKey = 'title' | 'description' | 'content' | 'footer';

const translations = {
  en: {
    title: "Card Title",
    description: "This is a card description",
    content: "Card content goes here",
    footer: "Card footer"
  },
  am: {
    title: "የካርድ �ርዕስ",
    description: "ይህ የካርድ መግለጫ ነው",
    content: "የካርድ ይዘት እዚህ ይገኛል",
    footer: "የካርድ ግርጌ"
  }
};

const TranslationContext = React.createContext<{
  lang: 'en' | 'am';
  t: (key: TranslationKey) => string;
  setLang: (lang: 'en' | 'am') => void;
}>({
  lang: 'en',
  t: (key) => translations.en[key],
  setLang: () => {}
});

interface CardContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultLang?: 'en' | 'am';
  children: React.ReactNode;
}

const CardContainer = ({ 
  defaultLang = 'en', 
  children, 
  className,
  ...props 
}: CardContainerProps) => {
  const [lang, setLang] = React.useState<'en' | 'am'>(defaultLang);

  const t = (key: TranslationKey) => translations[lang][key];

  return (
    <TranslationContext.Provider value={{ lang, t, setLang }}>
      <div className={cn("space-y-4", className)} {...props}>
        <div className="flex justify-end space-x-2">
          <button 
            onClick={() => setLang('en')}
            className={`px-3 py-1 text-sm rounded ${lang === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          >
            English
          </button>
          <button 
            onClick={() => setLang('am')}
            className={`px-3 py-1 text-sm rounded ${lang === 'am' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          >
            አማርኛ
          </button>
        </div>
        {children}
      </div>
    </TranslationContext.Provider>
  );
};

const useTranslation = () => React.useContext(TranslationContext);

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardContainer,
  useTranslation 
};