import { useContext, useEffect, useState } from "react";
import { Report, reportService } from "@/services/report";
import { AuthContext } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { ReportCard } from "@/components/reports/ReportCard";

export const ReportsList = () => {
  const { token, userId } = useContext(AuthContext);
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      if (!token || !userId) {
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching reports for provider:', userId);
        const allReports = await reportService.getAllReports(token);
        console.log('Total reports fetched:', allReports.length);
        
        // Debug each report's provider ID
        allReports.forEach(report => {
          console.log('Report:', {
            id: report.id,
            title: report.title,
            providerId: report.utilityProviderId,
            status: report.status,
            category: report.category
          });
        });
        
        // Filter reports for this provider that are pending
        const providerReports = allReports.filter(report => {
          const isMatch = report.utilityProviderId === userId && report.status === 'PENDING';
          console.log(`Report ${report.id} match check:`, {
            reportProviderId: report.utilityProviderId,
            currentUserId: userId,
            status: report.status,
            isMatch
          });
          return isMatch;
        });
        
        console.log('Filtered reports for provider:', {
          providerId: userId,
          reportCount: providerReports.length,
          reports: providerReports.map(r => ({
            id: r.id,
            title: r.title,
            category: r.category
          }))
        });

        setReports(providerReports);
      } catch (error: any) {
        console.error('Error fetching reports:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to fetch reports",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [token, userId, toast]);

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
          <ReportCard key={report.id} report={report} />
        ))}
      </div>
    </div>
  );
}; 