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
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            className={cn(
              "pr-10",
              error && "border-red-500 focus-visible:ring-red-500",
              className
            )}
            ref={ref}
            {...props}
          />
          {showToggle && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute inset-y-0 right-2 my-auto h-5 w-5 p-0 focus:outline-none"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-600 mt-1">{error}</p>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
