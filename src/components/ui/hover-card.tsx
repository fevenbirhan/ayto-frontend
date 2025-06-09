import * as React from "react"
import * as HoverCardPrimitive from "@radix-ui/react-hover-card"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"

// Translation interface
interface HoverCardTranslations {
  contentLabel?: string
}

// Default English translations
const defaultTranslations: HoverCardTranslations = {
  contentLabel: "Hover card content"
}

// Amharic translations
const amharicTranslations: HoverCardTranslations = {
  contentLabel: "ማያያዣ ካርድ ይዘት"
}

const HoverCard = HoverCardPrimitive.Root

const HoverCardTrigger = HoverCardPrimitive.Trigger

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content> & {
    translations?: HoverCardTranslations
  }
>(({ 
  className, 
  align = "center", 
  sideOffset = 4, 
  translations = defaultTranslations, 
  ...props 
}, ref) => {
  const { theme } = useTheme()

  return (
    <HoverCardPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-64 rounded-lg border",
        "bg-white dark:bg-gray-900",
        "border-gray-200 dark:border-gray-700",
        "text-gray-900 dark:text-gray-100",
        "shadow-xl dark:shadow-gray-900/50",
        "p-4 outline-none",
        "transform transition-all duration-200 ease-out",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2",
        "data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2",
        "data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      aria-label={translations.contentLabel}
      {...props}
    />
  )
})
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName

export { 
  HoverCard, 
  HoverCardTrigger, 
  HoverCardContent,
  defaultTranslations,
  amharicTranslations
}