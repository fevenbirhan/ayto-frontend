import { useState, useEffect, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { AuthContext } from "@/context/AuthContext";
import { maintenanceTeamService, MaintenanceTeam } from "@/services/maintenance-team";
import { Users, Phone, Mail, Wrench } from "lucide-react";

interface MaintenanceTeamsListProps {
  refreshTrigger?: number;
}

const MaintenanceTeamsList = ({ refreshTrigger = 0 }: MaintenanceTeamsListProps) => {
  const { toast } = useToast();
  const { token, userId } = useContext(AuthContext);
  const [teams, setTeams] = useState<MaintenanceTeam[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setIsLoading(true);
        if (token && userId) {
          const teamsData = await maintenanceTeamService.getAllMaintenanceTeams(token);
          // Ensure employees array is initialized for each team
          const teamsWithEmployees = teamsData.map(team => ({
            ...team,
            employees: team.employees || []
          }));
          setTeams(teamsWithEmployees);
        }
      } catch (error) {
        console.error('Error fetching teams:', error);
        toast({
          title: "Error",
          description: "Failed to load maintenance teams",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (token && userId) {
      fetchTeams();
    }
  }, [token, userId, refreshTrigger]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-gray-400">Loading teams...</p>
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No maintenance teams available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {teams.map((team) => (
        <Card key={team.maintenanceTeamId} className="bg-[#2D2D2D] border-[#404040]">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-white text-lg">{team.name}</CardTitle>
              <Badge 
                variant="secondary"
                className={
                  team.workStatus === 'FREE' 
                    ? 'bg-green-500/20 text-green-500'
                    : team.workStatus === 'BUSY'
                    ? 'bg-yellow-500/20 text-yellow-500'
                    : 'bg-red-500/20 text-red-500'
                }
              >
                {team.workStatus}
              </Badge>
            </div>
            <CardDescription className="text-gray-400">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{team.employees.length} Members</span>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-400">
                <Mail className="h-4 w-4" />
                <span>{team.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Phone className="h-4 w-4" />
                <span>{team.phoneNumber}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Wrench className="h-4 w-4" />
                <span>{team.skills}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MaintenanceTeamsList;