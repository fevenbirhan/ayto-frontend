import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PasswordInput } from "@/components/ui/password-input";
import { authService } from "@/services/auth";

interface ChangePasswordFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  cancelText?: string;
  submitText?: string;
}

interface ResidentFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface OtherFormData {
  newPassword: string;
}

export const ChangePasswordForm = ({ 
  onSuccess, 
  onCancel, 
  cancelText = "Cancel",
  submitText = "Update Password"
}: ChangePasswordFormProps) => {
  const { token, userRole, userId } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const isResident = userRole === "RESIDENT";

  const {
    register: residentRegister,
    handleSubmit: handleResidentSubmit,
    reset: resetResidentForm,
    watch: watchResidentForm,
    formState: { errors: residentErrors, isSubmitting: isResidentSubmitting }
  } = useForm<ResidentFormData>({
    mode: "onBlur",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  });

  const {
    register: otherRegister,
    handleSubmit: handleOtherSubmit,
    reset: resetOtherForm,
    formState: { errors: otherErrors, isSubmitting: isOtherSubmitting }
  } = useForm<OtherFormData>({
    mode: "onBlur",
    defaultValues: {
      newPassword: ""
    }
  });

  const onResidentSubmit = async (data: ResidentFormData) => {
    try {
      setError(null);
      if (!userId || !token) return setError("Session expired. Please login again.");

      await authService.changeResidentPassword(userId, data, token);
      resetResidentForm();
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || "Failed to change password.");
    }
  };

  const onOtherSubmit = async (data: OtherFormData) => {
    try {
      setError(null);
      if (!userId || !token || !userRole) return setError("Session expired. Please login again.");

      switch (userRole) {
        case "GOVERNMENT_OFFICE":
          await authService.changeGovernmentPassword(userId, data, token);
          break;
        case "UTILITY_PROVIDER":
          await authService.changeUtilityProviderPassword(userId, data, token);
          break;
        case "MAINTENANCE_TEAM":
          await authService.changeMaintenanceTeamPassword(userId, data, token);
          break;
        default:
          return setError("Unsupported role for password change.");
      }

      resetOtherForm();
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || "Failed to change password.");
    }
  };

  const newPassword = watchResidentForm("newPassword");

  return (
    <form 
      onSubmit={isResident ? handleResidentSubmit(onResidentSubmit) : handleOtherSubmit(onOtherSubmit)} 
      className="space-y-4"
    >
      {isResident ? (
        <>
          <PasswordInput
            placeholder="Current Password"
            {...residentRegister("currentPassword", { 
              required: "Current password is required" 
            })}
            error={residentErrors.currentPassword?.message}
            disabled={isResidentSubmitting}
          />

          <PasswordInput
            placeholder="New Password"
            {...residentRegister("newPassword", {
              required: "New password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters"
              }
            })}
            error={residentErrors.newPassword?.message}
            disabled={isResidentSubmitting}
          />

          <PasswordInput
            placeholder="Confirm Password"
            {...residentRegister("confirmPassword", {
              required: "Please confirm your password",
              validate: (val: string) => {
                if (!val) return "Please confirm your password";
                if (val !== newPassword) return "Passwords do not match";
                return true;
              }
            })}
            error={residentErrors.confirmPassword?.message}
            disabled={isResidentSubmitting}
          />
        </>
      ) : (
        <PasswordInput
          placeholder="New Password"
          {...otherRegister("newPassword", {
            required: "New password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters"
            }
          })}
          error={otherErrors.newPassword?.message}
          disabled={isOtherSubmitting}
        />
      )}

      {error && (
        <p className="text-sm text-red-600 bg-red-100 dark:bg-red-900/10 p-2 rounded">
          {error}
        </p>
      )}

      <div className="flex gap-2">
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isResident ? isResidentSubmitting : isOtherSubmitting}
        >
          {(isResident ? isResidentSubmitting : isOtherSubmitting) ? "Updating..." : submitText}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="w-full"
            disabled={isResident ? isResidentSubmitting : isOtherSubmitting}
          >
            {cancelText}
          </Button>
        )}
      </div>
    </form>
  );
};
