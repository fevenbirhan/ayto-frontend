import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"
import { cn } from "@/lib/utils"

// Type for translation props
interface RadioGroupTranslations {
  label?: string
  required?: string
}

interface RadioGroupProps extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
  label?: string
  required?: boolean
  translations?: RadioGroupTranslations
  orientation?: "horizontal" | "vertical"
}

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(({ 
  className, 
  label, 
  required = false, 
  translations = {}, 
  orientation = "vertical",
  ...props 
}, ref) => {
  // Default translations (English)
  const defaultTranslations = {
    label: "Options",
    required: "(required)",
    ...translations
  };

  // Amharic translations
  const amharicTranslations: RadioGroupTranslations = {
    label: "አማራጮች",
    required: "(ያስፈልጋል)",
    ...translations
  };

  // Determine which translations to use (you could make this dynamic based on a context)
  const t = amharicTranslations; // or defaultTranslations for English

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center">
          <label className="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label} {required && <span className="text-muted-foreground text-xs">{t.required}</span>}
          </label>
        </div>
      )}
      <RadioGroupPrimitive.Root
        className={cn(
          "grid gap-3",
          orientation === "horizontal" ? "grid-flow-col" : "grid-flow-row",
          className
        )}
        {...props}
        ref={ref}
      />
    </div>
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, children, ...props }, ref) => {
  return (
    <div className="flex items-center space-x-2">
      <RadioGroupPrimitive.Item
        ref={ref}
        className={cn(
          "aspect-square h-5 w-5 rounded-full border border-primary text-primary",
          "ring-offset-background focus:outline-none focus-visible:ring-2",
          "focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "dark:border-primary-400 dark:text-primary-400",
          className
        )}
        {...props}
      >
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
          <Circle className="h-3 w-3 fill-current text-current dark:text-primary-400" />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>
      {children && (
        <label
          htmlFor={props.id}
          className="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-gray-300"
        >
          {children}
        </label>
      )}
    </div>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }