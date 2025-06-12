import React, { useState, useContext } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/context/AuthContext";
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data for maintenance teams
const maintenanceTeams = [
  {
    id: "team-a",
    name: "Maintenance Team A",
    members: [
      { id: "m1", name: "John Smith", role: "Team Lead", phone: "+251 91 234 5678", avatar: "/avatars/01.png" },
      { id: "m2", name: "Sarah Johnson", role: "Technician", phone: "+251 91 876 5432", avatar: "/avatars/02.png" },
      { id: "m3", name: "Michael Brown", role: "Technician", phone: "+251 91 345 6789", avatar: "/avatars/03.png" },
      { id: "m4", name: "Emily Davis", role: "Assistant", phone: "+251 91 987 6543", avatar: "/avatars/04.png" },
      { id: "m5", name: "David Wilson", role: "Apprentice", phone: "+251 91 567 8901", avatar: "/avatars/05.png" },
    ],
    assignments: [
      { id: "#1234", title: "Broken water pipe", location: "Main St & 5th Ave", priority: "High", status: "In Progress", assigned: "2023-10-13", due: "2023-10-15" },
      { id: "#1245", title: "Blocked drainage", location: "Market Square", priority: "Medium", status: "Assigned", assigned: "2023-10-15", due: "2023-10-17" },
    ],
    availability: "Available", 
    completedTasks: 15,
    activeTasks: 2
  },
  // ... rest of the mock data remains the same
];

// Translations
const translations = {
  en: {
    title: "Maintenance Teams Management",
    teamsView: "Teams View",
    assignmentsView: "Assignments View",
    members: "members",
    activeTasks: "Active Tasks",
    completed: "Completed",
    details: "Details",
    teamMembers: "Team Members",
    performance: "Performance",
    completionRate: "Completion Rate",
    assignments: "Assignments",
    allAssignments: "All Maintenance Assignments",
    searchPlaceholder: "Search assignments...",
    filter: "Filter",
    id: "ID",
    assignment: "Assignment",
    location: "Location",
    priority: "Priority",
    status: "Status",
    assignedDate: "Assigned Date",
    dueDate: "Due Date",
    actions: "Actions",
    noAssignments: "No assignments found. Try adjusting your search.",
    view: "View",
    update: "Update",
    urgent: "Urgent",
    high: "High",
    medium: "Medium",
    low: "Low",
    inProgress: "In Progress",
    assigned: "Assigned",
    completedStatus: "Completed"
  },
  am: {
    title: "የጥገና ቡድኖች አስተዳደር",
    teamsView: "የቡድኖች �ናቸው",
    assignmentsView: "የተግባሮች እይታ",
    members: "አባላት",
    activeTasks: "ንቁ ተግባራት",
    completed: "የተጠናቀቀ",
    details: "ዝርዝሮች",
    teamMembers: "የቡድን አባላት",
    performance: "አፈፃፀም",
    completionRate: "የጨረሰ መጠን",
    assignments: "ተግባራት",
    allAssignments: "ሁሉም የጥገና ተግባራት",
    searchPlaceholder: "ተግባራትን ፈልግ...",
    filter: "አጣራ",
    id: "መለያ",
    assignment: "ተግባር",
    location: "ቦታ",
    priority: "ቅድሚያ",
    status: "ሁኔታ",
    assignedDate: "የተመደበበት ቀን",
    dueDate: "የመጨረሻ ቀን",
    actions: "ድርጊቶች",
    noAssignments: "ምንም ተግባር አልተገኘም። ፍለጋዎን ይስተካከሉ።",
    view: "እይታ",
    update: "አዘምን",
    urgent: "አስቸኳይ",
    high: "ከፍተኛ",
    medium: "መካከለኛ",
    low: "ዝቅተኛ",
    inProgress: "በሂደት ላይ",
    assigned: "ተመድቧል",
    completedStatus: "ተጠናቅቋል"
  }
};

export const MaintenanceTeamsDashboard = () => {
  const { theme } = useTheme();
  const { language } = useAuth();
  const t = translations[language];
  
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

  const getPriorityTranslation = (priority: string) => {
    switch (priority) {
      case 'Urgent': return t.urgent;
      case 'High': return t.high;
      case 'Medium': return t.medium;
      case 'Low': return t.low;
      default: return priority;
    }
  };

  const getStatusTranslation = (status: string) => {
    switch (status) {
      case 'In Progress': return t.inProgress;
      case 'Assigned': return t.assigned;
      case 'Completed': return t.completedStatus;
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{t.title}</h2>
        <div className="flex items-center gap-2">
          <Tabs value={viewMode} onValueChange={(value: "teams" | "assignments") => setViewMode(value)}>
            <TabsList className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <TabsTrigger value="teams">{t.teamsView}</TabsTrigger>
              <TabsTrigger value="assignments">{t.assignmentsView}</TabsTrigger>
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
              } ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
              onClick={() => setSelectedTeam(team.id)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <Truck className="h-5 w-5 mr-2" />
                    {team.name}
                  </div>
                  <Badge 
                    variant={
                      team.availability === 'Available' ? 'success' :
                      team.availability === 'On call' ? 'info' :
                      'warning'
                    }
                  >
                    {team.availability}
                  </Badge>
                </CardTitle>
                <CardDescription className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {team.members.length} {t.members}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">{t.activeTasks}</p>
                    <p className="text-lg font-bold">{team.activeTasks}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">{t.completed}</p>
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
                        {t.details}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className={`max-w-3xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                      <DialogHeader>
                        <DialogTitle className="flex items-center">
                          <Truck className="h-5 w-5 mr-2" />
                          {selectedTeamDetails?.name}
                        </DialogTitle>
                        <DialogDescription>
                          {selectedTeamDetails?.members.length} {t.members} · {selectedTeamDetails?.availability}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                        <div className="md:col-span-2">
                          <Card className={theme === 'dark' ? 'bg-gray-700' : ''}>
                            <CardHeader>
                              <CardTitle className="text-lg flex items-center">
                                <Users className="h-5 w-5 mr-2" />
                                {t.teamMembers}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ScrollArea className="h-[300px]">
                                <div className="space-y-4">
                                  {selectedTeamDetails?.members.map((member: any) => (
                                    <div key={member.id} className="flex items-center justify-between border-b pb-3">
                                      <div className="flex items-center gap-3">
                                        <Avatar>
                                          <AvatarImage src={member.avatar} />
                                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <h4 className="font-medium">{member.name}</h4>
                                          <p className="text-sm text-muted-foreground">{member.role}</p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <p className="text-sm hidden md:block">{member.phone}</p>
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
                          <Card className={theme === 'dark' ? 'bg-gray-700' : ''}>
                            <CardHeader>
                              <CardTitle className="text-lg flex items-center">
                                <CheckCircle2 className="h-5 w-5 mr-2" />
                                {t.performance}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div className={`border rounded-md p-4 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-50'}`}>
                                  <p className="text-sm text-muted-foreground">{t.activeTasks}</p>
                                  <p className="text-2xl font-bold">{selectedTeamDetails?.activeTasks}</p>
                                </div>
                                <div className={`border rounded-md p-4 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-50'}`}>
                                  <p className="text-sm text-muted-foreground">{t.completed}</p>
                                  <p className="text-2xl font-bold">{selectedTeamDetails?.completedTasks}</p>
                                </div>
                                <div className={`border rounded-md p-4 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-50'}`}>
                                  <p className="text-sm text-muted-foreground">{t.completionRate}</p>
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
              currentTeam ? `${currentTeam.name} ${t.assignments}` : `${t.assignments}` : 
              t.allAssignments
            }
          </h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t.searchPlaceholder}
                className="pl-8 w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-1">
              <Filter className="h-4 w-4" />
              {t.filter}
            </Button>
          </div>
        </div>
        
        <Card className={theme === 'dark' ? 'bg-gray-800' : ''}>
          <CardContent className="p-0">
            <Table>
              <TableHeader className={theme === 'dark' ? 'bg-gray-700' : ''}>
                <TableRow>
                  <TableHead>{t.id}</TableHead>
                  <TableHead>{t.assignment}</TableHead>
                  <TableHead>{t.location}</TableHead>
                  <TableHead>{t.priority}</TableHead>
                  <TableHead>{t.status}</TableHead>
                  <TableHead>{t.assignedDate}</TableHead>
                  <TableHead>{t.dueDate}</TableHead>
                  <TableHead>{t.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssignments.length > 0 ? (
                  filteredAssignments.map((assignment) => (
                    <TableRow key={assignment.id} className={theme === 'dark' ? 'hover:bg-gray-700' : ''}>
                      <TableCell className="font-medium">{assignment.id}</TableCell>
                      <TableCell>{assignment.title}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                          {assignment.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            assignment.priority === 'Urgent' ? 'destructive' :
                            assignment.priority === 'High' ? 'warning' :
                            assignment.priority === 'Medium' ? 'secondary' :
                            'default'
                          }
                        >
                          {getPriorityTranslation(assignment.priority)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            assignment.status === 'Assigned' ? 'secondary' :
                            assignment.status === 'In Progress' ? 'warning' :
                            assignment.status === 'Completed' ? 'success' :
                            'default'
                          }
                        >
                          {getStatusTranslation(assignment.status)}
                        </Badge>
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
                          <Button variant="outline" size="sm">{t.view}</Button>
                          <Button variant="outline" size="sm">{t.update}</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                      {t.noAssignments}
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