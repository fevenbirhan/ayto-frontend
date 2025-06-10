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
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

// Translation dictionary
const translations = {
  en: {
    incomingQueue: "Incoming Report Queue",
    totalReports: "Total reports",
    id: "ID",
    title: "Title",
    category: "Category",
    location: "Location",
    reported: "Reported",
    status: "Status",
    actions: "Actions",
    view: "View",
    assign: "Assign",
    noReports: "No reports found. Try adjusting your search or filters.",
    showing: "Showing",
    of: "of",
    reports: "reports",
    previous: "Previous",
    next: "Next",
    reportDetails: "Report Details",
    submittedOn: "Submitted on",
    description: "Description",
    mediaEvidence: "Media Evidence",
    noMedia: "No media attached",
    reportInfo: "Report Information",
    priorityNotSet: "Not set",
    assignReport: "Assign Report",
    approve: "Approve",
    reject: "Reject",
    contactResident: "Contact Resident",
    residentCommunication: "Resident Communication",
    noComments: "No comments yet",
    reportHistory: "Report History",
    reportCreated: "Report Created",
    commentAdded: "Comment Added",
    close: "Close",
    assignToTeam: "Assign to Team",
    assignDescription: "Assign this report to a department or maintenance team"
  },
  am: {
    incomingQueue: "የሪፖርት ወረፋ",
    totalReports: "ጠቅላላ ሪፖርቶች",
    id: "መለያ",
    title: "ርዕስ",
    category: "ምድብ",
    location: "አካባቢ",
    reported: "የቀረበው",
    status: "ሁኔታ",
    actions: "ድርጊቶች",
    view: "እይታ",
    assign: "መድረስ",
    noReports: "ምንም ሪፖርት አልተገኘም። �ይ ፍለጋ ወይም ማጣሪያዎችን ይለውጡ።",
    showing: "በማሳየት ላይ",
    of: "ከ",
    reports: "ሪፖርቶች",
    previous: "ቀዳሚ",
    next: "ቀጣይ",
    reportDetails: "የሪፖርት ዝርዝሮች",
    submittedOn: "ቀርቧል በ",
    description: "መግለጫ",
    mediaEvidence: "ሚዲያ ማስረጃ",
    noMedia: "ምንም ሚዲያ አልተያዘም",
    reportInfo: "የሪፖርት መረጃ",
    priorityNotSet: "አልተዘጋጀም",
    assignReport: "ሪፖርት መድረስ",
    approve: "መጽደቅ",
    reject: "መቃወም",
    contactResident: "ከሰው ሰራሽ ጋር ያገናኙ",
    residentCommunication: "ከሰው ሰራሽ ጋር ያለው ግንኙነት",
    noComments: "እስካሁን አስተያየት የለም",
    reportHistory: "የሪፖርት ታሪክ",
    reportCreated: "ሪፖርት ተፈጥሯል",
    commentAdded: "አስተያየት ታክሏል",
    close: "ዝጋ",
    assignToTeam: "ለቡድን መድረስ",
    assignDescription: "ይህን ሪፖርት ለአንድ ክፍል ወይም ለጥገና ቡድን ይላኩ"
  }
};

export const ReportQueue = ({ searchQuery, filters }: ReportQueueProps) => {
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const { theme } = useTheme();
  const { language } = useAuth();
  
  const t = translations[language as keyof typeof translations] || translations.en;
  
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
      <Card className="rounded-xl shadow-sm">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">{t.incomingQueue}</h2>
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted-foreground">
                {t.totalReports}: <span className="font-medium">{filteredReports.length}</span>
              </p>
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader className={theme === "dark" ? "bg-gray-900" : "bg-gray-50"}>
                <TableRow>
                  <TableHead className="font-medium">{t.id}</TableHead>
                  <TableHead className="font-medium">{t.title}</TableHead>
                  <TableHead className="font-medium">{t.category}</TableHead>
                  <TableHead className="font-medium">{t.location}</TableHead>
                  <TableHead className="font-medium">{t.reported}</TableHead>
                  <TableHead className="font-medium">{t.status}</TableHead>
                  <TableHead className="font-medium text-right">{t.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.length > 0 ? (
                  filteredReports.map((report) => (
                    <TableRow key={report.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{report.id}</TableCell>
                      <TableCell className="font-medium">{report.title}</TableCell>
                      <TableCell>{report.category}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{report.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{report.reportedAt.split(' ')[0]}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-blue-200 text-blue-800 dark:border-blue-800 dark:text-blue-200">
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="gap-1"
                                onClick={() => setSelectedReport(report)}
                              >
                                <Eye className="h-4 w-4" /> {t.view}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>{selectedReport?.title}</DialogTitle>
                                <DialogDescription>
                                  {t.reportDetails}: {selectedReport?.id} · {t.submittedOn} {selectedReport?.reportedAt}
                                </DialogDescription>
                              </DialogHeader>
                              
                              <Tabs defaultValue="details" className="mt-4">
                                <TabsList className="grid grid-cols-3 w-full">
                                  <TabsTrigger value="details">{t.reportDetails}</TabsTrigger>
                                  <TabsTrigger value="communication">{t.residentCommunication}</TabsTrigger>
                                  <TabsTrigger value="history">{t.reportHistory}</TabsTrigger>
                                </TabsList>
                                
                                <TabsContent value="details" className="mt-4">
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="md:col-span-2 space-y-6">
                                      <div>
                                        <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                          <FileText className="h-4 w-4" />
                                          {t.description}
                                        </h3>
                                        <p className="mt-2 text-base">{selectedReport?.description}</p>
                                      </div>
                                      
                                      <Separator />
                                      
                                      <div>
                                        <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                          <MapPin className="h-4 w-4" />
                                          {t.location}
                                        </h3>
                                        <p className="mt-2 text-base">{selectedReport?.location}</p>
                                      </div>
                                      
                                      <Separator />
                                      
                                      <div>
                                        <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                          <Image className="h-4 w-4" />
                                          {t.mediaEvidence}
                                        </h3>
                                        <div className="mt-3 grid grid-cols-2 gap-3">
                                          {selectedReport?.images.map((img: string, idx: number) => (
                                            <img 
                                              key={idx} 
                                              src={img} 
                                              alt={`Evidence ${idx + 1}`} 
                                              className="rounded-lg border object-cover h-48 w-full"
                                            />
                                          ))}
                                          {selectedReport?.images.length === 0 && (
                                            <p className="text-muted-foreground">{t.noMedia}</p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-6">
                                      <Card className="border rounded-lg">
                                        <CardContent className="p-5">
                                          <h3 className="font-medium mb-4">{t.reportInfo}</h3>
                                          <div className="space-y-3 text-sm">
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">{t.category}:</span>
                                              <span className="font-medium">{selectedReport?.category}</span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">{t.status}:</span>
                                              <span className="font-medium">{selectedReport?.status}</span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">Priority:</span>
                                              <span className="font-medium">{selectedReport?.priority || t.priorityNotSet}</span>
                                            </div>
                                            <Separator />
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">Reported by:</span>
                                              <div className="flex items-center gap-2">
                                                <Avatar className="h-5 w-5">
                                                  <AvatarFallback>
                                                    {selectedReport?.reportedBy.split(' ').map(n => n[0]).join('')}
                                                  </AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium">{selectedReport?.reportedBy}</span>
                                              </div>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">{t.reported}:</span>
                                              <span className="font-medium">{selectedReport?.reportedAt}</span>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                      
                                      <div className="flex flex-col gap-3">
                                        <Button 
                                          onClick={() => setIsAssigning(true)}
                                          className="w-full"
                                        >
                                          {t.assignReport}
                                        </Button>
                                        <div className="grid grid-cols-2 gap-3">
                                          <Button variant="outline" className="w-full gap-1">
                                            <CheckCircle2 className="h-4 w-4" />
                                            {t.approve}
                                          </Button>
                                          <Button variant="outline" className="w-full gap-1">
                                            <XCircle className="h-4 w-4" />
                                            {t.reject}
                                          </Button>
                                        </div>
                                        <Button variant="outline" className="w-full gap-1">
                                          <MessageSquare className="h-4 w-4" />
                                          {t.contactResident}
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </TabsContent>
                                
                                <TabsContent value="communication" className="mt-4">
                                  <div className="border rounded-lg p-5">
                                    <h3 className="font-medium mb-4">{t.residentCommunication}</h3>
                                    <ScrollArea className="h-60">
                                      <div className="space-y-4">
                                        {selectedReport?.comments.length > 0 ? (
                                          selectedReport?.comments.map((comment: any, idx: number) => (
                                            <div key={idx} className="flex gap-3">
                                              <Avatar className="h-9 w-9">
                                                <AvatarFallback>
                                                  {comment.user.split(' ').map(n => n[0]).join('')}
                                                </AvatarFallback>
                                              </Avatar>
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
                                          <p className="text-muted-foreground text-center py-10">{t.noComments}</p>
                                        )}
                                      </div>
                                    </ScrollArea>
                                  </div>
                                </TabsContent>
                                
                                <TabsContent value="history" className="mt-4">
                                  <div className="border rounded-lg p-5">
                                    <h3 className="font-medium mb-4">{t.reportHistory}</h3>
                                    <div className="relative pl-6 border-l-2 border-muted">
                                      <div className="mb-6 relative">
                                        <div className="absolute -left-[22px] top-0 h-4 w-4 rounded-full bg-blue-500 border-2 border-white dark:border-gray-900"></div>
                                        <div className="flex justify-between">
                                          <h4 className="font-medium">{t.reportCreated}</h4>
                                          <span className="text-xs text-muted-foreground">{selectedReport?.reportedAt}</span>
                                        </div>
                                        <p className="text-sm mt-1">Resident {selectedReport?.reportedBy} submitted a new report</p>
                                      </div>
                                      
                                      {selectedReport?.comments.length > 0 && selectedReport?.comments.map((comment: any, idx: number) => (
                                        <div key={idx} className="mb-6 relative">
                                          <div className="absolute -left-[22px] top-0 h-4 w-4 rounded-full bg-green-500 border-2 border-white dark:border-gray-900"></div>
                                          <div className="flex justify-between">
                                            <h4 className="font-medium">{t.commentAdded}</h4>
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
                                <Button variant="outline">{t.close}</Button>
                                <Button onClick={() => setIsAssigning(true)}>{t.assignReport}</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          
                          <Button 
                            variant="default" 
                            size="sm"
                            className="gap-1"
                            onClick={() => handleAssign(report)}
                          >
                            <ArrowUpRight className="h-4 w-4" /> {t.assign}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                      {t.noReports}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex justify-between items-center mt-6">
            <p className="text-sm text-muted-foreground">
              {t.showing} {filteredReports.length} {t.of} {mockReports.length} {t.reports}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>{t.previous}</Button>
              <Button variant="outline" size="sm">{t.next}</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isAssigning} onOpenChange={setIsAssigning}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t.assignToTeam}: {selectedReport?.title}</DialogTitle>
            <DialogDescription>
              {t.assignDescription}
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