import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

// Types for translation
type DialogTranslationKey = 'close' | 'title' | 'description';

const dialogTranslations = {
  en: {
    close: "Close",
    title: "Dialog Title",
    description: "Dialog description text goes here"
  },
  am: {
    close: "ዝጋ",
    title: "የመገናኛ ርዕስ",
    description: "የመገናኛ መግለጫ ጽሑ� እዚህ ይገኛል"
  }
};

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "dark:bg-gray-900/90",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

interface DialogContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  dir?: "ltr" | "rtl";
  lang?: "en" | "am";
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, children, dir = "ltr", lang = "en", ...props }, ref) => {
  const t = (key: DialogTranslationKey) => dialogTranslations[lang][key];
  
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        dir={dir}
        lang={lang}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4",
          "rounded-xl border bg-background p-6 shadow-2xl duration-200",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
          "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
          "sm:rounded-2xl md:w-full",
          "dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100",
          className
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          className={cn(
            "absolute right-4 top-4 rounded-sm p-1 opacity-70 ring-offset-background transition-opacity",
            "hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
            "dark:hover:bg-gray-700"
          )}
          aria-label={t('close')}
        >
          <X className="h-5 w-5" />
          <span className="sr-only">{t('close')}</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
})
DialogContent.displayName = DialogPrimitive.Content.displayName

interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  dir?: "ltr" | "rtl";
}

const DialogHeader = ({
  className,
  dir = "ltr",
  ...props
}: DialogHeaderProps) => (
  <div
    dir={dir}
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      "space-y-2 sm:space-y-0",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

interface DialogTitleProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title> {
  as?: "h1" | "h2" | "h3" | "h4";
}

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  DialogTitleProps
>(({ className, as: Component = "h2", ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    asChild
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      "dark:text-white",
      className
    )}
    {...props}
  >
    <Component />
  </DialogPrimitive.Title>
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn(
      "text-sm text-muted-foreground",
      "dark:text-gray-400",
      className
    )}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

// Dialog provider for translation context
const DialogContext = React.createContext<{
  lang: 'en' | 'am';
  setLang: (lang: 'en' | 'am') => void;
}>({
  lang: 'en',
  setLang: () => {}
});

interface DialogProviderProps {
  children: React.ReactNode;
  defaultLang?: 'en' | 'am';
}

const DialogProvider = ({ children, defaultLang = 'en' }: DialogProviderProps) => {
  const [lang, setLang] = React.useState<'en' | 'am'>(defaultLang);

  return (
    <DialogContext.Provider value={{ lang, setLang }}>
      {children}
    </DialogContext.Provider>
  );
};

const useDialog = () => React.useContext(DialogContext);

export {
  Dialog,
  DialogProvider,
  useDialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}