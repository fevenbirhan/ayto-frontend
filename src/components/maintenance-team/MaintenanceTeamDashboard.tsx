import { useState, useEffect, useContext } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { AuthContext } from "@/context/AuthContext";
import { Report, reportService } from "@/services/report";
import { MaintenanceTeam, maintenanceTeamService } from "@/services/maintenance-team";
import { Clock, Check, X, MapPin, LogOut, Bell, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/ThemeProvider";

interface HelpRequestFormData {
  requiredSkills: string;
  workLocation: string;
  requiredCapacity: number;
  additionalNotes: string;
}

const MaintenanceTeamDashboard = () => {
  const { token, userId, userName, logout } = useContext(AuthContext);
  const { theme } = useTheme();
  const { toast } = useToast();
  const [assignedReports, setAssignedReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [teamInfo, setTeamInfo] = useState<MaintenanceTeam | null>(null);
  const [loading, setLoading] = useState(true);
  const [isHelpRequestDialogOpen, setIsHelpRequestDialogOpen] = useState(false);
  const [helpRequestData, setHelpRequestData] = useState<HelpRequestFormData>({
    requiredSkills: "",
    workLocation: "",
    requiredCapacity: 0,
    additionalNotes: ""
  });

  useEffect(() => {
    const fetchTeamInfo = async () => {
      if (!token || !userId) return;

      try {
        const team = await maintenanceTeamService.getMaintenanceTeamById(userId, token);
        setTeamInfo(team);
      } catch (error) {
        console.error('Error fetching team info:', error);
        toast({
          title: "Error",
          description: "Failed to load team information",
          variant: "destructive"
        });
      }
    };

    fetchTeamInfo();
  }, [token, userId]);

  useEffect(() => {
    const fetchAssignedReports = async () => {
      if (!token || !userId) return;

      try {
        setLoading(true);
        const reports = await reportService.getAssignedReports(userId, token);
        setAssignedReports(reports);
      } catch (error) {
        console.error('Error fetching assigned reports:', error);
        toast({
          title: "Error",
          description: "Failed to load assigned reports",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedReports();
  }, [token, userId]);

  const handleStatusUpdate = async (reportId: string, newStatus: string) => {
    if (!token) return;

    setIsUpdatingStatus(true);
    try {
      const updatedReport = await reportService.updateReportStatusByMaintenanceTeam(
        reportId,
        newStatus as 'IN_PROGRESS' | 'HELP_REQUESTED' | 'RESOLVED' | 'REJECTED',
        token
      );

      setAssignedReports(prevReports =>
        prevReports.map(report =>
          report.id === reportId ? updatedReport : report
        )
      );

      toast({
        title: "Success",
        description: "Report status updated successfully",
      });
      setIsStatusDialogOpen(false);
    } catch (error: any) {
      console.error('Error updating report status:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update report status",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleRequestHelp = async (reportId: string) => {
    if (!token || !userId) return;

    try {
      await maintenanceTeamService.requestHelp({
        reportId,
        maintenanceTeamId: userId,
        ...helpRequestData
      }, token);

      toast({
        title: "Success",
        description: "Help request sent successfully",
      });
      setIsHelpRequestDialogOpen(false);
      
      // Refresh the reports list
      const reports = await reportService.getAssignedReports(userId, token);
      setAssignedReports(reports);
    } catch (error: any) {
      console.error('Error requesting help:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to request help",
        variant: "destructive"
      });
    }
  };

  const handleRejectReport = async (reportId: string) => {
    if (!token || !userId) return;

    try {
      await maintenanceTeamService.rejectHelp(reportId, token);
      await maintenanceTeamService.updateReportStatus(reportId, "REJECTED", token);

      toast({
        title: "Success",
        description: "Report rejected successfully",
      });
      
      // Refresh the reports list
      const reports = await reportService.getAssignedReports(userId, token);
      setAssignedReports(reports);
    } catch (error: any) {
      console.error('Error rejecting report:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to reject report",
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-600/20 text-yellow-400";
      case "IN_PROGRESS":
        return "bg-blue-600/20 text-blue-400";
      case "HELP_REQUESTED":
        return "bg-purple-600/20 text-purple-400";
      case "RESOLVED":
        return "bg-green-600/20 text-green-400";
      case "REJECTED":
        return "bg-red-600/20 text-red-400";
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

  return (
    <div className={`flex flex-col min-h-screen ${theme === 'dark' ? 'bg-background' : 'bg-gray-50'}`}>
      <Header />
      <main className="flex-1">
        {/* Sticky Header Section */}
        <div className={`sticky top-0 z-10 ${theme === 'dark' ? 'bg-background' : 'bg-white'} border-b`}>
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {userName}
                </h1>
                {teamInfo && (
                  <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Maintenance Team - {teamInfo.name}
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  className={`relative p-2 ${theme === 'dark' ? 'text-white hover:bg-accent' : 'text-gray-700 hover:bg-gray-100'} rounded-full`}
                >
                  <Bell className="h-5 w-5" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className={`p-2 ${theme === 'dark' ? 'text-white hover:bg-accent' : 'text-gray-700 hover:bg-gray-100'} rounded-full`}
                    >
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className={`w-56 ${theme === 'dark' ? 'bg-card text-card-foreground border-border' : 'bg-white text-gray-900 border-gray-200'}`}>
                    <DropdownMenuItem className={`${theme === 'dark' ? 'hover:bg-accent' : 'hover:bg-gray-100'} cursor-pointer`}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className={theme === 'dark' ? 'bg-border' : 'bg-gray-200'} />
                    <DropdownMenuItem 
                      className={`text-destructive hover:${theme === 'dark' ? 'bg-accent' : 'bg-gray-100'} cursor-pointer`}
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Assigned Reports ({assignedReports.length})
              </h2>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${theme === 'dark' ? 'border-white' : 'border-gray-900'} mx-auto`}></div>
                <p className={`mt-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Loading reports...</p>
              </div>
            ) : assignedReports.length === 0 ? (
              <div className="text-center py-8">
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>No reports assigned to your team.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assignedReports.map((report) => (
                  <Card key={report.id} className={theme === 'dark' ? 'bg-card text-card-foreground border-border' : 'bg-white border-gray-200'}>
                    <CardContent className="p-4 space-y-4">
                      <div className="flex justify-between items-start">
                        <h3 className={`text-lg font-semibold line-clamp-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {report.title}
                        </h3>
                        <Badge className={getStatusBadgeClass(report.status)}>
                          {report.status}
                        </Badge>
                      </div>

                      <div>
                        <span className={`px-2 py-1 rounded-md text-sm ${theme === 'dark' ? 'bg-accent text-accent-foreground' : 'bg-gray-100 text-gray-900'}`}>
                          {report.category}
                        </span>
                      </div>

                      <p className={`text-sm line-clamp-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {report.description}
                      </p>

                      <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {report.locationName || report.location}
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-sm text-gray-500 pt-2 border-t border-gray-200">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatDate(report.createdAt)}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className={`text-gray-500 border-gray-200 hover:bg-gray-100 ${theme === 'dark' ? 'hover:bg-accent' : ''}`}
                          onClick={() => {
                            setSelectedReport(report);
                            setIsStatusDialogOpen(true);
                          }}
                        >
                          Update Status
                        </Button>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button
                          className={`flex-1 bg-purple-600 hover:bg-purple-700 ${theme === 'dark' ? 'bg-accent text-accent-foreground' : ''}`}
                          onClick={() => {
                            setSelectedReport(report);
                            setIsHelpRequestDialogOpen(true);
                          }}
                        >
                          Request Help
                        </Button>
                        <Button
                          className={`flex-1 bg-red-600 hover:bg-red-700 ${theme === 'dark' ? 'bg-accent text-accent-foreground' : ''}`}
                          onClick={() => handleRejectReport(report.id)}
                        >
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent className={`bg-background text-white border-border`}>
          <DialogHeader>
            <DialogTitle>Update Report Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedReport && (
              <>
                <div>
                  <h3 className="font-semibold mb-2">Report</h3>
                  <p className="text-sm">{selectedReport.title}</p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Select New Status</h3>
                  <div className="grid grid-cols-1 gap-2">
                    <Button
                      variant="outline"
                      className={`justify-start ${selectedReport.status === 'IN_PROGRESS' ? 'bg-accent' : ''}`}
                      onClick={() => handleStatusUpdate(selectedReport.id, 'IN_PROGRESS')}
                      disabled={isUpdatingStatus}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      Mark as In Progress
                    </Button>
                    <Button
                      variant="outline"
                      className={`justify-start ${selectedReport.status === 'HELP_REQUESTED' ? 'bg-accent' : ''}`}
                      onClick={() => handleStatusUpdate(selectedReport.id, 'HELP_REQUESTED')}
                      disabled={isUpdatingStatus}
                    >
                      <Bell className="mr-2 h-4 w-4" />
                      Request Help
                    </Button>
                    <Button
                      variant="outline"
                      className={`justify-start ${selectedReport.status === 'RESOLVED' ? 'bg-accent' : ''}`}
                      onClick={() => handleStatusUpdate(selectedReport.id, 'RESOLVED')}
                      disabled={isUpdatingStatus}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Mark as Resolved
                    </Button>
                    <Button
                      variant="outline"
                      className={`justify-start ${selectedReport.status === 'REJECTED' ? 'bg-accent' : ''}`}
                      onClick={() => handleStatusUpdate(selectedReport.id, 'REJECTED')}
                      disabled={isUpdatingStatus}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Reject Report
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Help Request Dialog */}
      <Dialog open={isHelpRequestDialogOpen} onOpenChange={setIsHelpRequestDialogOpen}>
        <DialogContent className={`bg-background text-white border-border`}>
          <DialogHeader>
            <DialogTitle>Request Help</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Required Skills</label>
              <input
                type="text"
                className={`w-full mt-1 bg-accent border-border rounded-md ${theme === 'dark' ? 'bg-accent text-accent-foreground' : ''}`}
                value={helpRequestData.requiredSkills}
                onChange={(e) => setHelpRequestData(prev => ({ ...prev, requiredSkills: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Work Location</label>
              <input
                type="text"
                className={`w-full mt-1 bg-accent border-border rounded-md ${theme === 'dark' ? 'bg-accent text-accent-foreground' : ''}`}
                value={helpRequestData.workLocation}
                onChange={(e) => setHelpRequestData(prev => ({ ...prev, workLocation: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Required Capacity</label>
              <input
                type="number"
                className={`w-full mt-1 bg-accent border-border rounded-md ${theme === 'dark' ? 'bg-accent text-accent-foreground' : ''}`}
                value={helpRequestData.requiredCapacity}
                onChange={(e) => setHelpRequestData(prev => ({ ...prev, requiredCapacity: parseInt(e.target.value) || 0 }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Additional Notes</label>
              <textarea
                className={`w-full mt-1 bg-accent border-border rounded-md ${theme === 'dark' ? 'bg-accent text-accent-foreground' : ''}`}
                value={helpRequestData.additionalNotes}
                onChange={(e) => setHelpRequestData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                rows={4}
              />
            </div>
            <Button
              className={`w-full bg-accent hover:bg-accent/80 ${theme === 'dark' ? 'bg-accent text-accent-foreground' : ''}`}
              onClick={() => selectedReport && handleRequestHelp(selectedReport.id)}
            >
              Submit Help Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer text="© 2024 AYTO. All rights reserved." darkMode={theme === 'dark'} />
    </div>
  );
};

export default MaintenanceTeamDashboard; 