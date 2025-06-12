import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Building2 } from "lucide-react";

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

const fetchResidents = async (): Promise<Resident[]> => {
  const response = await fetch("http://localhost:8080/ayto/residents/all", {
    headers: {
      'Authorization': 'Bearer eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJhZm9taWFuZWJpeXUwOTYxQGdtYWlsLmNvbSIsImlhdCI6MTc0OTcyMzYwNCwiZXhwIjoxNzQ5ODEwMDA0fQ.bRzvVJjt1exNAWJuK_yLTUBCw5dxMLhq8Zb3hCkXpiuioTcfsxPQCxkuGRdY3_OV',
      'accept': '*/*'
    }
  });
  console.log(response);
  if (!response.ok) {
    throw new Error("Failed to fetch residents");
  }
  return response.json();
};

const fetchGovernmentOffices = async (): Promise<GovernmentOffice[]> => {
  const response = await fetch("http://localhost:8080/ayto/government-offices/all", {
    headers: {
      'Authorization': 'Bearer eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJhZm9taWFuZWJpeXUwOTYxQGdtYWlsLmNvbSIsImlhdCI6MTc0OTcyMzYwNCwiZXhwIjoxNzQ5ODEwMDA0fQ.bRzvVJjt1exNAWJuK_yLTUBCw5dxMLhq8Zb3hCkXpiuioTcfsxPQCxkuGRdY3_OV',
      'accept': '*/*'
    }
  });
  console.log(response);
  if (!response.ok) {
    throw new Error("Failed to fetch government offices");
  }
  return response.json();
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { data: residents, isLoading: residentsLoading, error: residentsError } = useQuery({
    queryKey: ["residents"],
    queryFn: fetchResidents,
  });

  const { data: governmentOffices, isLoading: officesLoading, error: officesError } = useQuery({
    queryKey: ["governmentOffices"],
    queryFn: fetchGovernmentOffices,
  });

  console.log("sadasdsa");

  if (residentsLoading || officesLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <p>Loading data...</p>
      </div>
    );
  }

  if (residentsError || officesError) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <p className="text-red-500">
          Error loading data: {residentsError?.message || officesError?.message}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Residents Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Residents</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {residents?.map((resident) => (
            <Card 
              key={resident.id}
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={() => navigate(`/admin/resident/${resident.id}`)}
            >
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar>
                  <AvatarImage src={resident.profilePictureUrl} />
                  <AvatarFallback>
                    {resident.name.charAt(0)}
                    {resident.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>
                    {resident.name} {resident.lastName}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{resident.email}</p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Phone:</span>
                    <span className="text-sm">{resident.phoneNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">National ID:</span>
                    <span className="text-sm">{resident.nationalId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Status:</span>
                    <Badge
                      variant={resident.accountStatus === "ACTIVE" ? "default" : "secondary"}
                    >
                      {resident.accountStatus}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Role:</span>
                    <Badge variant="outline">{resident.role}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Government Offices Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Government Offices</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {governmentOffices?.map((office) => (
            <Card 
              key={office.id}
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={() => navigate(`/admin/office/${office.id}`)}
            >
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar>
                  <AvatarFallback>
                    <Building2 className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{office.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{office.email}</p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Location:</span>
                    <span className="text-sm">{office.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Phone:</span>
                    <span className="text-sm">{office.phoneNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Status:</span>
                    <Badge
                      variant={office.accountStatus === "ACTIVE" ? "default" : "secondary"}
                    >
                      {office.accountStatus}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Description:</span>
                    <span className="text-sm text-muted-foreground">{office.description}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 