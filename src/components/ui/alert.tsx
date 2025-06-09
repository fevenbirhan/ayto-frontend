import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { X, Sun, Moon, Languages } from "lucide-react"

// Translation context
const AlertContext = React.createContext({
  isAmharic: false,
  toggleLanguage: () => {},
  darkMode: false,
})

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 pr-8 [&>svg~*]:pl-8 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground border-border",
        primary: "bg-primary/10 text-primary border-primary/20",
        success: "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-100 dark:border-emerald-800",
        warning: "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-100 dark:border-amber-800",
        destructive: "bg-red-50 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-100 dark:border-red-800",
        info: "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-100 dark:border-blue-800",
      },
      elevation: {
        flat: "shadow-none",
        low: "shadow-sm",
        medium: "shadow",
        high: "shadow-md",
      },
    },
    defaultVariants: {
      variant: "default",
      elevation: "low",
    },
  }
)

interface AlertProps extends React.HTMLAttributes<HTMLDivElement>, 
  VariantProps<typeof alertVariants> {
  closable?: boolean
  onClose?: () => void
  defaultAmharic?: boolean
  defaultDarkMode?: boolean
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ 
    className, 
    variant, 
    elevation, 
    closable, 
    onClose, 
    defaultAmharic = false,
    defaultDarkMode = false,
    children, 
    ...props 
  }, ref) => {
    const [isAmharic, setIsAmharic] = React.useState(defaultAmharic)
    const [darkMode, setDarkMode] = React.useState(defaultDarkMode)
    const [isClosed, setIsClosed] = React.useState(false)

    const handleClose = () => {
      setIsClosed(true)
      onClose?.()
    }

    if (isClosed) return null

    return (
      <AlertContext.Provider value={{
        isAmharic,
        toggleLanguage: () => setIsAmharic(!isAmharic),
        darkMode
      }}>
        <div
          ref={ref}
          role="alert"
          className={cn(
            alertVariants({ variant, elevation }),
            darkMode ? "dark-mode-styles" : "light-mode-styles",
            "transition-all duration-200",
            className
          )}
          {...props}
        >
          {closable && (
            <button
              onClick={handleClose}
              className="absolute right-3 top-3 rounded-sm p-0.5 opacity-70 hover:opacity-100"
              aria-label={isAmharic ? "ዝጋ" : "Close"}
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          <div className="absolute right-10 top-3 flex gap-1">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="rounded-sm p-0.5 opacity-70 hover:opacity-100"
              aria-label={isAmharic ? "የጨለማ ሞድ" : "Toggle dark mode"}
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setIsAmharic(!isAmharic)}
              className="rounded-sm p-0.5 opacity-70 hover:opacity-100"
              aria-label={isAmharic ? "ቋንቋ ቀይር" : "Change language"}
            >
              <Languages className="h-4 w-4" />
            </button>
          </div>
          
          {children}
        </div>
      </AlertContext.Provider>
    )
  }
)
Alert.displayName = "Alert"

interface AlertTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  amharicTitle?: string
}

const AlertTitle = React.forwardRef<HTMLParagraphElement, AlertTitleProps>(
  ({ className, children, amharicTitle, ...props }, ref) => {
    const { isAmharic } = React.useContext(AlertContext)
    
    return (
      <h5
        ref={ref}
        className={cn(
          "mb-2 font-medium leading-none tracking-tight text-lg flex items-center gap-2",
          className
        )}
        {...props}
      >
        {isAmharic && amharicTitle ? amharicTitle : children}
      </h5>
    )
  }
)
AlertTitle.displayName = "AlertTitle"

interface AlertDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  amharicDescription?: React.ReactNode
}

const AlertDescription = React.forwardRef<HTMLParagraphElement, AlertDescriptionProps>(
  ({ className, children, amharicDescription, ...props }, ref) => {
    const { isAmharic } = React.useContext(AlertContext)
    
    return (
      <div
        ref={ref}
        className={cn(
          "text-sm [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5",
          className
        )}
        {...props}
      >
        {isAmharic && amharicDescription ? amharicDescription : children}
      </div>
    )
  }
)
AlertDescription.displayName = "AlertDescription"

// Pre-styled alert components for common use cases
const AlertPrimary = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) => (
  <Alert ref={ref} variant="primary" {...props} />
))

const AlertSuccess = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) => (
  <Alert ref={ref} variant="success" {...props} />
))

const AlertWarning = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) => (
  <Alert ref={ref} variant="warning" {...props} />
))

const AlertDestructive = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) => (
  <Alert ref={ref} variant="destructive" {...props} />
))

const AlertInfo = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) => (
  <Alert ref={ref} variant="info" {...props} />
))

export { 
  Alert,
  AlertPrimary,
  AlertSuccess,
  AlertWarning,
  AlertDestructive,
  AlertInfo,
  AlertTitle,
  AlertDescription 
}