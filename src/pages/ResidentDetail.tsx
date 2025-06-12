import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2, Power, PowerOff, PauseCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { API_BASE_URL, fetchWithAuth } from "@/utils/api";

interface Resident {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  nationalId: string;
  accountStatus: string;
  role: string;
  profilePictureUrl: string;
}

const fetchResident = async (id: string): Promise<Resident> => {
  return fetchWithAuth(`${API_BASE_URL}/residents/${id}`);
};

const ResidentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: resident, isLoading, error } = useQuery({
    queryKey: ["resident", id],
    queryFn: () => fetchResident(id!),
    enabled: !!id,
  });

  const updateResidentStatus = async (action: string) => {
    return fetchWithAuth(`${API_BASE_URL}/residents/${id}/${action}`, {
      method: 'PUT'
    });
  };

  const deleteResident = async () => {
    return fetchWithAuth(`${API_BASE_URL}/residents/${id}/delete`, {
      method: 'DELETE'
    });
  };

  const activateMutation = useMutation({
    mutationFn: () => updateResidentStatus('activate'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resident", id] });
      toast.success("Resident activated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to activate resident: ${error.message}`);
    }
  });

  const deactivateMutation = useMutation({
    mutationFn: () => updateResidentStatus('deactivate'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resident", id] });
      toast.success("Resident deactivated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to deactivate resident: ${error.message}`);
    }
  });

  const suspendMutation = useMutation({
    mutationFn: () => updateResidentStatus('suspend'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resident", id] });
      toast.success("Resident suspended successfully");
    },
    onError: (error) => {
      toast.error(`Failed to suspend resident: ${error.message}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteResident,
    onSuccess: () => {
      toast.success("Resident deleted successfully");
      navigate("/admin");
    },
    onError: (error) => {
      toast.error(`Failed to delete resident: ${error.message}`);
    }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <p>Loading resident information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-red-500">Error loading resident: {error.message}</p>
      </div>
    );
  }

  if (!resident) {
    return (
      <div className="container mx-auto p-6">
        <p>Resident not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate("/admin")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>

      <Card className="max-w-2xl mx-auto">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar>
            <AvatarImage src={resident.profilePictureUrl} />
            <AvatarFallback>
              {resident.name.charAt(0)}
              {resident.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">
              {resident.name} {resident.lastName}
            </CardTitle>
            <p className="text-muted-foreground">{resident.email}</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Phone Number</h3>
                <p>{resident.phoneNumber}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">National ID</h3>
                <p>{resident.nationalId}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Account Status</h3>
                <Badge
                  variant={resident.accountStatus === "ACTIVE" ? "default" : "secondary"}
                >
                  {resident.accountStatus}
                </Badge>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Role</h3>
                <Badge variant="outline">{resident.role}</Badge>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => activateMutation.mutate()}
                disabled={resident.accountStatus === "ACTIVE"}
              >
                <Power className="mr-2 h-4 w-4" />
                Activate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => deactivateMutation.mutate()}
                disabled={resident.accountStatus === "INACTIVE"}
              >
                <PowerOff className="mr-2 h-4 w-4" />
                Deactivate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => suspendMutation.mutate()}
                disabled={resident.accountStatus === "SUSPENDED"}
              >
                <PauseCircle className="mr-2 h-4 w-4" />
                Suspend
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete this resident?")) {
                    deleteMutation.mutate();
                  }
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResidentDetail; 