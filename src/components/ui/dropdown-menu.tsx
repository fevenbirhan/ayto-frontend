import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

// Amharic translations
const translations = {
  en: {
    select: "Select",
    checked: "Checked",
    unchecked: "Unchecked",
    close: "Close",
  },
  am: {
    select: "ምረጥ",
    checked: "ተመርጧል",
    unchecked: "አልተመረጠም",
    close: "ዝጋ",
  },
};

// Shared props type (not interface to avoid extension issues)
type DropdownProps = {
  lang?: "en" | "am";
  className?: string;
};

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuGroup = DropdownMenuPrimitive.Group;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
const DropdownMenuSub = DropdownMenuPrimitive.Sub;
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

// SubTrigger Component
type DropdownMenuSubTriggerProps = 
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  } & DropdownProps;

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  DropdownMenuSubTriggerProps
>(({ className, inset, children, lang = "en", ...props }, ref) => {
  const t = translations[lang];
  return (
    <DropdownMenuPrimitive.SubTrigger
      ref={ref}
      className={cn(
        "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
        "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent",
        "transition-colors duration-200",
        "dark:focus:bg-accent-dark dark:focus:text-accent-foreground-dark dark:data-[state=open]:bg-accent-dark",
        inset && "pl-8",
        className
      )}
      aria-label={t.select}
      {...props}
    >
      {children}
      <ChevronRight className="ml-auto h-4 w-4" />
    </DropdownMenuPrimitive.SubTrigger>
  );
});
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;

// SubContent Component
type DropdownMenuSubContentProps = 
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent> & 
  DropdownProps;

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  DropdownMenuSubContentProps
>(({ className, lang = "en", ...props }, ref) => {
  const t = translations[lang];
  return (
    <DropdownMenuPrimitive.SubContent
      ref={ref}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "dark:bg-popover-dark dark:text-popover-foreground-dark dark:border-border-dark",
        className
      )}
      aria-label={t.select}
      {...props}
    />
  );
});
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;

// Content Component
type DropdownMenuContentProps = 
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content> & 
  DropdownProps & {
    sideOffset?: number;
  };

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  DropdownMenuContentProps
>(({ className, sideOffset = 4, lang = "en", ...props }, ref) => {
  const t = translations[lang];
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "dark:bg-popover-dark dark:text-popover-foreground-dark dark:border-border-dark",
          className
        )}
        aria-label={t.select}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
});
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

// Item Component
type DropdownMenuItemProps = 
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & 
  DropdownProps & {
    inset?: boolean;
  };

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  DropdownMenuItemProps
>(({ className, inset, lang = "en", ...props }, ref) => {
  const t = translations[lang];
  return (
    <DropdownMenuPrimitive.Item
      ref={ref}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
        "focus:bg-accent focus:text-accent-foreground transition-colors",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "dark:focus:bg-accent-dark dark:focus:text-accent-foreground-dark",
        inset && "pl-8",
        className
      )}
      aria-label={t.select}
      {...props}
    />
  );
});
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

// CheckboxItem Component
type DropdownMenuCheckboxItemProps = 
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem> & 
  DropdownProps;

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  DropdownMenuCheckboxItemProps
>(({ className, children, checked, lang = "en", ...props }, ref) => {
  const t = translations[lang];
  return (
    <DropdownMenuPrimitive.CheckboxItem
      ref={ref}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
        "focus:bg-accent focus:text-accent-foreground transition-colors",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "dark:focus:bg-accent-dark dark:focus:text-accent-foreground-dark",
        className
      )}
      checked={checked}
      aria-label={checked ? t.checked : t.unchecked}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Check className="h-4 w-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
});
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;

// RadioItem Component
type DropdownMenuRadioItemProps = 
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem> & 
  DropdownProps;

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  DropdownMenuRadioItemProps
>(({ className, children, lang = "en", ...props }, ref) => {
  const t = translations[lang];
  return (
    <DropdownMenuPrimitive.RadioItem
      ref={ref}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
        "focus:bg-accent focus:text-accent-foreground transition-colors",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "dark:focus:bg-accent-dark dark:focus:text-accent-foreground-dark",
        className
      )}
      aria-label={t.select}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Circle className="h-2 w-2 fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
});
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

// Label Component
type DropdownMenuLabelProps = 
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & 
  DropdownProps & {
    inset?: boolean;
  };

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  DropdownMenuLabelProps
>(({ className, inset, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.Label
      ref={ref}
      className={cn(
        "px-2 py-1.5 text-sm font-semibold",
        "dark:text-foreground-dark",
        inset && "pl-8",
        className
      )}
      {...props}
    />
  );
});
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

// Separator Component
const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn(
      "-mx-1 my-1 h-px bg-muted",
      "dark:bg-muted-dark",
      className
    )}
    {...props}
  />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

// Shortcut Component
const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest opacity-60",
        "dark:opacity-70",
        className
      )}
      {...props}
    />
  );
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};