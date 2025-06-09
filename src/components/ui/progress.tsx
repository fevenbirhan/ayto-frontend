import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  className?: string;
  value?: number;
  showLabel?: boolean;
  labelPosition?: 'inside' | 'outside';
  labelColor?: string;
  labelFormat?: (value: number) => string;
  locale?: 'en' | 'am';
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ 
  className, 
  value = 0, 
  showLabel = false, 
  labelPosition = 'inside', 
  labelColor = 'text-white',
  labelFormat,
  locale = 'en',
  ...props 
}, ref) => {
  const formattedValue = Math.min(100, Math.max(0, value || 0));
  
  const defaultLabelFormat = (val: number) => {
    if (locale === 'am') {
      return `${val}% ተጠናቋል`; // "X% completed" in Amharic
    }
    return `${val}%`;
  };

  const displayText = labelFormat ? labelFormat(formattedValue) : defaultLabelFormat(formattedValue);

  return (
    <div className={cn("flex flex-col w-full gap-2", className)}>
      {showLabel && labelPosition === 'outside' && (
        <div className="flex justify-between text-sm text-foreground">
          <span>{locale === 'am' ? 'ሂደት' : 'Progress'}</span>
          <span>{displayText}</span>
        </div>
      )}
      
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative h-3 w-full overflow-hidden rounded-full",
          "bg-gray-200 dark:bg-gray-800",
          showLabel && labelPosition === 'inside' ? 'h-6' : 'h-3'
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            "h-full w-full flex-1 transition-all",
            "bg-blue-600 dark:bg-blue-400",
            showLabel && labelPosition === 'inside' ? 'flex items-center justify-end' : ''
          )}
          style={{ 
            transform: `translateX(-${100 - formattedValue}%)`,
            width: `${formattedValue}%`
          }}
        >
          {showLabel && labelPosition === 'inside' && (
            <span className={cn(
              "text-xs px-2 font-medium",
              labelColor,
              formattedValue > 50 ? 'text-left' : 'text-right'
            )}>
              {displayText}
            </span>
          )}
        </ProgressPrimitive.Indicator>
      </ProgressPrimitive.Root>
    </div>
  );
});

Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };