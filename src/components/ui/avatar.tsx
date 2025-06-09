import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Sun, Moon, Languages } from "lucide-react"

// Translation context
const AvatarContext = React.createContext({
  isAmharic: false,
  darkMode: false,
})

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full",
  {
    variants: {
      size: {
        xs: "h-6 w-6 text-xs",
        sm: "h-8 w-8 text-sm",
        md: "h-10 w-10 text-base",
        lg: "h-12 w-12 text-lg",
        xl: "h-16 w-16 text-xl",
        xxl: "h-24 w-24 text-2xl"
      },
      border: {
        none: "border-0",
        subtle: "border-2",
        bold: "border-4"
      }
    },
    defaultVariants: {
      size: "md",
      border: "none"
    }
  }
)

interface AvatarProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>, VariantProps<typeof avatarVariants> {
  darkMode?: boolean
  defaultAmharic?: boolean
  status?: "online" | "offline" | "busy" | "away"
  statusPosition?: "top-right" | "top-left" | "bottom-right" | "bottom-left"
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ 
  className, 
  darkMode = false, 
  defaultAmharic = false,
  size,
  border,
  status,
  statusPosition = "bottom-right",
  children, 
  ...props 
}, ref) => {
  const [isAmharic, setIsAmharic] = React.useState(defaultAmharic)
  
  return (
    <AvatarContext.Provider value={{ isAmharic, darkMode }}>
      <div className="relative inline-block">
        <AvatarPrimitive.Root
          ref={ref}
          className={cn(
            avatarVariants({ size, border }),
            darkMode ? "border-gray-700" : "border-gray-200",
            className
          )}
          {...props}
        >
          {children}
        </AvatarPrimitive.Root>
        
        {status && (
          <span className={cn(
            "absolute rounded-full border-2",
            darkMode ? "border-gray-900" : "border-white",
            status === "online" ? "bg-green-500" :
            status === "offline" ? "bg-gray-500" :
            status === "busy" ? "bg-red-500" :
            "bg-yellow-500",
            size === "xs" ? "h-2 w-2" :
            size === "sm" ? "h-2.5 w-2.5" :
            size === "md" ? "h-3 w-3" :
            size === "lg" ? "h-3.5 w-3.5" :
            size === "xl" ? "h-4 w-4" : "h-5 w-5",
            statusPosition === "top-right" ? "top-0 right-0" :
            statusPosition === "top-left" ? "top-0 left-0" :
            statusPosition === "bottom-left" ? "bottom-0 left-0" :
            "bottom-0 right-0"
          )} />
        )}
      </div>
    </AvatarContext.Provider>
  )
})
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image> & {
    darkMode?: boolean
  }
>(({ className, darkMode = false, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn(
      "aspect-square h-full w-full object-cover",
      darkMode ? "brightness-90" : "brightness-100",
      className
    )}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

interface AvatarFallbackProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> {
  name?: string
  darkMode?: boolean
  isAmharic?: boolean
}

const getAmharicInitial = (name: string) => {
  // Simple Amharic initial generator (first character)
  return name ? name.charAt(0) : "፩"
}

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  AvatarFallbackProps
>(({ 
  className, 
  name, 
  darkMode = false, 
  isAmharic = false, 
  children, 
  ...props 
}, ref) => {
  const { isAmharic: contextAmharic } = React.useContext(AvatarContext)
  const shouldUseAmharic = isAmharic || contextAmharic
  
  const fallbackText = React.useMemo(() => {
    if (children) return children
    if (name) {
      if (shouldUseAmharic) {
        return getAmharicInitial(name)
      }
      // Get initials for English names
      const names = name.split(' ')
      return names.length > 1 
        ? `${names[0][0]}${names[names.length-1][0]}`.toUpperCase()
        : name.substring(0, 2).toUpperCase()
    }
    return "?"
  }, [name, children, shouldUseAmharic])

  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full font-medium",
        darkMode 
          ? "bg-gray-800 text-gray-300" 
          : "bg-gray-100 text-gray-700",
        className
      )}
      {...props}
    >
      {fallbackText}
    </AvatarPrimitive.Fallback>
  )
})
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

// Avatar group component
const AvatarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    darkMode?: boolean
    max?: number
    spacing?: number
  }
>(({ className, darkMode = false, max = 5, spacing = -8, children, ...props }, ref) => {
  const avatars = React.Children.toArray(children)
  const excess = avatars.length > max ? avatars.length - max : 0
  
  return (
    <div 
      ref={ref}
      className={cn("flex items-center", className)}
      {...props}
    >
      <div className="flex" style={{ marginLeft: `${spacing}px` }}>
        {avatars.slice(0, max).map((child, i) => (
          <div 
            key={i} 
            className="rounded-full" 
            style={{ 
              marginLeft: i !== 0 ? `${spacing}px` : 0,
              zIndex: avatars.length - i
            }}
          >
            {child}
          </div>
        ))}
      </div>
      {excess > 0 && (
        <Avatar darkMode={darkMode} className="ml-2">
          <AvatarFallback darkMode={darkMode}>
            +{excess}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  )
})
AvatarGroup.displayName = "AvatarGroup"

export { 
  Avatar, 
  AvatarImage, 
  AvatarFallback,
  AvatarGroup
}