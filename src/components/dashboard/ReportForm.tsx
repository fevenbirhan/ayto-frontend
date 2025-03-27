
import { useState } from "react";
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

interface ReportFormProps {
  onSubmitSuccess: () => void;
}

export const ReportForm = ({ onSubmitSuccess }: ReportFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

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
    
    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(newImageUrls[index]);
    
    newImages.splice(index, 1);
    newImageUrls.splice(index, 1);
    
    setImages(newImages);
    setImagePreviewUrls(newImageUrls);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would save the report to the database
    console.log({ title, description, category, location, images });
    
    // Reset form
    setTitle("");
    setDescription("");
    setCategory("");
    setLocation("");
    setImages([]);
    setImagePreviewUrls([]);
    
    // Notify parent component
    onSubmitSuccess();
    
    // Show success message
    alert("Report submitted successfully!");
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4">Submit New Report</h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">Title of Issue</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Pothole on Main Street"
              required
              className="bg-[#1E2A13] dark:bg-gray-700 text-white border-[#255F38] dark:border-gray-600"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category" className="text-white">Category</Label>
            <Select required value={category} onValueChange={setCategory}>
              <SelectTrigger 
                id="category" 
                className="bg-[#1E2A13] dark:bg-gray-700 text-white border-[#255F38] dark:border-gray-600"
              >
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-[#1E2A13] dark:bg-gray-700 text-white border-[#255F38] dark:border-gray-600">
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description" className="text-white">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please provide details about the issue..."
            required
            className="min-h-[120px] bg-[#1E2A13] dark:bg-gray-700 text-white border-[#255F38] dark:border-gray-600"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location" className="text-white">Location</Label>
          <div className="relative">
            <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-white/60" />
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Address or location description"
              required
              className="pl-8 bg-[#1E2A13] dark:bg-gray-700 text-white border-[#255F38] dark:border-gray-600"
            />
          </div>
          <p className="text-sm text-white/60">
            Use an address, intersection, or description that identifies the location
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="images" className="text-white">Upload Images/Videos</Label>
          <div className="flex items-center gap-3">
            <label 
              htmlFor="images" 
              className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-md bg-[#1E2A13] dark:bg-gray-700 border border-dashed border-[#255F38] dark:border-gray-600 text-white hover:bg-[#255F38]/10 transition-colors"
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
            <span className="text-sm text-white/60">
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
                    className="h-20 w-20 object-cover rounded-md border border-[#255F38] dark:border-gray-600"
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
      
      <div className="flex justify-end gap-3">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onSubmitSuccess}
          className="border-[#255F38] dark:border-gray-700 text-white hover:bg-[#255F38]/20 dark:hover:bg-gray-700/50"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="bg-[#6C7719] dark:bg-[#255F38] hover:bg-[#5a6415] dark:hover:bg-[#1e4a2b] text-white"
        >
          Submit Report
        </Button>
      </div>
    </form>
  );
};
