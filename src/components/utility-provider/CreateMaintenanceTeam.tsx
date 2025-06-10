import { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { AuthContext } from "@/context/AuthContext";
import { employeeService, Employee } from "@/services/employee";
import { maintenanceTeamService } from "@/services/maintenance-team";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CreateMaintenanceTeamProps {
  onClose: () => void;
}

export const CreateMaintenanceTeam = ({ onClose }: CreateMaintenanceTeamProps) => {
  const { toast } = useToast();
  const { token, userId } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [teamLeaderId, setTeamLeaderId] = useState("");
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      if (!token || !userId) return;
      try {
        const fetchedEmployees = await employeeService.getEmployeesByProvider(userId, token);
        setEmployees(fetchedEmployees);
      } catch (error: any) {
        console.error('Error fetching employees:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to fetch employees",
          variant: "destructive"
        });
      }
    };

    fetchEmployees();
  }, [token, userId, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !userId) {
      toast({
        title: "Error",
        description: "You must be logged in to create a maintenance team",
        variant: "destructive"
      });
      return;
    }

    if (!teamLeaderId) {
      toast({
        title: "Error",
        description: "Please select a team leader",
        variant: "destructive"
      });
      return;
    }

    if (selectedEmployeeIds.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one team member",
        variant: "destructive"
      });
      return;
    }

    // Ensure team leader is included in the employee list
    if (!selectedEmployeeIds.includes(teamLeaderId)) {
      setSelectedEmployeeIds(prev => [...prev, teamLeaderId]);
    }

    setIsSubmitting(true);

    try {
      await maintenanceTeamService.createMaintenanceTeam({
        name: name.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        password: password,
        description: description.trim(),
        skills: skills.trim(),
        utilityProviderId: userId,
        teamLeaderId: teamLeaderId,
        employeeIds: selectedEmployeeIds
      }, token);

      toast({
        title: "Success",
        description: "Maintenance team created successfully",
      });

      setIsOpen(false);
      onClose();
    } catch (error: any) {
      console.error('Error creating maintenance team:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to create maintenance team",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleEmployeeSelection = (employeeId: string) => {
    setSelectedEmployeeIds(prev => 
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const selectedEmployees = employees.filter(emp => selectedEmployeeIds.includes(emp.id));

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#3B82F6] hover:bg-[#2563EB]">
          <Plus className="h-4 w-4 mr-2" />
          Create Team
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#2D2D2D] text-white border-[#404040] max-w-2xl h-[90vh]">
        <DialogHeader>
          <DialogTitle>Create Maintenance Team</DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto flex-1 pr-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Team Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter team name"
                  className="bg-[#1A1A1A] border-[#404040]"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter team email"
                  className="bg-[#1A1A1A] border-[#404040]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter phone number"
                  className="bg-[#1A1A1A] border-[#404040]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="bg-[#1A1A1A] border-[#404040]"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <Input
                id="skills"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="Enter team skills (e.g., Electrical, Plumbing)"
                className="bg-[#1A1A1A] border-[#404040]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter team description"
                className="bg-[#1A1A1A] border-[#404040] min-h-[100px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="teamLeader">Team Leader</Label>
              <Select value={teamLeaderId} onValueChange={setTeamLeaderId}>
                <SelectTrigger id="teamLeader" className="bg-[#1A1A1A] border-[#404040]">
                  <SelectValue placeholder="Select team leader" />
                </SelectTrigger>
                <SelectContent className="bg-[#2D2D2D] border-[#404040]">
                  {employees.map((employee) => (
                    <SelectItem 
                      key={employee.id} 
                      value={employee.id}
                      className="text-white hover:bg-[#404040]"
                    >
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Team Members</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between bg-[#1A1A1A] border-[#404040] hover:bg-[#404040] hover:text-white"
                  >
                    {selectedEmployeeIds.length === 0
                      ? "Select team members"
                      : `${selectedEmployeeIds.length} member${selectedEmployeeIds.length === 1 ? '' : 's'} selected`}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="w-[300px] max-h-[300px] overflow-y-auto bg-[#2D2D2D] border-[#404040]"
                >
                  {employees.map((employee) => (
                    <DropdownMenuCheckboxItem
                      key={employee.id}
                      checked={selectedEmployeeIds.includes(employee.id)}
                      onCheckedChange={() => toggleEmployeeSelection(employee.id)}
                      className="text-white hover:bg-[#404040]"
                    >
                      {employee.name}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {selectedEmployees.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedEmployees.map((employee) => (
                    <Badge
                      key={employee.id}
                      variant="secondary"
                      className="bg-[#3B82F6] text-white"
                    >
                      {employee.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="border-[#404040] text-white hover:bg-[#404040]"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#3B82F6] hover:bg-[#2563EB] text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Team"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 