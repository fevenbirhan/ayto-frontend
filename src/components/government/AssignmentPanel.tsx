
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Phone, CheckCircle, FileSpreadsheet, Truck, Users, Building2 } from "lucide-react";

type AssignmentPanelProps = {
  report: any;
  onAssign: () => void;
  onCancel: () => void;
};

// Mock data for the assignment options
const departments = [
  { id: "telecom", name: "Ethio Telecom", icon: <Phone className="h-4 w-4" /> },
  { id: "road", name: "Road Ministry", icon: <FileSpreadsheet className="h-4 w-4" /> },
  { id: "water", name: "Water & Sewerage Authority", icon: <CheckCircle className="h-4 w-4" /> },
  { id: "power", name: "Power Corporation", icon: <Building2 className="h-4 w-4" /> },
];

const maintenanceTeams = [
  { id: "team-a", name: "Maintenance Team A", members: 5, availability: "Available" },
  { id: "team-b", name: "Maintenance Team B", members: 4, availability: "Busy until Oct 20" },
  { id: "team-c", name: "Maintenance Team C", members: 6, availability: "Available" },
  { id: "team-d", name: "Emergency Response Team", members: 8, availability: "On call" },
];

export const AssignmentPanel = ({ report, onAssign, onCancel }: AssignmentPanelProps) => {
  const [assignmentTab, setAssignmentTab] = useState("department");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [priority, setPriority] = useState<string>("medium");
  const [notes, setNotes] = useState<string>("");
  
  const handleAssign = () => {
    // Here you would handle the assignment logic
    console.log({
      reportId: report?.id,
      assignedTo: assignmentTab === "department" ? selectedDepartment : selectedTeam,
      assignmentType: assignmentTab,
      priority,
      notes
    });
    
    // Call the onAssign callback to close the dialog
    onAssign();
  };
  
  return (
    <div className="py-4">
      <Tabs value={assignmentTab} onValueChange={setAssignmentTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="department" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Utility Provider
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Maintenance Team
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="department">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {departments.map((dept) => (
                <Card 
                  key={dept.id}
                  className={`cursor-pointer transition-all ${
                    selectedDepartment === dept.id ? 'border-primary ring-1 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedDepartment(dept.id)}
                >
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      {dept.icon}
                      {dept.name}
                    </CardTitle>
                  </CardHeader>
                  <CardFooter className="p-4 pt-2 flex justify-end">
                    <div className={`h-4 w-4 rounded-full ${
                      selectedDepartment === dept.id ? 'bg-primary' : 'bg-muted'
                    }`}></div>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Set Priority Level</Label>
                <RadioGroup 
                  value={priority} 
                  onValueChange={setPriority}
                  className="flex flex-wrap gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="urgent" id="urgent" />
                    <Label htmlFor="urgent" className="text-red-600 font-medium">Urgent</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="high" />
                    <Label htmlFor="high" className="text-orange-600 font-medium">High</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium" className="text-yellow-600 font-medium">Medium</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="low" />
                    <Label htmlFor="low" className="text-blue-600 font-medium">Low</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Assignment Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add important details or instructions..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="team">
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {maintenanceTeams.map((team) => (
                <Card 
                  key={team.id}
                  className={`cursor-pointer transition-all ${
                    selectedTeam === team.id ? 'border-primary ring-1 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedTeam(team.id)}
                >
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        {team.name}
                      </CardTitle>
                      <div className={`h-4 w-4 rounded-full ${
                        selectedTeam === team.id ? 'bg-primary' : 'bg-muted'
                      }`}></div>
                    </div>
                    <CardDescription>
                      <span className="flex justify-between">
                        <span>{team.members} members</span>
                        <span className={`${
                          team.availability === 'Available' ? 'text-green-500' : 
                          team.availability === 'On call' ? 'text-blue-500' : 'text-amber-500'
                        }`}>
                          {team.availability}
                        </span>
                      </span>
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Set Priority Level</Label>
                <RadioGroup 
                  value={priority} 
                  onValueChange={setPriority}
                  className="flex flex-wrap gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="urgent" id="urgent-team" />
                    <Label htmlFor="urgent-team" className="text-red-600 font-medium">Urgent</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="high-team" />
                    <Label htmlFor="high-team" className="text-orange-600 font-medium">High</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="medium-team" />
                    <Label htmlFor="medium-team" className="text-yellow-600 font-medium">Medium</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="low-team" />
                    <Label htmlFor="low-team" className="text-blue-600 font-medium">Low</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="team-notes">Assignment Notes</Label>
                <Textarea
                  id="team-notes"
                  placeholder="Add important details or instructions..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button 
          onClick={handleAssign}
          disabled={
            (assignmentTab === "department" && !selectedDepartment) || 
            (assignmentTab === "team" && !selectedTeam)
          }
        >
          Assign Report
        </Button>
      </div>
    </div>
  );
};
