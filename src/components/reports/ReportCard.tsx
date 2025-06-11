import { useState, useContext } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, MapPin } from "lucide-react";
import { Report } from "@/services/report";
import { MaintenanceTeam, maintenanceTeamService } from "@/services/maintenance-team";
import { reportService } from "@/services/report";
import { AuthContext } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface ReportCardProps {
  report: Report;
}

export const ReportCard = ({ report }: ReportCardProps) => {
  const { token, userId } = useContext(AuthContext);
  const { toast } = useToast();
  const [teams, setTeams] = useState<MaintenanceTeam[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [isAssigning, setIsAssigning] = useState(false);
  const [showTeamSelect, setShowTeamSelect] = useState(false);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-600/20 text-yellow-400";
      case "IN_PROGRESS":
        return "bg-blue-600/20 text-blue-400";
      default:
        return "bg-gray-600/20 text-gray-400";
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

  const handleShowTeamSelect = async () => {
    if (!token || !userId) return;

    try {
      const teamsData = await maintenanceTeamService.getMaintenanceTeams(userId, token);
      setTeams(teamsData);
      setShowTeamSelect(true);
    } catch (error) {
      console.error('Error fetching maintenance teams:', error);
      toast({
        title: "Error",
        description: "Failed to load maintenance teams",
        variant: "destructive"
      });
    }
  };

  const handleAssignTeam = async () => {
    if (!selectedTeamId || !token) {
      toast({
        title: "Error",
        description: "Please select a maintenance team",
        variant: "destructive"
      });
      return;
    }

    setIsAssigning(true);
    try {
      await reportService.assignMaintenanceTeam(report.id, selectedTeamId, token);
      toast({
        title: "Success",
        description: "Report assigned to maintenance team successfully",
      });
      setShowTeamSelect(false);
      setSelectedTeamId("");
    } catch (error: any) {
      console.error('Error assigning team:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to assign maintenance team",
        variant: "destructive"
      });
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <Card className="bg-[#1E2A13] border-[#255F38] text-white overflow-hidden">
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1">
            <h3 className="text-lg font-semibold line-clamp-2">{report.title}</h3>
          </div>
          <div
            className={`flex items-center text-xs px-2 py-1 rounded-full whitespace-nowrap ${getStatusBadgeClass(
              report.status
            )}`}
          >
            <Clock className="h-4 w-4 mr-1" />
            <span>{report.status}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-white/70">
          <span className="px-2 py-1 bg-[#2A3B1C] rounded-md">{report.category}</span>
        </div>

        <p className="text-sm line-clamp-3">{report.description}</p>

        <div className="text-sm text-white/70">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {report.locationName || formatLocation(report.location)}
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
          <div className="text-sm text-white/50">
            <Clock className="h-4 w-4 inline mr-1" />
            {formatDate(report.createdAt)}
          </div>
          
          {report.status === "PENDING" && (
            <div className="space-y-2">
              {!showTeamSelect ? (
                <Button
                  className="w-full bg-[#255F38] hover:bg-[#255F38]/80"
                  onClick={handleShowTeamSelect}
                >
                  Assign Team
                </Button>
              ) : (
                <>
                  <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
                    <SelectTrigger className="bg-[#2A3B1C] border-[#255F38]">
                      <SelectValue placeholder="Select a maintenance team" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2A3B1C] border-[#255F38]">
                      {teams.map((team) => (
                        <SelectItem
                          key={team.maintenanceTeamId}
                          value={team.maintenanceTeamId}
                          className="text-white hover:bg-[#255F38]/20"
                        >
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    className="w-full bg-[#255F38] hover:bg-[#255F38]/80"
                    onClick={handleAssignTeam}
                    disabled={isAssigning}
                  >
                    {isAssigning ? "Assigning..." : "Confirm Assignment"}
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 