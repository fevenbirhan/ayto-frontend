import { useContext, useState, useEffect } from "react";
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
import { MapPin, Upload, X } from "lucide-react";
import { LocationPicker } from "@/components/maps/LocationPicker";
import { useToast } from "@/components/ui/use-toast";
import { AuthContext } from "@/context/AuthContext";
import { reportService, Report } from "@/services/report";

interface ReportFormProps {
  onSubmitSuccess: () => void;
  reportToEdit?: Report;
  mode?: 'create' | 'edit';
}

export const ReportForm = ({ onSubmitSuccess, reportToEdit, mode = 'create' }: ReportFormProps) => {
  const { toast } = useToast();
  const { token, userId } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number; address?: string } | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      toast({
        title: "Error",
        description: "Please log in to submit reports",
        variant: "destructive"
      });
    }
  }, [token, toast]);

  useEffect(() => {
    if (reportToEdit && mode === 'edit') {
      setTitle(reportToEdit.title);
      setDescription(reportToEdit.description);
      setCategory(reportToEdit.category);
      const [lat, lng] = reportToEdit.location.split(',').map(Number);
      setLocation({ 
        lat, 
        lng, 
        address: reportToEdit.locationName 
      });
      setExistingImageUrls(reportToEdit.imageUrls || []);
    }
  }, [reportToEdit, mode]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = [...images];
      const newImageUrls = [...imagePreviewUrls];
      
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        newImages.push(file);
        newImageUrls.push(URL.createObjectURL(file));
      }
      
      setImages(newImages);
      setImagePreviewUrls(newImageUrls);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    const newImageUrls = [...imagePreviewUrls];
    
    URL.revokeObjectURL(newImageUrls[index]);
    
    newImages.splice(index, 1);
    newImageUrls.splice(index, 1);
    
    setImages(newImages);
    setImagePreviewUrls(newImageUrls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast({
        title: "Error",
        description: "Please log in to submit reports",
        variant: "destructive"
      });
      return;
    }

    if (!location) {
      toast({
        title: "Error",
        description: "Please select a location on the map",
        variant: "destructive"
      });
      return;
    }

    if (!title || !description || !category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("category", category);
      formData.append("location", `${location.lat},${location.lng}`);
      if (location.address) {
        formData.append("locationName", location.address);
      }

      if (existingImageUrls.length > 0) {
        formData.append("existingImages", JSON.stringify(existingImageUrls));
      }

      images.forEach((image) => {
        formData.append("images", image);
      });

      if (mode === 'edit' && reportToEdit) {
        formData.append("isEdited", "true");
        
        // Debug logs
        console.log('Submitting edit with FormData:');
        for (let [key, value] of formData.entries()) {
          console.log(`${key}: ${value}`);
        }

        await reportService.updateReport(reportToEdit.id, formData, token);
        toast({
          title: "Success",
          description: "Report updated successfully",
        });
      } else {
        await reportService.createReport(formData, token);
        toast({
          title: "Success",
          description: "Report submitted successfully",
        });
      }

      setTitle("");
      setDescription("");
      setCategory("");
      setLocation(null);
      setImages([]);
      setImagePreviewUrls([]);
      setExistingImageUrls([]);
      onSubmitSuccess();
    } catch (error: any) {
      console.error("Error submitting report:", error);
      let errorMessage = mode === 'edit' ? "Failed to update report." : "Failed to submit report.";
      
      if (error.response?.status === 403) {
        errorMessage = "You don't have permission to perform this action. Please check your login status.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    "Road Damage",
    "Water Shortage",
    "Waste Management",
    "Streetlight Failure",
    "Public Safety",
    "Noise Complaint",
    "Infrastructure",
    "Other"
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-[#1A1A1A] rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-4">
        {mode === 'edit' ? 'Edit Report' : 'Submit New Report'}
      </h2>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white text-sm font-medium">Title of Issue</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Pothole on Main Street"
              required
              className="bg-[#2D2D2D] text-white border-[#404040] focus:border-[#6C7719] focus:ring-1 focus:ring-[#6C7719]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category" className="text-white text-sm font-medium">Category</Label>
            <Select required value={category} onValueChange={setCategory}>
              <SelectTrigger 
                id="category" 
                className="bg-[#2D2D2D] text-white border-[#404040] focus:border-[#6C7719] focus:ring-1 focus:ring-[#6C7719]"
              >
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-[#2D2D2D] text-white border-[#404040]">
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat} className="hover:bg-[#404040]">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description" className="text-white text-sm font-medium">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please provide details about the issue..."
            required
            className="min-h-[120px] bg-[#2D2D2D] text-white border-[#404040] focus:border-[#6C7719] focus:ring-1 focus:ring-[#6C7719]"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-white text-sm font-medium">Location</Label>
          <LocationPicker
            onLocationSelect={setLocation}
            className="mt-2"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="images" className="text-white text-sm font-medium">Upload Images/Videos</Label>
          <div className="flex items-center gap-3">
            <label 
              htmlFor="images" 
              className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-md bg-[#2D2D2D] border border-dashed border-[#404040] text-white hover:bg-[#404040] transition-colors"
            >
              <Upload className="h-4 w-4" />
              <span>Add Files</span>
              <Input
                id="images"
                type="file"
                onChange={handleImageChange}
                accept="image/*,video/*"
                multiple
                className="hidden"
              />
            </label>
            <span className="text-sm text-[#A3A3A3]">
              Attach photos or videos as evidence (optional)
            </span>
          </div>
          
          {imagePreviewUrls.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {imagePreviewUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={url} 
                    alt={`Preview ${index + 1}`}
                    className="h-20 w-20 object-cover rounded-md border border-[#404040]"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-end space-x-4 pt-6 border-t border-[#404040]">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onSubmitSuccess}
          className="border-[#404040] text-white hover:bg-[#404040]"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="bg-[#6C7719] hover:bg-[#5a6415] text-white"
          disabled={isSubmitting || !token}
        >
          {isSubmitting 
            ? (mode === 'edit' ? "Updating..." : "Submitting...") 
            : (mode === 'edit' ? "Update Report" : "Submit Report")}
        </Button>
      </div>
    </form>
  );
};
