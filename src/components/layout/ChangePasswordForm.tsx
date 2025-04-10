import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChangePasswordFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface FormData {
  oldPassword: string;
  newPassword: string;
}

export const ChangePasswordForm = ({ onSuccess, onCancel }: ChangePasswordFormProps) => {
  const { token } = useAuth();
  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to change password");
      alert("Password changed successfully!");
      onSuccess?.();
    } catch (error) {
      alert("Error changing password");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        type="password"
        placeholder="Old Password"
        {...register("oldPassword")}
        required
      />
      <Input
        type="password"
        placeholder="New Password"
        {...register("newPassword")}
        required
      />
      <div className="flex gap-2">
        <Button type="submit" className="w-full">
          Update Password
        </Button>
        {onCancel && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="w-full"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};