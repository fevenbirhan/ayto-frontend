import * as React from "react";
import { cn } from "@/lib/utils";

// Translation types
type InputTranslationKey = "placeholder" | "label";

const inputTranslations = {
  en: {
    placeholder: "Type something...",
    label: "Input",
  },
  am: {
    placeholder: "እባክዎ ይተይቡ...",
    label: "ግብይት",
  },
};

type InputVariant = "default" | "filled" | "outline";
type InputSize = "sm" | "md" | "lg";
type InputLanguage = "en" | "am";

interface InputProps 
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: InputVariant;
  size?: InputSize;
  label?: string;
  lang?: InputLanguage;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      variant = "default",
      size = "md",
      label,
      lang = "en",
      error,
      ...props
    },
    ref
  ) => {
    const t = (key: InputTranslationKey) => inputTranslations[lang][key];

    return (
      <div className="w-full space-y-1">
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}

        <input
          type={type}
          className={cn(
            "flex w-full rounded-lg border bg-background px-4 text-base ring-offset-background transition-all",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
            "placeholder:text-muted-foreground focus-visible:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            "dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus-visible:ring-primary/80",
            // Variants
            variant === "default" && "border-input shadow-sm",
            variant === "filled" && "border-transparent bg-gray-100 dark:bg-gray-700",
            variant === "outline" && "border-2 border-gray-300 dark:border-gray-600",
            // Sizes
            size === "sm" && "h-8 py-1.5 text-sm",
            size === "md" && "h-10 py-2",
            size === "lg" && "h-12 py-3 text-lg",
            // Error state
            error && "border-red-500 dark:border-red-400 focus-visible:ring-red-500/50",
            className
          )}
          ref={ref}
          placeholder={props.placeholder || t("placeholder")}
          {...props}
        />

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

// Input group component
interface InputGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  dir?: "ltr" | "rtl";
  lang?: InputLanguage;
}

const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  ({ className, dir = "ltr", lang = "en", ...props }, ref) => (
    <div
      ref={ref}
      dir={dir}
      lang={lang}
      className={cn("flex flex-col space-y-2", className)}
      {...props}
    />
  )
);
InputGroup.displayName = "InputGroup";

export { Input, InputGroup };