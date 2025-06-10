import { useState, useContext } from "react";
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
import { AuthContext } from "@/context/AuthContext";
import { LocationPicker } from "@/components/maps/LocationPicker";
import { utilityProviderService } from "@/services/utility-provider";

export const PROVIDER_TYPES = [
  "Power Authority",
  "Water and Sewerage",
  "Ethio-Tele",
  "Road Transportation"
] as const;

export type ProviderType = typeof PROVIDER_TYPES[number];

const INITIAL_FORM_STATE = {
  name: "",
  email: "",
  phoneNumber: "",
  password: "",
  description: "",
  providerType: "",
};

export const CreateUtilityProvider = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { token } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [location, setLocation] = useState<{ lat: number; lng: number; address?: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProviderTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      providerType: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast({
        title: "Error",
        description: "You must be logged in to create a utility provider",
        variant: "destructive",
      });
      return;
    }

    if (!location) {
      toast({
        title: "Error",
        description: "Please select a location on the map",
        variant: "destructive",
      });
      return;
    }

    if (!formData.providerType) {
      toast({
        title: "Error",
        description: "Please select a provider type",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Format location as "latitude,longitude"
      const locationString = `${location.lat},${location.lng}`;
      
      await utilityProviderService.createUtilityProvider({
        ...formData,
        location: locationString,
        role: "ADMIN",
        accountStatus: "ACTIVE",
      }, token);

      toast({
        title: "Success",
        description: "Utility provider created successfully",
      });

      // Reset form to initial state
      setFormData(INITIAL_FORM_STATE);
      setLocation(null);

      // Navigate to manage providers page
      navigate("/government-dashboard", { state: { activeTab: "manage-providers" } });
    } catch (error: any) {
      console.error("Error creating utility provider:", error);
      toast({
        title: "Error",
        description: error.response?.data || error.message || "Failed to create utility provider",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Provider Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter provider name"
            required
            className="bg-[#2D2D2D] border-[#404040]"
            autoComplete="off"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter email address"
            required
            className="bg-[#2D2D2D] border-[#404040]"
            autoComplete="off"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            placeholder="+251912345678"
            required
            className="bg-[#2D2D2D] border-[#404040]"
            autoComplete="off"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Initial Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Set initial password"
            required
            className="bg-[#2D2D2D] border-[#404040]"
            autoComplete="new-password"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="providerType">Provider Type</Label>
          <Select value={formData.providerType} onValueChange={handleProviderTypeChange}>
            <SelectTrigger id="providerType" className="bg-[#2D2D2D] border-[#404040]">
              <SelectValue placeholder="Select provider type" />
            </SelectTrigger>
            <SelectContent className="bg-[#2D2D2D] border-[#404040]">
              {PROVIDER_TYPES.map((type) => (
                <SelectItem 
                  key={type} 
                  value={type}
                  className="text-white hover:bg-[#404040]"
                >
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Location</Label>
        <LocationPicker
          onLocationSelect={setLocation}
          className="w-full"
        />
        {location && (
          <p className="text-sm text-gray-400">
            Selected coordinates: {location.lat}, {location.lng}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Enter provider description"
          required
          className="bg-[#2D2D2D] border-[#404040] min-h-[100px]"
          autoComplete="off"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/government-dashboard")}
          className="border-[#404040]"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#6C7719] hover:bg-[#5a6415]"
        >
          {isSubmitting ? "Creating..." : "Create Provider"}
        </Button>
      </div>
    </form>
  );
}; 