import { useState, useEffect, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { AuthContext } from "@/context/AuthContext";
import { Report, reportService } from "@/services/report";
import { Star } from "lucide-react";

interface Feedback {
  id: string;
  reportId: string;
  reportTitle: string;
  residentName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const FeedbackSection = () => {
  const { toast } = useToast();
  const { token, userId } = useContext(AuthContext);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      if (!token || !userId) return;

      try {
        setIsLoading(true);
        // For now, we'll show resolved reports as feedback
        const allReports = await reportService.getAllReports(token);
        const resolvedReports = allReports
          .filter(report => report.status === 'RESOLVED' && report.utilityProviderId === userId)
          .map(report => ({
            id: report.id,
            reportId: report.id,
            reportTitle: report.title,
            residentName: report.residentName,
            rating: 5, // Default rating for now
            comment: "Issue resolved successfully", // Default comment
            createdAt: report.updatedAt
          }));
        setFeedback(resolvedReports);
      } catch (error) {
        console.error('Error fetching feedback:', error);
        toast({
          title: "Error",
          description: "Failed to load feedback",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedback();
  }, [token, userId]);

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating 
            ? "fill-yellow-400 text-yellow-400" 
            : "fill-gray-400 text-gray-400"
        }`}
      />
    ));
  };

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
        <h2 className="text-2xl font-bold text-white">Resident Feedback</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {feedback.map((item) => (
          <Card key={item.id} className="bg-[#2D2D2D] border-[#404040]">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-white text-lg">{item.reportTitle}</CardTitle>
                <div className="flex items-center gap-1">
                  {renderStars(item.rating)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Resident</p>
                <p className="text-white">{item.residentName}</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Comment</p>
                <p className="text-white text-sm">{item.comment}</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Date</p>
                <p className="text-white text-sm">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}

        {feedback.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-400">No feedback available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackSection; 