
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Filter,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Image,
  Check,
  Clock,
  X,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ReportsListProps {
  searchQuery: string;
  isPersonal: boolean;
}

// Mock data for demonstration
const mockReports = [
  {
    id: 1,
    title: "Pothole on Main Street",
    category: "Road Damage",
    location: "Main St & 5th Ave",
    date: "2023-05-15",
    status: "pending",
    description: "Large pothole causing traffic hazards near the intersection",
    votes: 24,
    hasComments: true,
    hasImages: true,
    isPersonal: true,
  },
  {
    id: 2,
    title: "Broken Street Light",
    category: "Streetlight Failure",
    location: "42 Park Avenue",
    date: "2023-05-12",
    status: "in_progress",
    description: "Street light has been flickering for several days and now it's completely off",
    votes: 15,
    hasComments: true,
    hasImages: true,
    isPersonal: true,
  },
  {
    id: 3,
    title: "Overflowing Trash Bin",
    category: "Waste Management",
    location: "Central Park West",
    date: "2023-05-14",
    status: "resolved",
    description: "Trash bin is overflowing and creating unsanitary conditions in the park",
    votes: 31,
    hasComments: false,
    hasImages: true,
    isPersonal: true,
  },
  {
    id: 4,
    title: "Water Main Break",
    category: "Water Shortage",
    location: "Elm Street",
    date: "2023-05-10",
    status: "in_progress",
    description: "Water flooding the street and causing damage to nearby properties",
    votes: 45,
    hasComments: true,
    hasImages: false,
    isPersonal: false,
  },
  {
    id: 5,
    title: "Damaged Sidewalk",
    category: "Infrastructure",
    location: "32 Maple Road",
    date: "2023-05-08",
    status: "rejected",
    description: "Sidewalk has multiple cracks and poses a tripping hazard for pedestrians",
    votes: 8,
    hasComments: true,
    hasImages: true,
    isPersonal: false,
  },
];

export const ReportsList = ({ searchQuery, isPersonal }: ReportsListProps) => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [expandedReport, setExpandedReport] = useState<number | null>(null);
  
  // Filter and sort the reports based on current filters
  const filteredReports = mockReports
    .filter(report => {
      // Personal/Community filter
      if (isPersonal && !report.isPersonal) return false;
      
      // Search query filter
      if (searchQuery && !report.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      
      // Status filter
      if (statusFilter !== "all" && report.status !== statusFilter) return false;
      
      // Category filter
      if (categoryFilter !== "all" && report.category !== categoryFilter) return false;
      
      return true;
    })
    .sort((a, b) => {
      // Sort based on current sort selection
      if (sortBy === "newest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === "oldest") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortBy === "most_voted") {
        return b.votes - a.votes;
      }
      return 0;
    });

  const toggleExpand = (reportId: number) => {
    setExpandedReport(expandedReport === reportId ? null : reportId);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-600/20 text-yellow-400";
      case "in_progress":
        return "bg-blue-600/20 text-blue-400";
      case "resolved":
        return "bg-green-600/20 text-green-400";
      case "rejected":
        return "bg-red-600/20 text-red-400";
      default:
        return "bg-gray-600/20 text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "in_progress":
        return <Clock className="h-4 w-4" />;
      case "resolved":
        return <Check className="h-4 w-4" />;
      case "rejected":
        return <X className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "in_progress":
        return "In Progress";
      case "resolved":
        return "Resolved";
      case "rejected":
        return "Rejected";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-[#18230F] dark:bg-gray-800 border-[#255F38] dark:border-gray-700">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-white/60" />
                <span className="text-white text-sm">Filters:</span>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-[#1E2A13] dark:bg-gray-700 text-white border-[#255F38] dark:border-gray-600 h-9 w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-[#1E2A13] dark:bg-gray-700 text-white border-[#255F38] dark:border-gray-600">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="bg-[#1E2A13] dark:bg-gray-700 text-white border-[#255F38] dark:border-gray-600 h-9 w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-[#1E2A13] dark:bg-gray-700 text-white border-[#255F38] dark:border-gray-600">
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Road Damage">Road Damage</SelectItem>
                  <SelectItem value="Water Shortage">Water Shortage</SelectItem>
                  <SelectItem value="Waste Management">Waste Management</SelectItem>
                  <SelectItem value="Streetlight Failure">Streetlight Failure</SelectItem>
                  <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                  <SelectItem value="Public Safety">Public Safety</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-[#1E2A13] dark:bg-gray-700 text-white border-[#255F38] dark:border-gray-600 h-9 w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-[#1E2A13] dark:bg-gray-700 text-white border-[#255F38] dark:border-gray-600">
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="most_voted">Most Voted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      <div className="bg-[#18230F] dark:bg-gray-800 border border-[#255F38] dark:border-gray-700 rounded-md overflow-hidden">
        <Table>
          <TableHeader className="bg-[#1E2A13] dark:bg-gray-700">
            <TableRow className="border-b border-[#255F38] dark:border-gray-600">
              <TableHead className="text-white">Issue</TableHead>
              <TableHead className="text-white">Location</TableHead>
              <TableHead className="text-white">Date</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-white text-center py-6">
                  {searchQuery
                    ? "No reports match your search. Try different keywords."
                    : "No reports found. Click \"New Report\" to submit one."}
                </TableCell>
              </TableRow>
            ) : (
              filteredReports.map((report) => (
                <React.Fragment key={report.id}>
                  <TableRow 
                    className="border-b border-[#255F38] dark:border-gray-600 cursor-pointer hover:bg-[#255F38]/10 dark:hover:bg-gray-700/50"
                    onClick={() => toggleExpand(report.id)}
                  >
                    <TableCell className="text-white">
                      <div className="flex items-center gap-2">
                        {expandedReport === report.id ? (
                          <ChevronUp className="h-4 w-4 text-white/60" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-white/60" />
                        )}
                        <div>
                          <div className="font-medium">{report.title}</div>
                          <div className="text-sm text-white/60">{report.category}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-white">
                      <div>{report.location}</div>
                    </TableCell>
                    <TableCell className="text-white">
                      <div>{formatDate(report.date)}</div>
                    </TableCell>
                    <TableCell className="text-white">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(report.status)}`}>
                        {getStatusIcon(report.status)}
                        {getStatusText(report.status)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {report.hasImages && (
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-white/60 hover:text-white hover:bg-[#255F38]/20">
                            <Image className="h-4 w-4" />
                          </Button>
                        )}
                        {report.hasComments && (
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-white/60 hover:text-white hover:bg-[#255F38]/20">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        )}
                        <div className="flex items-center gap-1 text-white">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-white/60 hover:text-white hover:bg-[#255F38]/20">
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                          <span className="text-sm">{report.votes}</span>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-white/60 hover:text-white hover:bg-[#255F38]/20">
                            <ThumbsDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                  
                  {expandedReport === report.id && (
                    <TableRow className="bg-[#1E2A13] dark:bg-gray-700/50 border-b border-[#255F38] dark:border-gray-600">
                      <TableCell colSpan={5} className="py-4">
                        <div className="space-y-4 px-4">
                          <p className="text-white text-sm">{report.description}</p>
                          
                          {/* Example image preview - in a real app, this would display actual uploaded images */}
                          {report.hasImages && (
                            <div className="flex gap-2 overflow-auto pb-2">
                              <img 
                                src="https://placehold.co/120x90/27391C/FFFFFF/png?text=Issue+Photo" 
                                alt="Issue preview" 
                                className="rounded border border-[#255F38] h-20 w-24 object-cover"
                              />
                              <img 
                                src="https://placehold.co/120x90/27391C/FFFFFF/png?text=Issue+Photo" 
                                alt="Issue preview" 
                                className="rounded border border-[#255F38] h-20 w-24 object-cover"
                              />
                            </div>
                          )}
                          
                          {isPersonal && report.status === "pending" && (
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-[#255F38] dark:border-gray-600 text-white hover:bg-[#255F38]/20 dark:hover:bg-gray-700/50"
                              >
                                <Edit className="h-3.5 w-3.5 mr-1" />
                                Edit
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                              >
                                <Trash2 className="h-3.5 w-3.5 mr-1" />
                                Delete
                              </Button>
                            </div>
                          )}
                          
                          {/* If there's feedback from government */}
                          {report.status !== "pending" && (
                            <div className="mt-3 p-3 border border-[#255F38] dark:border-gray-600 rounded bg-[#255F38]/10 dark:bg-gray-800/50">
                              <h4 className="text-sm font-medium text-white">Government Response:</h4>
                              <p className="text-xs text-white/70 mt-1">
                                {report.status === "rejected" 
                                  ? "Thank you for your report. After assessment, this issue falls under the jurisdiction of the private property owner. Please contact the building management."
                                  : report.status === "resolved"
                                  ? "This issue has been successfully resolved. Our maintenance team has completed the necessary repairs. Thank you for your report."
                                  : "We've received your report and a maintenance team has been scheduled to address this issue within the next 48 hours. Thank you for bringing this to our attention."
                                }
                              </p>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
