import React, { useState } from "react";
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
  Image,
} from "lucide-react";

interface CommunityReportsCardsProps {
  searchQuery: string;
  isPersonal: boolean;
}

const mockReports = [
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

export const CommunityReportsCards = ({ searchQuery, isPersonal }: CommunityReportsCardsProps) => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  const filteredReports = mockReports
    .filter(report => {
      if (isPersonal && !report.isPersonal) return false;
      if (!isPersonal && report.isPersonal) return false;
      if (searchQuery && !report.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (statusFilter !== "all" && report.status !== statusFilter) return false;
      if (categoryFilter !== "all" && report.category !== categoryFilter) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === "oldest") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortBy === "most_voted") {
        return b.votes - a.votes;
      }
      return 0;
    });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-600/20 text-yellow-400";
      case "in_progress": return "bg-blue-600/20 text-blue-400";
      case "resolved": return "bg-green-600/20 text-green-400";
      case "rejected": return "bg-red-600/20 text-red-400";
      default: return "bg-gray-600/20 text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="h-4 w-4" />;
      case "in_progress": return <Clock className="h-4 w-4" />;
      case "resolved": return <Check className="h-4 w-4" />;
      case "rejected": return <X className="h-4 w-4" />;
      default: return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "Pending";
      case "in_progress": return "In Progress";
      case "resolved": return "Resolved";
      case "rejected": return "Rejected";
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="bg-[#1E2A13] text-white border-[#255F38] h-9 w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1E2A13] text-white border-[#255F38]">
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
                <SelectTrigger className="bg-[#1E2A13] text-white border-[#255F38] h-9 w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-[#1E2A13] text-white border-[#255F38]">
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="most_voted">Most Voted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {!isPersonal ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.map((report) => (
            <Card key={report.id} className="bg-[#1E2A13] border-[#255F38] text-white">
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <div className="text-lg font-semibold">{report.title}</div>
                  <div className={`flex items-center text-xs px-2 py-1 rounded-full ${getStatusBadgeClass(report.status)}`}>
                    {getStatusIcon(report.status)}
                    <span className="ml-1">{getStatusText(report.status)}</span>
                  </div>
                </div>
                <div className="text-sm text-white/70">{report.category}</div>
                <div className="text-sm">{report.description}</div>
                <div className="text-sm text-white/70">📍 {report.location}</div>
                <div className="text-sm text-white/50">📅 {formatDate(report.date)}</div>
                <div className="flex gap-4 pt-2">
                  <div className="flex items-center gap-1"><ThumbsUp className="h-4 w-4" /> {report.votes}</div>
                  {report.hasComments && <MessageSquare className="h-4 w-4" />}
                  {report.hasImages && <Image className="h-4 w-4" />}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-white">[Insert Table View for Personal Reports Here]</div>
      )}
    </div>
  );
};