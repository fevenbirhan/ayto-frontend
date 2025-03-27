
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Eye, 
  FileText, 
  MapPin, 
  Clock, 
  MessageSquare,
  Image,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  User
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AssignmentPanel } from "./AssignmentPanel";

type ReportQueueProps = {
  searchQuery: string;
  filters: {
    priority: string | null;
    status: string | null;
    department: string | null;
    dateRange: { from: Date | null; to: Date | null };
  };
};

// Mock data for demonstration
const mockReports = [
  {
    id: "#1234",
    title: "Broken water pipe",
    description: "Water is leaking onto the street and causing flooding",
    category: "Water & Sewerage",
    location: "Main St & 5th Ave",
    status: "Pending",
    priority: null,
    reportedBy: "Jane Smith",
    reportedAt: "2023-10-15 09:32 AM",
    images: ["https://placehold.co/300x200?text=Water+Leak"],
    comments: [
      { user: "Jane Smith", text: "It's getting worse, please help!", time: "10:15 AM" }
    ]
  },
  {
    id: "#1235",
    title: "Street light outage",
    description: "Three street lights are not working on Center Avenue",
    category: "Power Corporation",
    location: "Center Ave, Block 3",
    status: "Pending",
    priority: null,
    reportedBy: "Mark Johnson",
    reportedAt: "2023-10-15 10:45 AM",
    images: ["https://placehold.co/300x200?text=Street+Light"],
    comments: []
  },
  {
    id: "#1236",
    title: "Pothole on main street",
    description: "Large pothole causing traffic and vehicle damage",
    category: "Road Ministry",
    location: "Main Street near Central Park",
    status: "Pending",
    priority: null,
    reportedBy: "Alex Brown",
    reportedAt: "2023-10-15 11:20 AM",
    images: ["https://placehold.co/300x200?text=Pothole"],
    comments: [
      { user: "Alex Brown", text: "Several cars have been damaged already", time: "12:05 PM" }
    ]
  },
  {
    id: "#1237",
    title: "Network outage",
    description: "Mobile network completely down in the eastern district",
    category: "Ethio Telecom",
    location: "Eastern District, Zones 4-6",
    status: "Pending",
    priority: null,
    reportedBy: "Sarah Chen",
    reportedAt: "2023-10-15 01:15 PM",
    images: [],
    comments: [
      { user: "Sarah Chen", text: "No service for over 3 hours now", time: "2:30 PM" },
      { user: "David Lee", text: "I'm experiencing the same issue", time: "2:45 PM" }
    ]
  },
  {
    id: "#1238",
    title: "Garbage not collected",
    description: "Scheduled garbage collection was missed for the past two weeks",
    category: "Waste Management",
    location: "Riverside Neighborhood, Blocks 10-12",
    status: "Pending",
    priority: null,
    reportedBy: "Maria Garcia",
    reportedAt: "2023-10-15 02:30 PM",
    images: ["https://placehold.co/300x200?text=Garbage"],
    comments: []
  }
];

export const ReportQueue = ({ searchQuery, filters }: ReportQueueProps) => {
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [isAssigning, setIsAssigning] = useState(false);
  
  const filteredReports = mockReports.filter(report => {
    // Apply search query
    if (searchQuery && !report.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !report.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Apply filters (simplified for demo)
    if (filters.priority && report.priority !== filters.priority) {
      return false;
    }
    
    if (filters.status && report.status !== filters.status) {
      return false;
    }
    
    if (filters.department && report.category !== filters.department) {
      return false;
    }
    
    return true;
  });

  const handleAssign = (report: any) => {
    setSelectedReport(report);
    setIsAssigning(true);
  };

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Incoming Report Queue</h2>
            <p className="text-sm text-muted-foreground">Total: {filteredReports.length} reports</p>
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Reported</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.length > 0 ? (
                  filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.id}</TableCell>
                      <TableCell>{report.title}</TableCell>
                      <TableCell>{report.category}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                          {report.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                          {report.reportedAt.split(' ')[0]}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-2 py-1 rounded-full text-xs font-medium">
                          {report.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedReport(report)}
                              >
                                <Eye className="h-3 w-3 mr-1" /> View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>{selectedReport?.title}</DialogTitle>
                                <DialogDescription>
                                  Report ID: {selectedReport?.id} · Submitted on {selectedReport?.reportedAt}
                                </DialogDescription>
                              </DialogHeader>
                              
                              <Tabs defaultValue="details" className="mt-4">
                                <TabsList>
                                  <TabsTrigger value="details">Details</TabsTrigger>
                                  <TabsTrigger value="communication">Communication</TabsTrigger>
                                  <TabsTrigger value="history">History</TabsTrigger>
                                </TabsList>
                                
                                <TabsContent value="details" className="mt-4">
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="md:col-span-2 space-y-4">
                                      <div>
                                        <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                                          <FileText className="h-4 w-4 mr-1" />
                                          Description
                                        </h3>
                                        <p className="mt-1 text-base">{selectedReport?.description}</p>
                                      </div>
                                      
                                      <Separator />
                                      
                                      <div>
                                        <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                                          <MapPin className="h-4 w-4 mr-1" />
                                          Location
                                        </h3>
                                        <p className="mt-1 text-base">{selectedReport?.location}</p>
                                      </div>
                                      
                                      <Separator />
                                      
                                      <div>
                                        <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                                          <Image className="h-4 w-4 mr-1" />
                                          Media Evidence
                                        </h3>
                                        <div className="mt-2 grid grid-cols-2 gap-2">
                                          {selectedReport?.images.map((img: string, idx: number) => (
                                            <img 
                                              key={idx} 
                                              src={img} 
                                              alt={`Evidence ${idx + 1}`} 
                                              className="rounded-md border object-cover h-40 w-full"
                                            />
                                          ))}
                                          {selectedReport?.images.length === 0 && (
                                            <p className="text-muted-foreground">No media attached</p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                      <Card>
                                        <CardContent className="p-4">
                                          <h3 className="font-medium mb-2">Report Information</h3>
                                          <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">Category:</span>
                                              <span className="font-medium">{selectedReport?.category}</span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">Status:</span>
                                              <span className="font-medium">{selectedReport?.status}</span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">Priority:</span>
                                              <span className="font-medium">{selectedReport?.priority || "Not set"}</span>
                                            </div>
                                            <Separator />
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">Reported by:</span>
                                              <div className="flex items-center">
                                                <User className="h-3 w-3 mr-1" />
                                                <span className="font-medium">{selectedReport?.reportedBy}</span>
                                              </div>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">Date:</span>
                                              <span className="font-medium">{selectedReport?.reportedAt}</span>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                      
                                      <div className="flex flex-col gap-2">
                                        <Button 
                                          onClick={() => setIsAssigning(true)}
                                          className="w-full"
                                        >
                                          Assign Report
                                        </Button>
                                        <div className="grid grid-cols-2 gap-2">
                                          <Button variant="outline" className="w-full">
                                            <CheckCircle2 className="h-4 w-4 mr-1" />
                                            Approve
                                          </Button>
                                          <Button variant="outline" className="w-full">
                                            <XCircle className="h-4 w-4 mr-1" />
                                            Reject
                                          </Button>
                                        </div>
                                        <Button variant="outline" className="w-full">
                                          <MessageSquare className="h-4 w-4 mr-1" />
                                          Contact Resident
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </TabsContent>
                                
                                <TabsContent value="communication" className="mt-4">
                                  <div className="border rounded-md p-4">
                                    <h3 className="font-medium mb-3">Resident Communication</h3>
                                    <ScrollArea className="h-60">
                                      <div className="space-y-4">
                                        {selectedReport?.comments.length > 0 ? (
                                          selectedReport?.comments.map((comment: any, idx: number) => (
                                            <div key={idx} className="flex gap-3">
                                              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                                <User className="h-4 w-4" />
                                              </div>
                                              <div className="flex-1">
                                                <div className="flex justify-between">
                                                  <h4 className="font-medium">{comment.user}</h4>
                                                  <span className="text-xs text-muted-foreground">{comment.time}</span>
                                                </div>
                                                <p className="text-sm mt-1">{comment.text}</p>
                                              </div>
                                            </div>
                                          ))
                                        ) : (
                                          <p className="text-muted-foreground text-center py-10">No comments yet</p>
                                        )}
                                      </div>
                                    </ScrollArea>
                                  </div>
                                </TabsContent>
                                
                                <TabsContent value="history" className="mt-4">
                                  <div className="border rounded-md p-4">
                                    <h3 className="font-medium mb-3">Report History</h3>
                                    <div className="relative pl-6 border-l-2 border-muted">
                                      <div className="mb-4 relative">
                                        <div className="absolute -left-[20px] top-0 h-4 w-4 rounded-full bg-blue-500"></div>
                                        <div className="flex justify-between">
                                          <h4 className="font-medium">Report Created</h4>
                                          <span className="text-xs text-muted-foreground">{selectedReport?.reportedAt}</span>
                                        </div>
                                        <p className="text-sm mt-1">Resident {selectedReport?.reportedBy} submitted a new report</p>
                                      </div>
                                      
                                      {selectedReport?.comments.length > 0 && selectedReport?.comments.map((comment: any, idx: number) => (
                                        <div key={idx} className="mb-4 relative">
                                          <div className="absolute -left-[20px] top-0 h-4 w-4 rounded-full bg-green-500"></div>
                                          <div className="flex justify-between">
                                            <h4 className="font-medium">Comment Added</h4>
                                            <span className="text-xs text-muted-foreground">{comment.time}</span>
                                          </div>
                                          <p className="text-sm mt-1">
                                            {comment.user} added a comment: "{comment.text}"
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </TabsContent>
                              </Tabs>
                              
                              <DialogFooter className="mt-6">
                                <Button variant="outline">Close</Button>
                                <Button onClick={() => setIsAssigning(true)}>Assign Report</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => handleAssign(report)}
                          >
                            <ArrowUpRight className="h-3 w-3 mr-1" /> Assign
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      No reports found. Try adjusting your search or filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredReports.length} of {mockReports.length} reports
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isAssigning} onOpenChange={setIsAssigning}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Assign Report: {selectedReport?.title}</DialogTitle>
            <DialogDescription>
              Assign this report to a department or maintenance team
            </DialogDescription>
          </DialogHeader>
          
          <AssignmentPanel 
            report={selectedReport} 
            onAssign={() => setIsAssigning(false)}
            onCancel={() => setIsAssigning(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
