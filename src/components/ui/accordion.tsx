import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown, Sun, Moon, Languages } from "lucide-react"
import { cn } from "@/lib/utils"

// Type for translation context
type TranslationContextType = {
  isAmharic: boolean
  toggleLanguage: () => void
}

const TranslationContext = React.createContext<TranslationContextType>({
  isAmharic: false,
  toggleLanguage: () => {},
})

// Wrapper component to provide translation context
const Accordion = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root> & {
    darkMode?: boolean
    onDarkModeChange?: (darkMode: boolean) => void
    defaultAmharic?: boolean
  }
>(({ 
  className, 
  darkMode = false, 
  onDarkModeChange, 
  defaultAmharic = false,
  children, 
  ...props 
}, ref) => {
  const [isAmharic, setIsAmharic] = React.useState(defaultAmharic)
  
  const toggleLanguage = () => {
    setIsAmharic(!isAmharic)
  }

  return (
    <TranslationContext.Provider value={{ isAmharic, toggleLanguage }}>
      <div className={cn(
        "rounded-lg p-1",
        darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900",
        className
      )}>
        <div className="flex justify-end gap-2 mb-2">
          <button
            onClick={() => onDarkModeChange?.(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label={isAmharic ? "የጨለማ ሞድ" : "Toggle dark mode"}
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            onClick={toggleLanguage}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label={isAmharic ? "ቋንቋ ቀይር" : "Change language"}
          >
            <Languages className="h-4 w-4" />
          </button>
        </div>
        <AccordionPrimitive.Root
          ref={ref}
          className={cn("w-full", darkMode ? "text-gray-100" : "text-gray-900")}
          {...props}
        >
          {children}
        </AccordionPrimitive.Root>
      </div>
    </TranslationContext.Provider>
  )
})
Accordion.displayName = "Accordion"

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> & {
    darkMode?: boolean
  }
>(({ className, darkMode = false, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(
      "border-b transition-colors",
      darkMode ? "border-gray-700 hover:bg-gray-800" : "border-gray-200 hover:bg-gray-50",
      className
    )}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
    darkMode?: boolean
    amharicTitle?: string
  }
>(({ className, children, darkMode = false, amharicTitle, ...props }, ref) => {
  const { isAmharic } = React.useContext(TranslationContext)
  
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
          "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
          darkMode ? "text-gray-100 hover:text-gray-300" : "text-gray-900 hover:text-gray-700",
          className
        )}
        {...props}
      >
        {isAmharic && amharicTitle ? amharicTitle : children}
        <ChevronDown className={cn(
          "h-4 w-4 shrink-0 transition-transform duration-200",
          darkMode ? "text-gray-400" : "text-gray-500"
        )} />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
})
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content> & {
    darkMode?: boolean
    amharicContent?: React.ReactNode
  }
>(({ className, children, darkMode = false, amharicContent, ...props }, ref) => {
  const { isAmharic } = React.useContext(TranslationContext)
  
  return (
    <AccordionPrimitive.Content
      ref={ref}
      className={cn(
        "overflow-hidden text-sm transition-all",
        "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
        darkMode ? "text-gray-300" : "text-gray-700"
      )}
      {...props}
    >
      <div className={cn("pb-4 pt-0", className)}>
        {isAmharic && amharicContent ? amharicContent : children}
      </div>
    </AccordionPrimitive.Content>
  )
})
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }