import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ChevronRight, MoreHorizontal, Sun, Moon, Languages } from "lucide-react"
import { cn } from "@/lib/utils"

// Translation context
const BreadcrumbContext = React.createContext({
  isAmharic: false,
  darkMode: false,
  direction: 'ltr' as 'ltr' | 'rtl'
})

interface BreadcrumbProps extends React.ComponentPropsWithoutRef<"nav"> {
  separator?: React.ReactNode
  darkMode?: boolean
  defaultAmharic?: boolean
}

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ 
    children, 
    separator, 
    darkMode = false, 
    defaultAmharic = false,
    className,
    ...props 
  }, ref) => {
    const [isAmharic, setIsAmharic] = React.useState(defaultAmharic)
    const [isDarkMode, setIsDarkMode] = React.useState(darkMode)
    const direction = isAmharic ? 'rtl' : 'ltr'

    return (
      <BreadcrumbContext.Provider value={{ 
        isAmharic, 
        darkMode: isDarkMode,
        direction 
      }}>
        <div className="flex items-center gap-3">
          {/* Language and dark mode toggles */}
          <button
            onClick={() => setIsAmharic(!isAmharic)}
            className={cn(
              "p-1.5 rounded-full",
              isDarkMode 
                ? "text-gray-300 hover:bg-gray-700" 
                : "text-gray-700 hover:bg-gray-200"
            )}
            aria-label={isAmharic ? "ቋንቋ ቀይር" : "Change language"}
          >
            <Languages className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={cn(
              "p-1.5 rounded-full",
              isDarkMode 
                ? "text-gray-300 hover:bg-gray-700" 
                : "text-gray-700 hover:bg-gray-200"
            )}
            aria-label={isAmharic ? "የጨለማ ሞድ" : "Toggle dark mode"}
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Breadcrumb navigation */}
          <nav
            ref={ref}
            aria-label={isAmharic ? "የእንጀራ መንገድ" : "breadcrumb"}
            className={cn(
              "flex-1",
              isDarkMode ? "text-gray-300" : "text-gray-700",
              className
            )}
            dir={direction}
            {...props}
          >
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child, { 
                  separator,
                  isAmharic,
                  darkMode: isDarkMode,
                  direction
                } as React.ComponentProps<typeof BreadcrumbList>)
              }
              return child
            })}
          </nav>
        </div>
      </BreadcrumbContext.Provider>
    )
  }
)
Breadcrumb.displayName = "Breadcrumb"

interface BreadcrumbListProps extends React.ComponentPropsWithoutRef<"ol"> {
  darkMode?: boolean
  separator?: React.ReactNode
  isAmharic?: boolean
  direction?: 'ltr' | 'rtl'
}

const BreadcrumbList = React.forwardRef<HTMLOListElement, BreadcrumbListProps>(
  ({ className, darkMode = false, separator, ...props }, ref) => (
    <ol
      ref={ref}
      className={cn(
        "flex flex-wrap items-center gap-1.5 break-words text-sm sm:gap-2.5",
        darkMode ? "text-gray-300" : "text-muted-foreground",
        className
      )}
      {...props}
    />
  )
)
BreadcrumbList.displayName = "BreadcrumbList"

interface BreadcrumbItemProps extends React.ComponentPropsWithoutRef<"li"> {
  darkMode?: boolean
}

const BreadcrumbItem = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  ({ className, darkMode = false, ...props }, ref) => (
    <li
      ref={ref}
      className={cn(
        "inline-flex items-center gap-1.5",
        darkMode ? "text-gray-300" : "text-gray-600",
        className
      )}
      {...props}
    />
  )
)
BreadcrumbItem.displayName = "BreadcrumbItem"

interface BreadcrumbLinkProps extends React.ComponentPropsWithoutRef<"a"> {
  asChild?: boolean
  darkMode?: boolean
  isAmharic?: boolean
}

const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ asChild, className, darkMode = false, isAmharic = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "a"

    return (
      <Comp
        ref={ref}
        className={cn(
          "transition-colors hover:text-foreground",
          darkMode 
            ? "hover:text-white" 
            : "hover:text-black",
          isAmharic ? "font-medium" : "",
          className
        )}
        {...props}
      />
    )
  }
)
BreadcrumbLink.displayName = "BreadcrumbLink"

interface BreadcrumbPageProps extends React.ComponentPropsWithoutRef<"span"> {
  darkMode?: boolean
  isAmharic?: boolean
}

const BreadcrumbPage = React.forwardRef<HTMLSpanElement, BreadcrumbPageProps>(
  ({ className, darkMode = false, isAmharic = false, ...props }, ref) => (
    <span
      ref={ref}
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn(
        "font-normal",
        darkMode ? "text-white" : "text-foreground",
        isAmharic ? "font-semibold" : "",
        className
      )}
      {...props}
    />
  )
)
BreadcrumbPage.displayName = "BreadcrumbPage"

interface BreadcrumbSeparatorProps extends React.ComponentProps<"li"> {
  darkMode?: boolean
}

const BreadcrumbSeparator = ({
  children,
  className,
  darkMode = false,
  ...props
}: BreadcrumbSeparatorProps) => {
  const { isAmharic } = React.useContext(BreadcrumbContext)
  
  return (
    <li
      role="presentation"
      aria-hidden="true"
      className={cn(
        "[&>svg]:size-3.5",
        darkMode ? "text-gray-400" : "text-gray-500",
        className
      )}
      {...props}
    >
      {children ?? (isAmharic ? <ChevronRight className="rotate-180" /> : <ChevronRight />)}
    </li>
  )
}
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

interface BreadcrumbEllipsisProps extends React.ComponentProps<"span"> {
  darkMode?: boolean
}

const BreadcrumbEllipsis = ({
  className,
  darkMode = false,
  ...props
}: BreadcrumbEllipsisProps) => {
  const { isAmharic } = React.useContext(BreadcrumbContext)
  
  return (
    <span
      role="presentation"
      aria-hidden="true"
      className={cn(
        "flex h-9 w-9 items-center justify-center",
        darkMode ? "text-gray-400" : "text-gray-500",
        className
      )}
      {...props}
    >
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">{isAmharic ? "ተጨማሪ" : "More"}</span>
    </span>
  )
}
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis"

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}