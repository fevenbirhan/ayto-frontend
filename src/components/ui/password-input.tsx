import {
  useState,
  forwardRef,
  ComponentPropsWithoutRef,
} from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "./input";
import { Button } from "./button";

interface PasswordInputProps
  extends Omit<ComponentPropsWithoutRef<"input">, "type" | "size"> {
  showToggle?: boolean;
  error?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, showToggle = true, error, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="relative w-full">
        <Input
          type={showPassword ? "text" : "password"}
          className={cn(
            "pr-12",
            error && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {showToggle && (
          <button
            type="button"
            tabIndex={-1}
            className="absolute top-1/2 right-3 -translate-y-1/2 h-6 w-6 flex items-center justify-center bg-transparent border-none p-0 m-0 focus:outline-none"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-muted-foreground" />
            ) : (
              <Eye className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
        )}
        {error && (
          <p className="text-sm text-red-600 mt-1">{error}</p>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
