import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { LocationPicker } from "@/components/maps/LocationPicker";
import { reportService, CreateReportData } from "@/services/report";
import "@/styles/map.css";

type Priority = CreateReportData['priority'];

export const NewReport = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "MEDIUM" as Priority,
    location: null as { lat: number; lng: number; address?: string } | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.location) {
      toast({
        title: "Error",
        description: "Please select a location on the map",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const reportData: CreateReportData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        latitude: formData.location.lat,
        longitude: formData.location.lng,
      };
      
      await reportService.createReport(reportData);
      
      toast({
        title: "Success",
        description: "Report submitted successfully",
      });
      
      navigate("/resident-dashboard?tab=reports");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-white text-3xl font-bold mb-8">Submit New Report</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-white">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="bg-[#1A1A1A] text-white border-[#404040] focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
            placeholder="Enter a descriptive title"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-white">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="bg-[#1A1A1A] text-white border-[#404040] focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] min-h-[100px]"
            placeholder="Provide detailed information about the issue"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category" className="text-white">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger className="bg-[#1A1A1A] text-white border-[#404040] focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-[#2D2D2D] border-[#404040]">
                <SelectItem value="ROAD_ISSUE" className="text-white hover:bg-[#404040]">Road Issue</SelectItem>
                <SelectItem value="WATER_LEAK" className="text-white hover:bg-[#404040]">Water Leak</SelectItem>
                <SelectItem value="ELECTRICAL" className="text-white hover:bg-[#404040]">Electrical</SelectItem>
                <SelectItem value="WASTE_MANAGEMENT" className="text-white hover:bg-[#404040]">Waste Management</SelectItem>
                <SelectItem value="OTHER" className="text-white hover:bg-[#404040]">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority" className="text-white">Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={(value: Priority) => setFormData({ ...formData, priority: value })}
            >
              <SelectTrigger className="bg-[#1A1A1A] text-white border-[#404040] focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent className="bg-[#2D2D2D] border-[#404040]">
                <SelectItem value="LOW" className="text-white hover:bg-[#404040]">Low</SelectItem>
                <SelectItem value="MEDIUM" className="text-white hover:bg-[#404040]">Medium</SelectItem>
                <SelectItem value="HIGH" className="text-white hover:bg-[#404040]">High</SelectItem>
                <SelectItem value="URGENT" className="text-white hover:bg-[#404040]">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <LocationPicker
          onLocationSelect={(location) => setFormData({ ...formData, location })}
          className="mt-6"
        />

        <div className="flex justify-end space-x-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/resident-dashboard?tab=reports")}
            className="bg-[#2D2D2D] text-white border-[#404040] hover:bg-[#404040] hover:text-white focus:ring-1 focus:ring-[#3B82F6]"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#3B82F6] hover:bg-[#2563EB] text-white focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-2 focus:ring-offset-[#1A1A1A]"
          >
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
        </div>
      </form>
    </div>
  );
}; 