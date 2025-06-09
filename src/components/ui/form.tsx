import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

// Translation context
const FormContext = React.createContext<{
  language: 'en' | 'am';
  setLanguage: (lang: 'en' | 'am') => void;
}>({
  language: 'en',
  setLanguage: () => {},
});

const translations = {
  en: {
    required: "This field is required",
    invalid: "Invalid value",
    description: "Please enter the required information",
  },
  am: {
    required: "ይህ መስክ ያስፈልጋል",
    invalid: "የተሳሳተ እሴት",
    description: "እባክዎ የሚያስፈልገውን መረጃ ያስገቡ",
  },
};

const Form = ({ children, language = 'en', ...props }: React.ComponentProps<typeof FormProvider> & { language?: 'en' | 'am' }) => {
  const [currentLanguage, setCurrentLanguage] = React.useState<'en' | 'am'>(language);

  return (
    <FormContext.Provider value={{ 
      language: currentLanguage, 
      setLanguage: setCurrentLanguage 
    }}>
      <FormProvider {...props}>
        {children}
      </FormProvider>
    </FormContext.Provider>
  );
}

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        ref={ref}
        className={cn(
          "space-y-2 p-4 rounded-lg bg-white dark:bg-gray-800",
          "border border-gray-200 dark:border-gray-700",
          "transition-colors duration-200",
          className
        )}
        {...props}
      />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField()
  const { language } = React.useContext(FormContext)

  return (
    <Label
      ref={ref}
      className={cn(
        "block text-sm font-medium text-gray-700 dark:text-gray-300",
        "mb-1 transition-colors duration-200",
        error && "text-red-600 dark:text-red-400",
        className
      )}
      htmlFor={formItemId}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      className={cn(
        error && "border-red-500 dark:border-red-400 focus:ring-red-500 dark:focus:ring-red-400",
        "transition-colors duration-200"
      )}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()
  const { language } = React.useContext(FormContext)

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn(
        "text-sm text-gray-500 dark:text-gray-400",
        "mt-1 transition-colors duration-200",
        className
      )}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const { language } = React.useContext(FormContext)
  const body = error ? String(error?.message) : children

  if (!body) {
    return null
  }

  // Auto-translate common error messages
  let translatedBody = body;
  if (error?.type === 'required') {
    translatedBody = translations[language].required;
  } else if (error?.type === 'validate' || error?.type === 'pattern') {
    translatedBody = translations[language].invalid;
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn(
        "text-sm font-medium text-red-600 dark:text-red-400",
        "mt-1 transition-colors duration-200",
        className
      )}
      {...props}
    >
      {translatedBody}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

// Language switcher component for forms
const FormLanguageSwitcher = ({ className }: { className?: string }) => {
  const { language, setLanguage } = React.useContext(FormContext);
  
  return (
    <div className={cn("flex justify-end mt-4", className)}>
      <button
        type="button"
        onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
        className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
      >
        {language === 'en' ? 'አማርኛ' : 'English'}
      </button>
    </div>
  );
};

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  FormLanguageSwitcher,
}