import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Key } from "lucide-react";
import { ChangePasswordForm } from "./ChangePasswordForm";

export const ChangePasswordDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDialogOpen(true);
          }}
        >
          <Key className="mr-2 h-4 w-4" />
          Change Password
        </Button>
      </DialogTrigger>
      <DialogContent 
        className="sm:max-w-[425px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>
        <ChangePasswordForm 
          onSuccess={() => setDialogOpen(false)}
          onCancel={() => setDialogOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};