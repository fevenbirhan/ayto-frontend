import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState } from "react";
import { PasswordInput } from "@/components/ui/password-input";

interface ChangePasswordFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface FormData {
  oldPassword: string;
  newPassword: string;
}

export const ChangePasswordForm = ({ onSuccess, onCancel }: ChangePasswordFormProps) => {
  const { token, userRole, userId } = useAuth();
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<FormData>();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    setError(null);
    if (!userId || !userRole) {
      setError("User information is incomplete.");
      return;
    }

    try {
      const baseUrl = "http://localhost:8080/ayto";
      const endpoint =
        userRole === "RESIDENT"
          ? `${baseUrl}/residents/${userId}/change-password`
          : `${baseUrl}/government-offices/${userId}/change-password`;

      await axios.put(
        endpoint,
        { newPassword: data.newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Password changed successfully!");
      reset();
      onSuccess?.();
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to change password. Please try again."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <PasswordInput
        placeholder="Old Password"
        {...register("oldPassword", { required: "Old password is required" })}
        disabled={isSubmitting}
      />
      <PasswordInput
        placeholder="New Password"
        {...register("newPassword", {
          required: "New password is required",
          minLength: {
            value: 6,
            message: "New password must be at least 6 characters",
          },
        })}
        disabled={isSubmitting}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Password"}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="w-full"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};