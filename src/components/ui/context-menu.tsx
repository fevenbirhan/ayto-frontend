import * as React from "react"
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu"
import { Check, ChevronRight, Circle } from "lucide-react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"

// Translation interface
interface ContextMenuTranslations {
  menuLabel?: string
  checkboxSelected?: string
  radioSelected?: string
}

// Default English translations
const defaultTranslations: ContextMenuTranslations = {
  menuLabel: "Context menu",
  checkboxSelected: "Selected",
  radioSelected: "Selected"
}

// Amharic translations
const amharicTranslations: ContextMenuTranslations = {
  menuLabel: "የጽሑፍ �ጠፍ",
  checkboxSelected: "ተመርጧል",
  radioSelected: "ተመርጧል"
}

const ContextMenu = ContextMenuPrimitive.Root

const ContextMenuTrigger = ContextMenuPrimitive.Trigger

const ContextMenuGroup = ContextMenuPrimitive.Group

const ContextMenuPortal = ContextMenuPrimitive.Portal

const ContextMenuSub = ContextMenuPrimitive.Sub

const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup

const ContextMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
    inset?: boolean
    translations?: ContextMenuTranslations
  }
>(({ className, inset, children, translations = defaultTranslations, ...props }, ref) => {
  const { theme } = useTheme()

  return (
    <ContextMenuPrimitive.SubTrigger
      ref={ref}
      className={cn(
        "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
        "focus:bg-gray-100 dark:focus:bg-gray-800",
        "data-[state=open]:bg-gray-100 dark:data-[state=open]:bg-gray-800",
        "text-gray-900 dark:text-gray-100",
        "transition-colors duration-200",
        inset && "pl-8",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRight className="ml-auto h-4 w-4 text-gray-500 dark:text-gray-400" />
    </ContextMenuPrimitive.SubTrigger>
  )
})
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName

const ContextMenuSubContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent> & {
    translations?: ContextMenuTranslations
  }
>(({ className, translations = defaultTranslations, ...props }, ref) => {
  const { theme } = useTheme()

  return (
    <ContextMenuPrimitive.SubContent
      ref={ref}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border",
        "bg-white dark:bg-gray-900",
        "border-gray-200 dark:border-gray-700",
        "text-gray-900 dark:text-gray-100",
        "shadow-lg dark:shadow-gray-900/50",
        "p-1",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2",
        "data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2",
        "data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  )
})
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName

const ContextMenuContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content> & {
    translations?: ContextMenuTranslations
  }
>(({ className, translations = defaultTranslations, ...props }, ref) => {
  const { theme } = useTheme()

  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        ref={ref}
        className={cn(
          "z-50 min-w-[8rem] overflow-hidden rounded-md border",
          "bg-white dark:bg-gray-900",
          "border-gray-200 dark:border-gray-700",
          "text-gray-900 dark:text-gray-100",
          "shadow-lg dark:shadow-gray-900/50",
          "p-1",
          "animate-in fade-in-80",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2",
          "data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2",
          "data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        aria-label={translations.menuLabel}
        {...props}
      />
    </ContextMenuPrimitive.Portal>
  )
})
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName

const ContextMenuItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
    inset?: boolean
    translations?: ContextMenuTranslations
  }
>(({ className, inset, translations = defaultTranslations, ...props }, ref) => {
  const { theme } = useTheme()

  return (
    <ContextMenuPrimitive.Item
      ref={ref}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
        "focus:bg-gray-100 dark:focus:bg-gray-800",
        "text-gray-900 dark:text-gray-100",
        "transition-colors duration-200",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        inset && "pl-8",
        className
      )}
      {...props}
    />
  )
})
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName

const ContextMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem> & {
    translations?: ContextMenuTranslations
  }
>(({ className, children, checked, translations = defaultTranslations, ...props }, ref) => {
  const { theme } = useTheme()

  return (
    <ContextMenuPrimitive.CheckboxItem
      ref={ref}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
        "focus:bg-gray-100 dark:focus:bg-gray-800",
        "text-gray-900 dark:text-gray-100",
        "transition-colors duration-200",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <ContextMenuPrimitive.ItemIndicator>
          <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
      {checked && (
        <span className="sr-only">{translations.checkboxSelected}</span>
      )}
    </ContextMenuPrimitive.CheckboxItem>
  )
})
const ContextMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem> & {
    translations?: ContextMenuTranslations
  }
>(({ className, children, translations = defaultTranslations, ...props }, ref) => {
  const { theme } = useTheme()

  return (
    <ContextMenuPrimitive.RadioItem
      ref={ref}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
        "focus:bg-gray-100 dark:focus:bg-gray-800",
        "text-gray-900 dark:text-gray-100",
        "transition-colors duration-200",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <ContextMenuPrimitive.ItemIndicator>
          <Circle className="h-2 w-2 fill-current text-blue-600 dark:text-blue-400" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
      <span className="sr-only">
        {translations.radioSelected}
      </span>
    </ContextMenuPrimitive.RadioItem>
  )
})
ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName

const ContextMenuLabel = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
    inset?: boolean
    translations?: ContextMenuTranslations
  }
>(({ className, inset, translations = defaultTranslations, ...props }, ref) => {
  const { theme } = useTheme()

  return (
    <ContextMenuPrimitive.Label
      ref={ref}
      className={cn(
        "px-2 py-1.5 text-sm font-semibold",
        "text-gray-700 dark:text-gray-300",
        inset && "pl-8",
        className
      )}
      {...props}
    />
  )
})
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName

const ContextMenuSeparator = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(({ className, ...props }, ref) => {
  const { theme } = useTheme()

  return (
    <ContextMenuPrimitive.Separator
      ref={ref}
      className={cn(
        "-mx-1 my-1 h-px",
        "bg-gray-200 dark:bg-gray-700",
        className
      )}
      {...props}
    />
  )
})
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName

const ContextMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  const { theme } = useTheme()

  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest",
        "text-gray-500 dark:text-gray-400",
        className
      )}
      {...props}
    />
  )
}
ContextMenuShortcut.displayName = "ContextMenuShortcut"

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
  defaultTranslations,
  amharicTranslations
}