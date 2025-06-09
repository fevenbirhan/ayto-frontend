import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Sun, Moon, Languages } from "lucide-react"

// Translation context
const ButtonContext = React.createContext({
  isAmharic: false,
  darkMode: false,
  direction: 'ltr' as 'ltr' | 'rtl'
})

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow hover:shadow-md",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow hover:shadow-md",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground dark:border-gray-700 dark:hover:bg-gray-800",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow hover:shadow-md",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-gray-800",
        link: "text-primary underline-offset-4 hover:underline",
        premium: "bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400 text-white shadow-lg hover:shadow-xl hover:brightness-110",
        success: "bg-emerald-600 text-white hover:bg-emerald-700 shadow hover:shadow-md dark:bg-emerald-700 dark:hover:bg-emerald-800",
        warning: "bg-amber-500 text-white hover:bg-amber-600 shadow hover:shadow-md dark:bg-amber-600 dark:hover:bg-amber-700"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-14 rounded-lg px-10 text-base",
        icon: "h-10 w-10",
        iconSm: "h-8 w-8",
        iconLg: "h-12 w-12"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  darkMode?: boolean
  defaultAmharic?: boolean
  amharicText?: string
  withLanguageToggle?: boolean
  withDarkModeToggle?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    darkMode = false,
    defaultAmharic = false,
    amharicText,
    withLanguageToggle = false,
    withDarkModeToggle = false,
    children,
    ...props 
  }, ref) => {
    const [isAmharic, setIsAmharic] = React.useState(defaultAmharic)
    const [isDarkMode, setIsDarkMode] = React.useState(darkMode)
    const direction = isAmharic ? 'rtl' : 'ltr'

    const Comp = asChild ? Slot : "button"

    return (
      <ButtonContext.Provider value={{ 
        isAmharic, 
        darkMode: isDarkMode,
        direction 
      }}>
        <div className="relative group">
          <Comp
            className={cn(
              buttonVariants({ variant, size }),
              isDarkMode ? 'dark-mode-adjustments' : '',
              'relative z-10',
              className
            )}
            dir={direction}
            ref={ref}
            {...props}
          >
            {isAmharic && amharicText ? amharicText : children}
          </Comp>

          {/* Controls - only visible on hover */}
          {(withLanguageToggle || withDarkModeToggle) && (
            <div className={cn(
              "absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity",
              "flex gap-1 bg-background rounded-full p-0.5 shadow-sm z-20"
            )}>
              {withLanguageToggle && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsAmharic(!isAmharic)
                  }}
                  className={cn(
                    "p-1 rounded-full text-xs",
                    isDarkMode 
                      ? "bg-gray-700 text-gray-200 hover:bg-gray-600" 
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  )}
                  aria-label={isAmharic ? "ቋንቋ ቀይር" : "Change language"}
                >
                  <Languages className="h-3 w-3" />
                </button>
              )}
              {withDarkModeToggle && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsDarkMode(!isDarkMode)
                  }}
                  className={cn(
                    "p-1 rounded-full text-xs",
                    isDarkMode 
                      ? "bg-gray-700 text-gray-200 hover:bg-gray-600" 
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  )}
                  aria-label={isAmharic ? "የጨለማ ሞድ" : "Toggle dark mode"}
                >
                  {isDarkMode ? (
                    <Sun className="h-3 w-3" />
                  ) : (
                    <Moon className="h-3 w-3" />
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </ButtonContext.Provider>
    )
  }
)
Button.displayName = "Button"

// Pre-styled button components for common use cases
const PrimaryButton = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => (
  <Button ref={ref} variant="default" {...props} />
))

const DestructiveButton = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => (
  <Button ref={ref} variant="destructive" {...props} />
))

const OutlineButton = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => (
  <Button ref={ref} variant="outline" {...props} />
))

const PremiumButton = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => (
  <Button ref={ref} variant="premium" {...props} />
))

const SuccessButton = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => (
  <Button ref={ref} variant="success" {...props} />
))

const WarningButton = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => (
  <Button ref={ref} variant="warning" {...props} />
))

// Amharic button component
const AmharicButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'defaultAmharic'>>(
  (props, ref) => (
    <Button ref={ref} defaultAmharic={true} {...props} />
  )
)

export { 
  Button,
  PrimaryButton,
  DestructiveButton,
  OutlineButton,
  PremiumButton,
  SuccessButton,
  WarningButton,
  AmharicButton,
  buttonVariants 
}