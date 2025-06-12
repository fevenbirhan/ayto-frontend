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
        <Card className="bg-[#18230F] border-[#255F38]">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="flex flex-wrap gap-3 items-center">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-white/60" />
                  <span className="text-white text-sm">Filters:</span>
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-[#1E2A13] text-white border-[#255F38] h-9 w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1E2A13] text-white border-[#255F38]">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="RESOLVED">Resolved</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="bg-[#1E2A13] text-white border-[#255F38] h-9 w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1E2A13] text-white border-[#255F38]">
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Power Authority">Power Authority</SelectItem>
                    <SelectItem value="Water and Sewerage">Water and Sewerage</SelectItem>
                    <SelectItem value="Ethio-Tele">Ethio-Tele</SelectItem>
                    <SelectItem value="Road Transportation">Road Transportation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-[#1E2A13] text-white border-[#255F38] h-9 w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-[#1E2A13] text-white border-[#255F38]">
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          <p className="text-white mt-4">Loading reports...</p>
        </div>
      ) : error ? (
        <div className="text-red-400 text-center py-8">{error}</div>
      ) : filteredReports.length === 0 ? (
        <div className="text-white text-center py-8">No reports found.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 max-w-[1200px] mx-auto">
          {filteredReports.map((report) => (
            <Card
              key={report.id}
              className="bg-[#1E2A13] border-[#255F38] text-white overflow-hidden hover:border-[#3B7F59] transition-colors"
            >
              <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{report.title}</h3>
                      {report.isEdited && (
                        <span className="inline-block text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                          Edited
                        </span>
                      )}
                    </div>
                    <div
                      className={`flex items-center text-sm px-3 py-1.5 rounded-full whitespace-nowrap ${getStatusBadgeClass(
                        report.status
                      )}`}
                    >
                      {getStatusIcon(report.status)}
                      <span className="ml-1.5">{getStatusText(report.status)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 bg-[#2A3B1C] rounded-md text-sm">{report.category}</span>
                  </div>

                  <p className="text-base text-white/90">{report.description}</p>

                  {report.imageUrls && report.imageUrls.length > 0 && (
                    <div className="flex gap-3 overflow-x-auto py-2">
                      {report.imageUrls.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`Report image ${index + 1}`}
                          className="h-32 w-32 object-cover rounded-lg flex-shrink-0 border border-[#255F38]/30"
                        />
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <div className="flex items-center gap-4 text-sm text-white/70">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        {report.locationName || formatLocation(report.location)}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        {formatDate(report.createdAt)}
                        {report.isEdited && (
                          <span className="text-xs text-white/30">
                            (Updated: {formatDate(report.updatedAt)})
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-8 w-8 ${
                            votingInProgress[report.id]
                              ? "opacity-50 cursor-not-allowed"
                              : "text-white/60 hover:text-white hover:bg-[#255F38]/20"
                          }`}
                          onClick={(e) => handleVote(report.id, "upvote", e)}
                          disabled={votingInProgress[report.id]}
                        >
                          <ThumbsUp className="h-4 w-4" />
                        </Button>
                        <span className="text-sm">{report.upvotes || 0}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-8 w-8 ${
                            votingInProgress[report.id]
                              ? "opacity-50 cursor-not-allowed"
                              : "text-white/60 hover:text-white hover:bg-[#255F38]/20"
                          }`}
                          onClick={(e) => handleVote(report.id, "downvote", e)}
                          disabled={votingInProgress[report.id]}
                        >
                          <ThumbsDown className="h-4 w-4" />
                        </Button>
                        <span className="text-sm">{report.downvotes || 0}</span>
                      </div>
                      {report.residentName && (
                        <div className="text-sm text-white/70">{report.residentName}</div>
                      )}
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