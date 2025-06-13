import React, { useEffect, useState, useContext } from "react";
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
  Clock,
  Check,
  X,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Image as ImageIcon,
  MapPin,
} from "lucide-react";
import { Report } from "@/services/report";
import { reportService } from "@/services/report";
import { AuthContext } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useTheme } from "@/components/ThemeProvider";

interface CommunityReportsCardsProps {
  searchQuery: string;
  isPersonal: boolean;
}

export const CommunityReportsCards = ({
  searchQuery,
  isPersonal,
}: CommunityReportsCardsProps) => {
  const { token } = useContext(AuthContext);
  const { toast } = useToast();
  const { theme } = useTheme();
  const [reports, setReports] = useState<Report[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [votingInProgress, setVotingInProgress] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchReports = async () => {
      if (!token) {
        setError("Please log in to view reports");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Decode token to check roles
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        console.log('Token payload:', tokenPayload); // Debug log

        const data = await reportService.getAllReports(token);
        setReports(data);
      } catch (error: any) {
        console.error("Error fetching reports:", error);
        const errorMessage = error.message || "Failed to load reports. Please try again later.";
        setError(errorMessage);
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });

        // If token is expired, you might want to trigger a logout or token refresh
        if (errorMessage.includes('expired')) {
          // Handle token expiration (e.g., redirect to login)
          console.log('Token has expired, should redirect to login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [token, toast]);

  const filteredReports = reports
    .filter((report) => {
      if (isPersonal && !report.residentName) return false;
      if (searchQuery && !report.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (statusFilter !== "all" && report.status.toUpperCase() !== statusFilter.toUpperCase()) return false;
      if (categoryFilter !== "all" && report.category.toLowerCase() !== categoryFilter.toLowerCase()) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        // If both reports are edited, compare by updatedAt
        if (a.isEdited && b.isEdited) {
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        }
        // If only one report is edited, it should come first
        if (a.isEdited) return -1;
        if (b.isEdited) return 1;
        // If neither is edited, compare by createdAt
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === "oldest") {
        if (a.isEdited && b.isEdited) {
          return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        }
        if (a.isEdited) return 1;
        if (b.isEdited) return -1;
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return 0;
    });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-600/20 text-yellow-400";
      case "IN_PROGRESS":
        return "bg-blue-600/20 text-blue-400";
      case "RESOLVED":
        return "bg-green-600/20 text-green-400";
      case "REJECTED":
        return "bg-red-600/20 text-red-400";
      default:
        return "bg-gray-600/20 text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
      case "IN_PROGRESS":
        return <Clock className="h-4 w-4" />;
      case "RESOLVED":
        return <Check className="h-4 w-4" />;
      case "REJECTED":
        return <X className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Pending";
      case "IN_PROGRESS":
        return "In Progress";
      case "RESOLVED":
        return "Resolved";
      case "REJECTED":
        return "Rejected";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatLocation = (location: string) => {
    const [lat, lng] = location.split(",").map(Number);
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  const handleVote = async (reportId: string, type: "upvote" | "downvote", e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!token) {
      toast({
        title: "Error",
        description: "Please log in to vote on reports",
        variant: "destructive",
      });
      return;
    }

    if (votingInProgress[reportId]) {
      return; // Prevent multiple votes while processing
    }

    try {
      setVotingInProgress(prev => ({ ...prev, [reportId]: true }));

      let updatedReport;
      if (type === "upvote") {
        updatedReport = await reportService.upvoteReport(reportId, token);
      } else {
        updatedReport = await reportService.downvoteReport(reportId, token);
      }

      // Update only the specific report in the state
      setReports(prevReports => 
        prevReports.map(report => 
          report.id === reportId ? updatedReport : report
        )
      );
    } catch (error: any) {
      console.error("Error voting on report:", error);
    } finally {
      setVotingInProgress(prev => ({ ...prev, [reportId]: false }));
    }
  };

  return (
    <div className="space-y-6">
      {!isPersonal && (
        <Card className={theme === 'dark' ? 'bg-[#18230F] border-[#255F38]' : 'bg-white border-gray-200'}>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="flex flex-wrap gap-3 items-center">
                <div className="flex items-center gap-2">
                  <Filter className={`h-4 w-4 ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`} />
                  <span className={theme === 'dark' ? 'text-white' : 'text-gray-700'}>Filters:</span>
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className={`${theme === 'dark' ? 'bg-[#1E2A13] text-white border-[#255F38]' : 'bg-gray-50 text-gray-900 border-gray-200'} h-9 w-32`}>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className={theme === 'dark' ? 'bg-[#1E2A13] text-white border-[#255F38]' : 'bg-white text-gray-900 border-gray-200'}>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="RESOLVED">Resolved</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className={`${theme === 'dark' ? 'bg-[#1E2A13] text-white border-[#255F38]' : 'bg-gray-50 text-gray-900 border-gray-200'} h-9 w-40`}>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className={theme === 'dark' ? 'bg-[#1E2A13] text-white border-[#255F38]' : 'bg-white text-gray-900 border-gray-200'}>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Power Authority">Power Authority</SelectItem>
                    <SelectItem value="Water and Sewerage">Water and Sewerage</SelectItem>
                    <SelectItem value="Ethio-Tele">Ethio-Tele</SelectItem>
                    <SelectItem value="Road Transportation">Road Transportation</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className={`${theme === 'dark' ? 'bg-[#1E2A13] text-white border-[#255F38]' : 'bg-gray-50 text-gray-900 border-gray-200'} h-9 w-40`}>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className={theme === 'dark' ? 'bg-[#1E2A13] text-white border-[#255F38]' : 'bg-white text-gray-900 border-gray-200'}>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className={`text-center py-8 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
          <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${theme === 'dark' ? 'border-white' : 'border-gray-700'} mx-auto`}></div>
          <p className="mt-4">Loading reports...</p>
        </div>
      ) : error ? (
        <div className="text-red-400 text-center py-8">{error}</div>
      ) : filteredReports.length === 0 ? (
        <div className={`text-center py-8 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>No reports found.</div>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <Card
              key={report.id}
              className={theme === 'dark' ? 'bg-[#1E2A13] border-[#255F38]' : 'bg-white border-gray-200'}
            >
              <CardContent className="p-6">
                <div className={`grid ${report.imageUrls && report.imageUrls.length > 0 ? 'grid-cols-1 md:grid-cols-3 gap-6' : 'grid-cols-1'}`}>
                  {report.imageUrls && report.imageUrls.length > 0 && (
                    <div className="md:col-span-1">
                      <div className="relative aspect-video rounded-lg overflow-hidden">
                        <img
                          src={report.imageUrls[0]}
                          alt="Report"
                          className="w-full h-full object-cover"
                        />
                        {report.imageUrls.length > 1 && (
                          <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded-md text-sm">
                            +{report.imageUrls.length - 1} more
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className={`${report.imageUrls && report.imageUrls.length > 0 ? 'md:col-span-2' : ''} space-y-4`}>
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className={`text-xl font-semibold line-clamp-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{report.title}</h3>
                        {report.isEdited && (
                          <span className="inline-block mt-1 text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                            Edited
                          </span>
                        )}
                      </div>
                      <div
                        className={`flex items-center text-xs px-2 py-1 rounded-full whitespace-nowrap ${getStatusBadgeClass(
                          report.status
                        )}`}
                      >
                        {getStatusIcon(report.status)}
                        <span className="ml-1">{getStatusText(report.status)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <span className={`px-2 py-1 rounded-md ${theme === 'dark' ? 'bg-[#2A3B1C] text-white/70' : 'bg-gray-100 text-gray-700'}`}>
                        {report.category}
                      </span>
                    </div>

                    <p className={`text-sm line-clamp-2 ${theme === 'dark' ? 'text-white/90' : 'text-gray-700'}`}>
                      {report.description}
                    </p>

                    <div className={`text-sm ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {report.locationName || formatLocation(report.location)}
                      </div>
                    </div>

                    <div className={`flex justify-between items-center text-sm pt-2 border-t ${theme === 'dark' ? 'border-white/10 text-white/50' : 'border-gray-200 text-gray-500'}`}>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatDate(report.createdAt)}
                        {report.isEdited && (
                          <span className={`text-xs ${theme === 'dark' ? 'text-white/30' : 'text-gray-400'}`}>
                            (Updated: {formatDate(report.updatedAt)})
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-8 w-8 ${
                              votingInProgress[report.id]
                                ? "opacity-50 cursor-not-allowed"
                                : theme === 'dark' 
                                  ? "text-white/60 hover:text-white hover:bg-[#255F38]/20"
                                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                            }`}
                            onClick={(e) => handleVote(report.id, "upvote", e)}
                            disabled={votingInProgress[report.id]}
                          >
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                          <span className={`text-sm ${theme === 'dark' ? 'text-white/70' : 'text-gray-700'}`}>{report.upvotes || 0}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-8 w-8 ${
                              votingInProgress[report.id]
                                ? "opacity-50 cursor-not-allowed"
                                : theme === 'dark' 
                                  ? "text-white/60 hover:text-white hover:bg-[#255F38]/20"
                                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                            }`}
                            onClick={(e) => handleVote(report.id, "downvote", e)}
                            disabled={votingInProgress[report.id]}
                          >
                            <ThumbsDown className="h-4 w-4" />
                          </Button>
                          <span className={`text-sm ${theme === 'dark' ? 'text-white/70' : 'text-gray-700'}`}>{report.downvotes || 0}</span>
                        </div>
                        <div className={`text-sm ${theme === 'dark' ? 'text-white/70' : 'text-gray-700'}`}>{report.residentName}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};