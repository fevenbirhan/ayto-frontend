import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Sun, Moon, Languages } from "lucide-react"

// Translation context
const BadgeContext = React.createContext({
  isAmharic: false,
  darkMode: false,
  direction: 'ltr' as 'ltr' | 'rtl'
})

const badgeVariants = cva(
  "inline-flex items-center rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        warning: "border-transparent bg-amber-500 text-amber-50 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700",
        success: "border-transparent bg-emerald-500 text-emerald-50 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700",
        info: "border-transparent bg-blue-500 text-blue-50 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700",
        outline: "text-foreground border-border hover:bg-accent hover:text-accent-foreground",
        premium: "bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400 text-white border-0"
      },
      size: {
        xs: "text-xs px-2 py-0.5",
        sm: "text-sm px-2.5 py-1",
        md: "text-base px-3 py-1",
        lg: "text-lg px-4 py-1.5"
      },
      rounded: {
        full: "rounded-full",
        lg: "rounded-lg",
        md: "rounded-md",
        sm: "rounded-sm",
        none: "rounded-none"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
      rounded: "full"
    }
  }
)

export interface BadgeProps 
  extends React.HTMLAttributes<HTMLDivElement>, 
    VariantProps<typeof badgeVariants> {
  darkMode?: boolean
  defaultAmharic?: boolean
  amharicText?: string
  withLanguageToggle?: boolean
  withDarkModeToggle?: boolean
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ 
    className, 
    variant, 
    size, 
    rounded,
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
    const [isRtl, setIsRtl] = React.useState(false)

    const direction = isAmharic ? 'rtl' : 'ltr'

    return (
      <BadgeContext.Provider value={{ 
        isAmharic, 
        darkMode: isDarkMode,
        direction 
      }}>
        <div 
          ref={ref}
          dir={direction}
          className={cn(
            badgeVariants({ variant, size, rounded }),
            isDarkMode ? 'dark-mode-adjustments' : '',
            'relative group',
            className
          )}
          {...props}
        >
          {/* Content */}
          <span className="flex items-center gap-1.5">
            {isAmharic && amharicText ? amharicText : children}
          </span>

          {/* Controls - only visible on hover */}
          <div className={cn(
            "absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity",
            "flex gap-1 bg-background rounded-full p-0.5 shadow-sm"
          )}>
            {withLanguageToggle && (
              <button
                onClick={() => setIsAmharic(!isAmharic)}
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
                onClick={() => setIsDarkMode(!isDarkMode)}
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
        </div>
      </BadgeContext.Provider>
    )
  }
)
Badge.displayName = "Badge"

// Amharic badge component
const AmharicBadge = React.forwardRef<HTMLDivElement, Omit<BadgeProps, 'defaultAmharic'>>(
  (props, ref) => (
    <Badge ref={ref} defaultAmharic={true} {...props} />
  )
)
AmharicBadge.displayName = "AmharicBadge"

export { Badge, AmharicBadge, badgeVariants }