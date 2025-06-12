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
  ThumbsUp,
  ThumbsDown,
  MapPin,
  Image
} from "lucide-react";
import { Report } from "@/services/report";
import { reportService } from "@/services/report";
import { AuthContext } from "@/context/AuthContext";
import { useTheme } from "@/components/ThemeProvider";
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
  const { theme } = useTheme();
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [votingInProgress, setVotingInProgress] = useState<{ [key: string]: boolean }>({});

  // Get language from AuthContext
  const { language } = useContext(AuthContext);
  const isAmharic = language === 'am';

  // Translations
  const translations = {
    filters: isAmharic ? "ማጣሪያዎች" : "Filters",
    status: isAmharic ? "ሁኔታ" : "Status",
    allStatus: isAmharic ? "ሁሉም ሁኔታ" : "All Status",
    pending: isAmharic ? "በመጠባበቅ ላይ" : "Pending",
    inProgress: isAmharic ? "በሂደት ላይ" : "In Progress",
    resolved: isAmharic ? "ተፈቷል" : "Resolved",
    rejected: isAmharic ? "ተቀባይነት አላገኘም" : "Rejected",
    category: isAmharic ? "ምድብ" : "Category",
    allCategories: isAmharic ? "ሁሉም ምድቦች" : "All Categories",
    sortBy: isAmharic ? "በማዘጋጀት" : "Sort by",
    newest: isAmharic ? "አዲስ መጀመሪያ" : "Newest First",
    oldest: isAmharic ? "የቆየ መጀመሪያ" : "Oldest First",
    loading: isAmharic ? "ሪፖርቶች በመጫን ላይ..." : "Loading reports...",
    noReports: isAmharic ? "ምንም �ገፍ አልተገኘም።" : "No reports found.",
    loginToView: isAmharic ? "ሪፖርቶችን ለማየት እባክዎ ይግቡ" : "Please log in to view reports",
    loginToVote: isAmharic ? "ሪፖርት ለመስጠት እባክዎ ይግቡ" : "Please log in to vote on reports",
    edited: isAmharic ? "ተስተካክሏል" : "Edited",
    updated: isAmharic ? "የተሻሻለ" : "Updated",
    power: isAmharic ? "ኃይል ባለሥልጣን" : "Power Authority",
    water: isAmharic ? "ውሃ እና የመጠጥ ውሃ" : "Water and Sewerage",
    telecom: isAmharic ? "ኢትዮ ቴሌኮም" : "Ethio-Tele",
    road: isAmharic ? "የመንገድ ትራንስፖርት" : "Road Transportation",
  };

  useEffect(() => {
    const fetchReports = async () => {
      if (!token) {
        setError(translations.loginToView);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data = await reportService.getAllReports(token);
        setReports(data);
      } catch (error: any) {
        console.error("Error fetching reports:", error);
        const errorMessage = error.message || 
          (isAmharic ? "ሪፖርቶችን ማምጣት አልተቻለም። እባክዎ ቆጣቢ ይሁኑ እና እንደገና ይሞክሩ።" 
           : "Failed to load reports. Please try again later.");
        setError(errorMessage);
        
        toast({
          title: isAmharic ? "ስህተት" : "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [token, toast, isAmharic]);

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
        if (a.isEdited && b.isEdited) {
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        }
        if (a.isEdited) return -1;
        if (b.isEdited) return 1;
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
    const baseClasses = "flex items-center text-xs px-2 py-1 rounded-full whitespace-nowrap";
    
    if (theme === 'dark') {
      switch (status) {
        case "PENDING":
          return `${baseClasses} bg-yellow-900/30 text-yellow-400`;
        case "IN_PROGRESS":
          return `${baseClasses} bg-blue-900/30 text-blue-400`;
        case "RESOLVED":
          return `${baseClasses} bg-green-900/30 text-green-400`;
        case "REJECTED":
          return `${baseClasses} bg-red-900/30 text-red-400`;
        default:
          return `${baseClasses} bg-gray-900/30 text-gray-400`;
      }
    } else {
      switch (status) {
        case "PENDING":
          return `${baseClasses} bg-yellow-100 text-yellow-800`;
        case "IN_PROGRESS":
          return `${baseClasses} bg-blue-100 text-blue-800`;
        case "RESOLVED":
          return `${baseClasses} bg-green-100 text-green-800`;
        case "REJECTED":
          return `${baseClasses} bg-red-100 text-red-800`;
        default:
          return `${baseClasses} bg-gray-100 text-gray-800`;
      }
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return translations.pending;
      case "IN_PROGRESS":
        return translations.inProgress;
      case "RESOLVED":
        return translations.resolved;
      case "REJECTED":
        return translations.rejected;
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
    return new Date(dateString).toLocaleDateString(isAmharic ? 'am-ET' : undefined, options);
  };

  const handleVote = async (reportId: string, type: "upvote" | "downvote", e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!token) {
      toast({
        title: isAmharic ? "ስህተት" : "Error",
        description: translations.loginToVote,
        variant: "destructive",
      });
      return;
    }

    if (votingInProgress[reportId]) return;

    try {
      setVotingInProgress(prev => ({ ...prev, [reportId]: true }));

      let updatedReport;
      if (type === "upvote") {
        updatedReport = await reportService.upvoteReport(reportId, token);
      } else {
        updatedReport = await reportService.downvoteReport(reportId, token);
      }

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

  // Theme-based classes
  const cardClass = theme === 'dark' 
    ? "bg-[#1E2A13] border-[#255F38] text-white"
    : "bg-white border-gray-200 text-gray-800 shadow-sm hover:shadow-md transition-shadow";

  const filterCardClass = theme === 'dark'
    ? "bg-[#18230F] border-[#255F38]"
    : "bg-gray-50 border-gray-200";

  const selectTriggerClass = theme === 'dark'
    ? "bg-[#1E2A13] text-white border-[#255F38] hover:bg-[#255F38]/20"
    : "bg-white text-gray-800 border-gray-200 hover:bg-gray-50";

  const selectContentClass = theme === 'dark'
    ? "bg-[#1E2A13] text-white border-[#255F38]"
    : "bg-white text-gray-800 border-gray-200";

  const categoryBadgeClass = theme === 'dark'
    ? "bg-[#2A3B1C] text-white/90"
    : "bg-gray-100 text-gray-700";

  const dateTextClass = theme === 'dark'
    ? "text-white/50"
    : "text-gray-500";

  const voteButtonClass = theme === 'dark'
    ? "text-white/60 hover:text-white hover:bg-[#255F38]/20"
    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100";

  return (
    <div className="space-y-6">
      {!isPersonal && (
        <Card className={`${filterCardClass} transition-colors`}>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="flex flex-wrap gap-3 items-center">
                <div className="flex items-center gap-2">
                  <Filter className={`h-4 w-4 ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`} />
                  <span className={theme === 'dark' ? 'text-white' : 'text-gray-800'}>{translations.filters}:</span>
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className={`${selectTriggerClass} h-9 w-32`}>
                    <SelectValue placeholder={translations.status} />
                  </SelectTrigger>
                  <SelectContent className={selectContentClass}>
                    <SelectItem value="all">{translations.allStatus}</SelectItem>
                    <SelectItem value="PENDING">{translations.pending}</SelectItem>
                    <SelectItem value="IN_PROGRESS">{translations.inProgress}</SelectItem>
                    <SelectItem value="RESOLVED">{translations.resolved}</SelectItem>
                    <SelectItem value="REJECTED">{translations.rejected}</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className={`${selectTriggerClass} h-9 w-40`}>
                    <SelectValue placeholder={translations.category} />
                  </SelectTrigger>
                  <SelectContent className={selectContentClass}>
                    <SelectItem value="all">{translations.allCategories}</SelectItem>
                    <SelectItem value="Power Authority">{translations.power}</SelectItem>
                    <SelectItem value="Water and Sewerage">{translations.water}</SelectItem>
                    <SelectItem value="Ethio-Tele">{translations.telecom}</SelectItem>
                    <SelectItem value="Road Transportation">{translations.road}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className={`${selectTriggerClass} h-9 w-40`}>
                  <SelectValue placeholder={translations.sortBy} />
                </SelectTrigger>
                <SelectContent className={selectContentClass}>
                  <SelectItem value="newest">{translations.newest}</SelectItem>
                  <SelectItem value="oldest">{translations.oldest}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${theme === 'dark' ? 'border-white' : 'border-gray-800'} mx-auto`}></div>
          <p className={theme === 'dark' ? 'text-white mt-4' : 'text-gray-800 mt-4'}>{translations.loading}</p>
        </div>
      ) : error ? (
        <div className={`text-center py-8 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{error}</div>
      ) : filteredReports.length === 0 ? (
        <div className={`text-center py-8 ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>{translations.noReports}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.map((report) => (
            <Card
              key={report.id}
              className={`${cardClass} overflow-hidden transition-all hover:scale-[1.01]`}
            >
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold line-clamp-2">{report.title}</h3>
                    {report.isEdited && (
                      <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${theme === 'dark' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-800'}`}>
                        {translations.edited}
                      </span>
                    )}
                  </div>
                  <div className={getStatusBadgeClass(report.status)}>
                    {getStatusText(report.status)}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <span className={`px-2 py-1 rounded-md ${categoryBadgeClass}`}>
                    {report.category}
                  </span>
                </div>

                <p className={`text-sm line-clamp-3 ${theme === 'dark' ? 'text-white/80' : 'text-gray-700'}`}>
                  {report.description}
                </p>

                {report.imageUrls && report.imageUrls.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto py-2">
                    {report.imageUrls.map((url, index) => (
                      <div key={index} className="h-20 w-20 flex-shrink-0 relative rounded-md overflow-hidden">
                        <img
                          src={url}
                          alt={`Report image ${index + 1}`}                      
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className={`text-sm ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {report.locationName || report.location}
                  </div>
                </div>

                <div className={`flex justify-between items-center text-sm pt-2 border-t ${theme === 'dark' ? 'border-white/10 text-white/50' : 'border-gray-200 text-gray-500'}`}>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formatDate(report.createdAt)}
                    {report.isEdited && (
                      <span className={`text-xs ${theme === 'dark' ? 'text-white/30' : 'text-gray-400'}`}>
                        ({translations.updated}: {formatDate(report.updatedAt)})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 ${votingInProgress[report.id] ? "opacity-50 cursor-not-allowed" : voteButtonClass}`}
                        onClick={(e) => handleVote(report.id, "upvote", e)}
                        disabled={votingInProgress[report.id]}
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <span className="text-sm">{report.upvotes || 0}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 ${votingInProgress[report.id] ? "opacity-50 cursor-not-allowed" : voteButtonClass}`}
                        onClick={(e) => handleVote(report.id, "downvote", e)}
                        disabled={votingInProgress[report.id]}
                      >
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                      <span className="text-sm">{report.downvotes || 0}</span>
                    </div>
                    <div className={`text-sm ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>
                      {report.residentName}
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