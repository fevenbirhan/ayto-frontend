import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2, Power, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { API_BASE_URL, fetchWithAuth } from "@/utils/api";

interface GovernmentOffice {
  id: string;
  name: string;
  location: string;
  email: string;
  phoneNumber: string;
  accountStatus: string;
  description: string;
  role: string;
}

const fetchOffice = async (id: string): Promise<GovernmentOffice> => {
  return fetchWithAuth(`${API_BASE_URL}/government-offices/${id}`);
};

const GovernmentOfficeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: office, isLoading, error } = useQuery({
    queryKey: ["office", id],
    queryFn: () => fetchOffice(id!),
    enabled: !!id,
  });

  const updateOfficeStatus = async (action: string) => {
    return fetchWithAuth(`${API_BASE_URL}/government-offices/${id}/${action}`, {
      method: 'PUT'
    });
  };

  const deleteOffice = async () => {
    return fetchWithAuth(`${API_BASE_URL}/government-offices/${id}/delete`, {
      method: 'PUT'
    });
  };

  const activateMutation = useMutation({
    mutationFn: () => updateOfficeStatus('activate'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["office", id] });
      toast.success("Office activated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to activate office: ${error.message}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOffice,
    onSuccess: () => {
      toast.success("Office deleted successfully");
      navigate("/admin");
    },
    onError: (error) => {
      toast.error(`Failed to delete office: ${error.message}`);
    }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <p>Loading office information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-red-500">Error loading office: {error.message}</p>
      </div>
    );
  }

  if (!office) {
    return (
      <div className="container mx-auto p-6">
        <p>Office not found</p>
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
          <Avatar className="h-20 w-20">
            <AvatarFallback>
              <Building2 className="h-10 w-10" />
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{office.name}</CardTitle>
            <p className="text-muted-foreground">{office.email}</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                <p>{office.location}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Phone Number</h3>
                <p>{office.phoneNumber}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
              <p className="mt-1">{office.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Account Status</h3>
                <Badge
                  variant={office.accountStatus === "ACTIVE" ? "default" : "secondary"}
                >
                  {office.accountStatus}
                </Badge>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Role</h3>
                <Badge variant="outline">{office.role}</Badge>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => activateMutation.mutate()}
                disabled={office.accountStatus === "ACTIVE"}
              >
                <Power className="mr-2 h-4 w-4" />
                Activate
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete this office?")) {
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

export default GovernmentOfficeDetail; 