
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, UserCog, Users, Truck, MapPin, Calendar, Clock, CheckCircle2 } from "lucide-react";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock data for maintenance teams
const maintenanceTeams = [
  {
    id: "team-a",
    name: "Maintenance Team A",
    members: [
      { id: "m1", name: "John Smith", role: "Team Lead", phone: "+251 91 234 5678" },
      { id: "m2", name: "Sarah Johnson", role: "Technician", phone: "+251 91 876 5432" },
      { id: "m3", name: "Michael Brown", role: "Technician", phone: "+251 91 345 6789" },
      { id: "m4", name: "Emily Davis", role: "Assistant", phone: "+251 91 987 6543" },
      { id: "m5", name: "David Wilson", role: "Apprentice", phone: "+251 91 567 8901" },
    ],
    assignments: [
      { id: "#1234", title: "Broken water pipe", location: "Main St & 5th Ave", priority: "High", status: "In Progress", assigned: "2023-10-13", due: "2023-10-15" },
      { id: "#1245", title: "Blocked drainage", location: "Market Square", priority: "Medium", status: "Assigned", assigned: "2023-10-15", due: "2023-10-17" },
    ],
    availability: "Available", 
    completedTasks: 15,
    activeTasks: 2
  },
  {
    id: "team-b",
    name: "Maintenance Team B",
    members: [
      { id: "m6", name: "Robert Miller", role: "Team Lead", phone: "+251 91 123 4567" },
      { id: "m7", name: "Jennifer White", role: "Technician", phone: "+251 91 765 4321" },
      { id: "m8", name: "Daniel Moore", role: "Technician", phone: "+251 91 234 5678" },
      { id: "m9", name: "Lisa Taylor", role: "Assistant", phone: "+251 91 876 5432" },
    ],
    assignments: [
      { id: "#1235", title: "Street light outage", location: "Center Ave", priority: "Low", status: "In Progress", assigned: "2023-10-14", due: "2023-10-16" },
    ],
    availability: "Busy until Oct 20",
    completedTasks: 12,
    activeTasks: 1
  },
  {
    id: "team-c",
    name: "Maintenance Team C",
    members: [
      { id: "m10", name: "James Anderson", role: "Team Lead", phone: "+251 91 234 5678" },
      { id: "m11", name: "Patricia Thomas", role: "Technician", phone: "+251 91 876 5432" },
      { id: "m12", name: "Christopher Harris", role: "Technician", phone: "+251 91 345 6789" },
      { id: "m13", name: "Nancy Jackson", role: "Assistant", phone: "+251 91 987 6543" },
      { id: "m14", name: "Joseph Martin", role: "Apprentice", phone: "+251 91 567 8901" },
      { id: "m15", name: "Susan Lee", role: "Apprentice", phone: "+251 91 678 9012" },
    ],
    assignments: [
      { id: "#1237", title: "Network outage", location: "Eastern District", priority: "High", status: "Assigned", assigned: "2023-10-15", due: "2023-10-17" },
      { id: "#1246", title: "Road sign damaged", location: "Highway 101", priority: "Low", status: "Assigned", assigned: "2023-10-15", due: "2023-10-20" },
      { id: "#1247", title: "Public bench broken", location: "Central Park", priority: "Low", status: "Assigned", assigned: "2023-10-14", due: "2023-10-19" },
    ],
    availability: "Available",
    completedTasks: 18,
    activeTasks: 3
  },
  {
    id: "team-d",
    name: "Emergency Response Team",
    members: [
      { id: "m16", name: "Mark Wilson", role: "Team Lead", phone: "+251 91 234 5678" },
      { id: "m17", name: "Karen Clark", role: "Technician", phone: "+251 91 876 5432" },
      { id: "m18", name: "Donald Lewis", role: "Technician", phone: "+251 91 345 6789" },
      { id: "m19", name: "Elizabeth Hall", role: "Technician", phone: "+251 91 987 6543" },
      { id: "m20", name: "George Young", role: "Technician", phone: "+251 91 567 8901" },
      { id: "m21", name: "Betty King", role: "Assistant", phone: "+251 91 678 9012" },
      { id: "m22", name: "Richard Wright", role: "Assistant", phone: "+251 91 789 0123" },
      { id: "m23", name: "Susan Lopez", role: "Assistant", phone: "+251 91 890 1234" },
    ],
    assignments: [
      { id: "#1236", title: "Pothole on main street", location: "Main Street", priority: "Medium", status: "In Progress", assigned: "2023-10-14", due: "2023-10-16" },
      { id: "#1238", title: "Power line down", location: "Industrial Zone", priority: "Urgent", status: "In Progress", assigned: "2023-10-13", due: "2023-10-14" },
    ],
    availability: "On call",
    completedTasks: 22,
    activeTasks: 2
  }
];

export const MaintenanceTeamsDashboard = () => {
  const [selectedTeam, setSelectedTeam] = useState<string>("team-a");
  const [viewMode, setViewMode] = useState<"teams" | "assignments">("teams");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeamDetails, setSelectedTeamDetails] = useState<any>(null);
  
  const currentTeam = maintenanceTeams.find(team => team.id === selectedTeam);
  
  // Filter assignments based on search query
  const filteredAssignments = viewMode === "assignments" 
    ? maintenanceTeams.flatMap(team => team.assignments).filter(assignment => 
        assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assignment.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assignment.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : currentTeam?.assignments.filter(assignment => 
        assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assignment.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assignment.id.toLowerCase().includes(searchQuery.toLowerCase())
      ) || [];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Maintenance Teams Management</h2>
        <div className="flex items-center gap-2">
          <Tabs value={viewMode} onValueChange={(value: "teams" | "assignments") => setViewMode(value)}>
            <TabsList>
              <TabsTrigger value="teams">Teams View</TabsTrigger>
              <TabsTrigger value="assignments">Assignments View</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {viewMode === "teams" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {maintenanceTeams.map(team => (
            <Card 
              key={team.id}
              className={`cursor-pointer transition-all hover:border-primary ${
                selectedTeam === team.id ? 'border-primary ring-1 ring-primary' : ''
              }`}
              onClick={() => setSelectedTeam(team.id)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <Truck className="h-5 w-5 mr-2" />
                    {team.name}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    team.availability === 'Available' ? 'bg-green-100 text-green-800' :
                    team.availability === 'On call' ? 'bg-blue-100 text-blue-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {team.availability}
                  </span>
                </CardTitle>
                <CardDescription className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {team.members.length} members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Active Tasks</p>
                    <p className="text-lg font-bold">{team.activeTasks}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Completed</p>
                    <p className="text-lg font-bold">{team.completedTasks}</p>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTeamDetails(team);
                        }}
                      >
                        <UserCog className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center">
                          <Truck className="h-5 w-5 mr-2" />
                          {selectedTeamDetails?.name}
                        </DialogTitle>
                        <DialogDescription>
                          {selectedTeamDetails?.members.length} members · {selectedTeamDetails?.availability}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                        <div className="md:col-span-2">
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg flex items-center">
                                <Users className="h-5 w-5 mr-2" />
                                Team Members
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ScrollArea className="h-[300px]">
                                <div className="space-y-4">
                                  {selectedTeamDetails?.members.map((member: any) => (
                                    <div key={member.id} className="flex items-center justify-between border-b pb-3">
                                      <div>
                                        <h4 className="font-medium">{member.name}</h4>
                                        <p className="text-sm text-muted-foreground">{member.role}</p>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <p className="text-sm">{member.phone}</p>
                                        <Button variant="ghost" size="sm">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </ScrollArea>
                            </CardContent>
                          </Card>
                        </div>
                        
                        <div>
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg flex items-center">
                                <CheckCircle2 className="h-5 w-5 mr-2" />
                                Performance
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div className="border rounded-md p-4">
                                  <p className="text-sm text-muted-foreground">Active Tasks</p>
                                  <p className="text-2xl font-bold">{selectedTeamDetails?.activeTasks}</p>
                                </div>
                                <div className="border rounded-md p-4">
                                  <p className="text-sm text-muted-foreground">Completed Tasks</p>
                                  <p className="text-2xl font-bold">{selectedTeamDetails?.completedTasks}</p>
                                </div>
                                <div className="border rounded-md p-4">
                                  <p className="text-sm text-muted-foreground">Completion Rate</p>
                                  <p className="text-2xl font-bold">
                                    {selectedTeamDetails ? 
                                      Math.round((selectedTeamDetails.completedTasks / (selectedTeamDetails.completedTasks + selectedTeamDetails.activeTasks)) * 100) : 0}%
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            {viewMode === "teams" ? 
              currentTeam ? `${currentTeam.name} Assignments` : "Team Assignments" : 
              "All Maintenance Assignments"
            }
          </h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search assignments..."
                className="pl-8 w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-1">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Assignment</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssignments.length > 0 ? (
                  filteredAssignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell className="font-medium">{assignment.id}</TableCell>
                      <TableCell>{assignment.title}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                          {assignment.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          assignment.priority === 'Urgent' ? 'bg-red-100 text-red-800' :
                          assignment.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                          assignment.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {assignment.priority}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          assignment.status === 'Assigned' ? 'bg-blue-100 text-blue-800' :
                          assignment.status === 'In Progress' ? 'bg-amber-100 text-amber-800' :
                          assignment.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {assignment.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                          {assignment.assigned}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                          {assignment.due}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button variant="outline" size="sm">Update</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                      No assignments found. Try adjusting your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
