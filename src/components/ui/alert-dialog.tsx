import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Sun, Moon, Languages } from "lucide-react"

// Translation context
const TranslationContext = React.createContext({
  isAmharic: false,
  toggleLanguage: () => {},
})

const AlertDialog = ({
  children,
  defaultAmharic = false,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Root> & {
  defaultAmharic?: boolean
}) => {
  const [isAmharic, setIsAmharic] = React.useState(defaultAmharic)
  
  return (
    <TranslationContext.Provider value={{
      isAmharic,
      toggleLanguage: () => setIsAmharic(!isAmharic)
    }}>
      <AlertDialogPrimitive.Root {...props}>
        {children}
      </AlertDialogPrimitive.Root>
    </TranslationContext.Provider>
  )
}

const AlertDialogTrigger = AlertDialogPrimitive.Trigger

const AlertDialogPortal = AlertDialogPrimitive.Portal

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content> & {
    darkMode?: boolean
  }
>(({ className, darkMode = false, ...props }, ref) => {
  const { isAmharic, toggleLanguage } = React.useContext(TranslationContext)
  
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 p-6 shadow-lg duration-200",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
          "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
          "rounded-lg border",
          darkMode 
            ? "bg-gray-900 border-gray-700 text-gray-100" 
            : "bg-white border-gray-200 text-gray-900",
          className
        )}
        {...props}
      >
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => {} /* You'll need to handle dark mode toggle */}
            className="p-1 rounded-md hover:bg-gray-700/30"
            aria-label={isAmharic ? "የጨለማ ሞድ" : "Toggle dark mode"}
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            onClick={toggleLanguage}
            className="p-1 rounded-md hover:bg-gray-700/30"
            aria-label={isAmharic ? "ቋንቋ ቀይር" : "Change language"}
          >
            <Languages className="h-4 w-4" />
          </button>
        </div>
        {props.children}
      </AlertDialogPrimitive.Content>
    </AlertDialogPortal>
  )
})
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter = ({
  className,
  darkMode = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { darkMode?: boolean }) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      darkMode ? "border-t border-gray-700 pt-4" : "border-t border-gray-200 pt-4",
      className
    )}
    {...props}
  />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title> & {
    amharicTitle?: string
  }
>(({ className, children, amharicTitle, ...props }, ref) => {
  const { isAmharic } = React.useContext(TranslationContext)
  
  return (
    <AlertDialogPrimitive.Title
      ref={ref}
      className={cn(
        "text-lg font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    >
      {isAmharic && amharicTitle ? amharicTitle : children}
    </AlertDialogPrimitive.Title>
  )
})
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description> & {
    amharicDescription?: string
    darkMode?: boolean
  }
>(({ className, children, amharicDescription, darkMode = false, ...props }, ref) => {
  const { isAmharic } = React.useContext(TranslationContext)
  
  return (
    <AlertDialogPrimitive.Description
      ref={ref}
      className={cn(
        "text-sm",
        darkMode ? "text-gray-300" : "text-gray-600",
        className
      )}
      {...props}
    >
      {isAmharic && amharicDescription ? amharicDescription : children}
    </AlertDialogPrimitive.Description>
  )
})
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action> & {
    darkMode?: boolean
    amharicText?: string
  }
>(({ className, children, darkMode = false, amharicText, ...props }, ref) => {
  const { isAmharic } = React.useContext(TranslationContext)
  
  return (
    <AlertDialogPrimitive.Action
      ref={ref}
      className={cn(
        buttonVariants(),
        darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600",
        className
      )}
      {...props}
    >
      {isAmharic && amharicText ? amharicText : children}
    </AlertDialogPrimitive.Action>
  )
})
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel> & {
    darkMode?: boolean
    amharicText?: string
  }
>(({ className, children, darkMode = false, amharicText, ...props }, ref) => {
  const { isAmharic } = React.useContext(TranslationContext)
  
  return (
    <AlertDialogPrimitive.Cancel
      ref={ref}
      className={cn(
        buttonVariants({ variant: "outline" }),
        darkMode 
          ? "border-gray-700 text-gray-100 hover:bg-gray-800" 
          : "border-gray-200 text-gray-900 hover:bg-gray-50",
        "mt-2 sm:mt-0",
        className
      )}
      {...props}
    >
      {isAmharic && amharicText ? amharicText : children}
    </AlertDialogPrimitive.Cancel>
  )
})
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}