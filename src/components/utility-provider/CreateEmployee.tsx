import { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { AuthContext } from "@/context/AuthContext";
import { employeeService } from "@/services/employee";
import { PasswordInput } from "@/components/ui/password-input";

interface CreateEmployeeProps {
  onSuccess?: () => void;
}

const CreateEmployee = ({ onSuccess }: CreateEmployeeProps) => {
  const { toast } = useToast();
  const { token, userId } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    nationalId: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !userId) {
      toast({
        title: "Error",
        description: "You must be logged in to create an employee",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const employeeData = {
        ...formData,
        role: 'EMPLOYEE' as const,
        accountStatus: 'ACTIVE' as const,
        utilityProviderId: userId,
      };

      await employeeService.createEmployee(employeeData, token);
      
      toast({
        title: "Success",
        description: "Employee created successfully",
      });

      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        address: "",
        nationalId: "",
        password: "",
      });
      setIsOpen(false);
      onSuccess?.();
    } catch (error: any) {
      console.error('Error creating employee:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create employee",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#3B82F6] hover:bg-[#2563EB]">
          <Plus className="h-4 w-4 mr-2" />
          Create Employee
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#2D2D2D] text-white border-[#404040]">
        <DialogHeader>
          <DialogTitle>Create New Employee</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="bg-[#1A1A1A] border-[#404040]"
                placeholder="Enter full name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="bg-[#1A1A1A] border-[#404040]"
                placeholder="Enter email address"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="bg-[#1A1A1A] border-[#404040]"
                placeholder="Enter phone number"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nationalId">National ID</Label>
              <Input
                id="nationalId"
                name="nationalId"
                value={formData.nationalId}
                onChange={handleChange}
                className="bg-[#1A1A1A] border-[#404040]"
                placeholder="Enter national ID"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="bg-[#1A1A1A] border-[#404040]"
                placeholder="Enter address"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <PasswordInput
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="bg-[#1A1A1A] border-[#404040]"
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="border-[#404040] text-white hover:bg-[#404040]"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#3B82F6] hover:bg-[#2563EB] text-white"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Employee"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEmployee; 