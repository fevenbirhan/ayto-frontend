import { Report } from "@/services/report";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ReportCardProps {
  report: Report;
}

export const ReportCard = ({ report }: ReportCardProps) => {
  return (
    <Card className="bg-[#2D2D2D] border-[#404040]">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-white text-lg">{report.title}</CardTitle>
          <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-500">
            {report.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-400">{report.description}</p>
        
        <div className="space-y-2">
          <p className="text-sm text-gray-400">Location</p>
          <p className="text-white">{report.locationName}</p>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-gray-400">Reported by</p>
          <p className="text-white">{report.residentName}</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-400">Reported at</p>
          <p className="text-white">
            {new Date(report.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}; 