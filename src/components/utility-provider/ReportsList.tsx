import { useContext, useEffect, useState } from "react";
import { Report } from "@/services/report";
import { AuthContext } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, MapPin } from "lucide-react";
import { MaintenanceTeam, maintenanceTeamService } from "@/services/maintenance-team";
import { reportService } from "@/services/report";
import { utilityProviderService } from "@/services/utility-provider";

export const ReportsList = () => {
  const { token, userId } = useContext(AuthContext);
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState<MaintenanceTeam[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<{ [key: string]: string }>({});
  const [assigningReports, setAssigningReports] = useState<{ [key: string]: boolean }>({});

  const fetchReports = async () => {
    if (!token || !userId) {
      setLoading(false);
      return;
    }

    try {
      const providerReports = await utilityProviderService.getProviderReports(userId, token);
      const activeReports = providerReports.filter(report => 
        report.status === 'PENDING' || report.status === 'IN_PROGRESS'
      );
      setReports(activeReports);

      // Fetch maintenance teams
      const teamsData = await maintenanceTeamService.getMaintenanceTeams(userId, token);
      setTeams(teamsData);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [token, userId, toast]);

  const handleAssignTeam = async (reportId: string) => {
    const selectedTeamId = selectedTeams[reportId];
    if (!selectedTeamId || !token) {
      toast({
        title: "Error",
        description: "Please select a maintenance team",
        variant: "destructive"
      });
      return;
    }

    setAssigningReports(prev => ({ ...prev, [reportId]: true }));
    try {
      await reportService.assignMaintenanceTeam(reportId, selectedTeamId, token);
      toast({
        title: "Success",
        description: "Report assigned to maintenance team successfully",
      });
      fetchReports(); // Refresh the list
    } catch (error: any) {
      console.error('Error assigning team:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to assign maintenance team",
        variant: "destructive"
      });
    } finally {
      setAssigningReports(prev => ({ ...prev, [reportId]: false }));
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

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
        <p className="mt-2 text-gray-400">Loading reports...</p>
      </div>
    );
  }

  if (!token || !userId) {
    return (
      <div className="text-center py-4 text-red-500">
        Please log in to view reports.
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No pending reports found for your service area.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Incoming Reports ({reports.length})</h2>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <Card key={report.id} className="bg-[#1E2A13] border-[#255F38] text-white overflow-hidden">
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold line-clamp-2">{report.title}</h3>
                </div>
                <div className="flex items-center text-xs px-2 py-1 rounded-full whitespace-nowrap bg-yellow-600/20 text-yellow-400">
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

                <div className="space-y-2">
                  <Select 
                    value={selectedTeams[report.id]} 
                    onValueChange={(value) => setSelectedTeams(prev => ({ ...prev, [report.id]: value }))}
                  >
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
                    onClick={() => handleAssignTeam(report.id)}
                    disabled={assigningReports[report.id]}
                  >
                    {assigningReports[report.id] ? "Assigning..." : "Assign Team"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}; 