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
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/components/ThemeProvider";
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
  const { token, language } = useAuth();
  const { theme } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [location, setLocation] = useState<{ lat: number; lng: number; address?: string } | null>(null);

  // Translations
  const translations = {
    title: language === 'am' ? 'አዲስ የተጠቃሚ አገልግሎት ማስተዳደሪያ ይፍጠሩ' : 'Create New Utility Provider',
    providerName: language === 'am' ? 'የአገልግሎት ስም' : 'Provider Name',
    email: language === 'am' ? 'ኢሜይል' : 'Email',
    phoneNumber: language === 'am' ? 'ስልክ ቁጥር' : 'Phone Number',
    password: language === 'am' ? 'የይለፍ ቃል' : 'Password',
    providerType: language === 'am' ? 'የአገልግሎት አይነት' : 'Provider Type',
    selectType: language === 'am' ? 'የአገልግሎት አይነት ይምረጡ' : 'Select provider type',
    location: language === 'am' ? 'አካባቢ' : 'Location',
    description: language === 'am' ? 'መግለጫ' : 'Description',
    coordinates: language === 'am' ? 'የተመረጡ መጋጠሚያዎች' : 'Selected coordinates',
    cancel: language === 'am' ? 'ሰርዝ' : 'Cancel',
    createProvider: language === 'am' ? 'አገልግሎት ይፍጠሩ' : 'Create Provider',
    creating: language === 'am' ? 'በመፍጠር ላይ...' : 'Creating...',
    errors: {
      loginRequired: language === 'am' ? 'አገልግሎት ለመፍጠር መለያ መግባት አለብዎት' : 'You must be logged in to create a utility provider',
      locationRequired: language === 'am' ? 'እባክዎ በካርታው ላይ አካባቢ ይምረጡ' : 'Please select a location on the map',
      typeRequired: language === 'am' ? 'እባክዎ የአገልግሎት አይነት ይምረጡ' : 'Please select a provider type',
      success: language === 'am' ? 'አገልግሎት በተሳካ ሁኔታ ተፈጥሯል' : 'Utility provider created successfully',
    }
  };

  const providerTypeTranslations = {
    'Power Authority': language === 'am' ? 'ኃይል ባለስልጣን' : 'Power Authority',
    'Water and Sewerage': language === 'am' ? 'ውሃ እና የመጣያ መንገድ' : 'Water and Sewerage',
    'Ethio-Tele': language === 'am' ? 'ኢትዮ-ቴሌ' : 'Ethio-Tele',
    'Road Transportation': language === 'am' ? 'መንገድ ትራንስፖርት' : 'Road Transportation'
  };

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
        title: language === 'am' ? 'ስህተት' : 'Error',
        description: translations.errors.loginRequired,
        variant: "destructive",
      });
      return;
    }

    if (!location) {
      toast({
        title: language === 'am' ? 'ስህተት' : 'Error',
        description: translations.errors.locationRequired,
        variant: "destructive",
      });
      return;
    }

    if (!formData.providerType) {
      toast({
        title: language === 'am' ? 'ስህተት' : 'Error',
        description: translations.errors.typeRequired,
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const locationString = `${location.lat},${location.lng}`;
      
      await utilityProviderService.createUtilityProvider({
        ...formData,
        location: locationString,
        role: "ADMIN",
        accountStatus: "ACTIVE",
      }, token);

      toast({
        title: language === 'am' ? 'ተሳክቷል' : 'Success',
        description: translations.errors.success,
      });

      setFormData(INITIAL_FORM_STATE);
      setLocation(null);

      navigate("/government-dashboard", { state: { activeTab: "manage-providers" } });
    } catch (error: any) {
      console.error("Error creating utility provider:", error);
      toast({
        title: language === 'am' ? 'ስህተት' : 'Error',
        description: error.response?.data || error.message || (language === 'am' ? 'አገልግሎት ለመፍጠር አልተሳካም' : 'Failed to create utility provider'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
      <h1 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
        {translations.title}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" className={theme === 'dark' ? 'text-gray-300' : ''}>
              {translations.providerName}
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder={translations.providerName}
              required
              className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}`}
              autoComplete="off"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className={theme === 'dark' ? 'text-gray-300' : ''}>
              {translations.email}
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={translations.email}
              required
              className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}`}
              autoComplete="off"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className={theme === 'dark' ? 'text-gray-300' : ''}>
              {translations.phoneNumber}
            </Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="+251912345678"
              required
              className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}`}
              autoComplete="off"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className={theme === 'dark' ? 'text-gray-300' : ''}>
              {translations.password}
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder={translations.password}
              required
              className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}`}
              autoComplete="new-password"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="providerType" className={theme === 'dark' ? 'text-gray-300' : ''}>
              {translations.providerType}
            </Label>
            <Select value={formData.providerType} onValueChange={handleProviderTypeChange}>
              <SelectTrigger 
                id="providerType" 
                className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}`}
              >
                <SelectValue placeholder={translations.selectType} />
              </SelectTrigger>
              <SelectContent className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}`}>
                {PROVIDER_TYPES.map((type) => (
                  <SelectItem 
                    key={type} 
                    value={type}
                    className={`${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  >
                    {providerTypeTranslations[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label className={theme === 'dark' ? 'text-gray-300' : ''}>
            {translations.location}
          </Label>
          <LocationPicker
            onLocationSelect={setLocation}
            className="w-full"
            
          />
          {location && (
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {translations.coordinates}: {location.lat}, {location.lng}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className={theme === 'dark' ? 'text-gray-300' : ''}>
            {translations.description}
          </Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder={translations.description}
            required
            className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'} min-h-[100px]`}
            autoComplete="off"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/government-dashboard")}
            className={`${theme === 'dark' ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'}`}
          >
            {translations.cancel}
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className={`bg-[#6C7719] hover:bg-[#5a6415] ${theme === 'dark' ? 'text-white' : ''}`}
          >
            {isSubmitting ? translations.creating : translations.createProvider}
          </Button>
        </div>
      </form>
    </div>
  );
};