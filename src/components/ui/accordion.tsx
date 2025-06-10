import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/ThemeProvider"
import { useAuth } from "@/context/AuthContext"
import { Icons } from "@/components/ui/icons"
import { motion } from "framer-motion"

const Accordion = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>
>(({ className, children, ...props }, ref) => {
  const { theme } = useTheme()
  const { language, setLanguage, translations } = useAuth()
  
  const t = translations[language].accordion

  return (
    <div className={cn(
      "rounded-lg p-1 transition-colors duration-300",
      theme === 'dark' ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900",
      className
    )}>
      {/* Controls for theme and language */}
      <motion.div 
        className="flex justify-end gap-2 mb-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
          className={cn(
            "p-2 rounded-full transition-colors",
            theme === 'dark' ? "hover:bg-gray-700" : "hover:bg-gray-200"
          )}
          aria-label={language === 'en' ? "Change language" : "ቋንቋ ቀይር"}
        >
          <Icons.Languages className="h-4 w-4" />
          <span className="sr-only">{t.toggleLanguage}</span>
        </button>
        <button
          onClick={() => theme === 'dark' ? 'light' : 'dark'}
          className={cn(
            "p-2 rounded-full transition-colors",
            theme === 'dark' ? "hover:bg-gray-700" : "hover:bg-gray-200"
          )}
          aria-label={language === 'en' ? "Toggle theme" : "ገጽታ ቀይር"}
        >
          {theme === 'dark' ? (
            <Icons.Sun className="h-4 w-4" />
          ) : (
            <Icons.Moon className="h-4 w-4" />
          )}
          <span className="sr-only">{t.toggleTheme}</span>
        </button>
      </motion.div>

      <AccordionPrimitive.Root
        ref={ref}
        className={cn("w-full", theme === 'dark' ? "text-gray-100" : "text-gray-900")}
        {...props}
      >
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              theme,
              language,
              ...child.props
            } as any)
          }
          return child
        })}
      </AccordionPrimitive.Root>
    </div>
  )
})
Accordion.displayName = "Accordion"

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> & {
    theme?: string
  }
>(({ className, theme = 'light', ...props }, ref) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <AccordionPrimitive.Item
      ref={ref}
      className={cn(
        "border-b transition-colors overflow-hidden",
        theme === 'dark' 
          ? "border-gray-700 hover:bg-gray-800/50" 
          : "border-gray-200 hover:bg-gray-50",
        className
      )}
      {...props}
    />
  </motion.div>
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
    theme?: string
    language?: string
    amharicTitle?: string
  }
>(({ className, children, theme = 'light', language = 'en', amharicTitle, ...props }, ref) => {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
          "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
          theme === 'dark' 
            ? "text-gray-100 hover:text-gray-300" 
            : "text-gray-900 hover:text-gray-700",
          className
        )}
        {...props}
      >
        <span className="text-left">
          {language === 'am' && amharicTitle ? amharicTitle : children}
        </span>
        <ChevronDown className={cn(
          "h-4 w-4 shrink-0 transition-transform duration-200 ml-2",
          theme === 'dark' ? "text-gray-400" : "text-gray-500"
        )} />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
})
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content> & {
    theme?: string
    language?: string
    amharicContent?: React.ReactNode
  }
>(({ className, children, theme = 'light', language = 'en', amharicContent, ...props }, ref) => {
  return (
    <AccordionPrimitive.Content
      ref={ref}
      className={cn(
        "overflow-hidden text-sm transition-all",
        "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
        theme === 'dark' ? "text-gray-300" : "text-gray-700"
      )}
      {...props}
    >
      <motion.div 
        className={cn("pb-4 pt-0", className)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {language === 'am' && amharicContent ? amharicContent : children}
      </motion.div>
    </AccordionPrimitive.Content>
  )
})
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }