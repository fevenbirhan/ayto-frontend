import { useState, useEffect, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { AuthContext } from "@/context/AuthContext";
import { Report } from "@/services/report";
import { utilityProviderService } from "@/services/utility-provider";

const ReturnedReports = () => {
  const { toast } = useToast();
  const { token, userId } = useContext(AuthContext);
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReturnedReports = async () => {
      if (!token || !userId) return;

      try {
        setIsLoading(true);
        // Get provider reports and filter for REJECTED status
        const providerReports = await utilityProviderService.getProviderReports(userId, token);
        const returnedReports = providerReports.filter(
          report => report.status === 'REJECTED'
        );
        setReports(returnedReports);
      } catch (error) {
        console.error('Error fetching returned reports:', error);
        toast({
          title: "Error",
          description: "Failed to load returned reports",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchReturnedReports();
  }, [token, userId, toast]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Returned Reports</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <Card key={report.id} className="bg-[#2D2D2D] border-[#404040]">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-white text-lg">{report.title}</CardTitle>
                <Badge className="bg-red-500/20 text-red-500">
                  Returned
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Category</p>
                <p className="text-white">{report.category}</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Description</p>
                <p className="text-white text-sm line-clamp-3">{report.description}</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Location</p>
                <p className="text-white text-sm">{report.locationName || report.location}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-400">Return Reason</p>
                <p className="text-white text-sm">
                  This issue requires specialized skills or equipment beyond our current capabilities.
                </p>
              </div>
            </CardContent>
          </Card>
        ))}

        {reports.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-400">No returned reports available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReturnedReports; 