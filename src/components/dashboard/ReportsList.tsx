import React, { useEffect, useState } from "react";
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
import { Report, reportService } from "@/services/report";
import { ReportForm } from "@/components/dashboard/ReportForm";

interface ReportsListProps {
  searchQuery: string;
  token: string;
  userId: string;
}

export const ReportsList = ({
  searchQuery,
  token,
  userId,
}: ReportsListProps) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [expandedReport, setExpandedReport] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [reportToEdit, setReportToEdit] = useState<Report | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [votingInProgress, setVotingInProgress] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);

      const fetchedReports = await reportService.getReportsByUser(
        userId,
        token
      );
      
      // Ensure we have the latest data including vote counts
      setReports(fetchedReports);
    } catch (error: any) {
      console.error("Error fetching reports:", error);
      setError(error.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && userId) {
      fetchReports();
    }
  }, [token, userId]);

  // Refresh reports periodically to keep vote counts in sync
  useEffect(() => {
    if (!token || !userId) return;

    const intervalId = setInterval(() => {
      fetchReports();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(intervalId);
  }, [token, userId]);

  const handleVote = async (reportId: string, type: "upvote" | "downvote") => {
    try {
      if (votingInProgress[reportId]) {
        return;
      }

      setVotingInProgress(prev => ({ ...prev, [reportId]: true }));

      let updatedReport;
      if (type === "upvote") {
        updatedReport = await reportService.upvoteReport(reportId, token);
      } else {
        updatedReport = await reportService.downvoteReport(reportId, token);
      }

      // Update the specific report and trigger a full refresh
      setReports(prevReports => 
        prevReports.map(report => 
          report.id === reportId ? updatedReport : report
        )
      );
      
      // Fetch all reports again to ensure everything is in sync
      fetchReports();
    } catch (error) {
      console.error("Error voting on report:", error);
    } finally {
      setVotingInProgress(prev => ({ ...prev, [reportId]: false }));
    }
  };

  const handleEdit = (report: Report) => {
    setReportToEdit(report);
    setShowEditForm(true);
  };

  const handleEditSuccess = () => {
    setShowEditForm(false);
    setReportToEdit(null);
    // Refresh the reports list
    if (token && userId) {
      fetchReports();
    }
  };

  const filteredReports = reports
    .filter((report) => {
      if (
        searchQuery &&
        !report.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;
      if (statusFilter !== "all" && report.status !== statusFilter)
        return false;
      if (categoryFilter !== "all" && report.category !== categoryFilter)
        return false;
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
      } else if (sortBy === "most_voted") {
        // Compare total votes (upvotes - downvotes)
        const aTotal = (a.upvotes || 0) - (a.downvotes || 0);
        const bTotal = (b.upvotes || 0) - (b.downvotes || 0);
        return bTotal - aTotal;
      }
      return 0;
    });

  if (loading) {
    return <div>Loading reports...</div>;
  }

  const toggleExpand = (reportId: string) => {
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
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="space-y-6">
      {/* Edit Form Modal */}
      {showEditForm && reportToEdit && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
          <div className="min-h-screen px-4 flex items-center justify-center">
            <div className="relative z-50 w-full max-w-4xl my-8">
              <ReportForm
                mode="edit"
                reportToEdit={reportToEdit}
                onSubmitSuccess={handleEditSuccess}
              />
            </div>
          </div>
        </div>
      )}

      {/* Filters and Sort */}
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
                <SelectContent className="bg-[#1E2A13] dark:bg-gray-700 text-white">
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
                <SelectContent className="bg-[#1E2A13] dark:bg-gray-700 text-white">
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Road Damage">Road Damage</SelectItem>
                  <SelectItem value="Water Shortage">Water Shortage</SelectItem>
                  <SelectItem value="Waste Management">
                    Waste Management
                  </SelectItem>
                  <SelectItem value="Streetlight Failure">
                    Streetlight Failure
                  </SelectItem>
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
              <SelectContent className="bg-[#1E2A13] dark:bg-gray-700 text-white">
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="most_voted">Most Voted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
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
                <TableCell
                  colSpan={5}
                  className="text-white text-center py-6"
                >
                  {searchQuery
                    ? "No reports match your search."
                    : "No reports found."}
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
                          <div className="font-medium flex items-center gap-2">
                            {report.title}
                            {report.isEdited && (
                              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                                Edited
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-white/60">
                            {report.category}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-white">
                      {report.locationName || report.location}
                    </TableCell>
                    <TableCell className="text-white">
                      {formatDate(report.createdAt)}
                    </TableCell>
                    <TableCell className="text-white">
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                          report.status
                        )}`}
                      >
                        {getStatusIcon(report.status)}
                        {getStatusText(report.status)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1 items-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-white/60 hover:text-white hover:bg-[#255F38]/20"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(report);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {Array.isArray(report.imageUrls) &&
                          report.imageUrls.length > 0 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-white/60 hover:text-white hover:bg-[#255F38]/20"
                            >
                              <Image className="h-4 w-4" />
                            </Button>
                          )}
                        
                        <div className="flex items-center gap-1 text-white">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-white/60 hover:text-white hover:bg-[#255F38]/20"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVote(report.id, "upvote");
                            }}
                            disabled={votingInProgress[report.id]}
                          >
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                          <span className="text-sm">{report.upvotes || 0}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-white/60 hover:text-white hover:bg-[#255F38]/20"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVote(report.id, "downvote");
                            }}
                            disabled={votingInProgress[report.id]}
                          >
                            <ThumbsDown className="h-4 w-4" />
                          </Button>
                          <span className="text-sm">{report.downvotes || 0}</span>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                  {expandedReport === report.id && (
                    <TableRow className="bg-[#1E2A13] dark:bg-gray-700/50 border-b border-[#255F38] dark:border-gray-600">
                      <TableCell colSpan={5} className="py-4">
                        <div className="space-y-4 px-4">
                          <p className="text-white text-sm">
                            {report.description}
                          </p>
                          {report.imageUrls && report.imageUrls.length > 0 && (
                            <div className="flex gap-2 overflow-auto pb-2">
                              {report.imageUrls.map((url, index) => (
                                <img
                                  key={index}
                                  src={url}
                                  alt={`Issue ${index}`}
                                  className="rounded border border-[#255F38] h-20 w-24 object-cover"
                                />
                              ))}
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