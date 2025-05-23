import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Navigation, Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useDebounce } from '@/hooks/useDebounce';

interface LocationPickerProps {
  onLocationSelect: (location: { lat: number; lng: number; address?: string }) => void;
  initialLocation?: { lat: number; lng: number; address?: string };
  className?: string;
}

export const LocationPicker = ({ onLocationSelect, initialLocation, className = '' }: LocationPickerProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const marker = useRef<maplibregl.Marker | null>(null);
  const [position, setPosition] = useState<{ lat: number; lng: number; address?: string } | null>(initialLocation || null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();
  const debouncedSearch = useDebounce(searchQuery, 500);

  const handleLocationSelect = async (location: { lat: number; lng: number }) => {
    try {
      // Reverse geocode to get address
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}`
      );
      const data = await response.json();
      const address = data.display_name;
      
      const newLocation = { ...location, address };
      setPosition(newLocation);
      onLocationSelect(newLocation);
      addMarker(location.lat, location.lng);

      // Show success toast
      toast({
        title: "Location Selected",
        description: address,
      });
    } catch (error) {
      // If reverse geocoding fails, still update location without address
      const newLocation = { ...location };
      setPosition(newLocation);
      onLocationSelect(newLocation);
      addMarker(location.lat, location.lng);

      // Show success toast with coordinates
      toast({
        title: "Location Selected",
        description: `Latitude: ${location.lat.toFixed(6)}, Longitude: ${location.lng.toFixed(6)}`,
      });
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        await handleLocationSelect(location);
        map.current?.flyTo({
          center: [location.lng, location.lat],
          zoom: 15
        });
        setIsLoading(false);
      },
      (error) => {
        toast({
          title: "Error",
          description: "Unable to retrieve your location. Please select a location manually.",
          variant: "destructive"
        });
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  const handleUseCurrentLocation = () => {
    getCurrentLocation();
  };

  const handleSearch = async () => {
    if (!debouncedSearch.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(debouncedSearch)}`
      );
      const data = await response.json();
      
      if (data.length > 0) {
        const location = {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          address: data[0].display_name
        };
        setPosition(location);
        onLocationSelect(location);
        addMarker(location.lat, location.lng);
        map.current?.flyTo({
          center: [location.lng, location.lat],
          zoom: 15
        });
        // Clear the search input after successful search
        setSearchQuery('');
      } else {
        toast({
          title: "Not Found",
          description: "No locations found for your search",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search location",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  // Initialize map
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    // Initialize map with OpenStreetMap style
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'osm': {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors'
          }
        },
        layers: [{
          id: 'osm',
          type: 'raster',
          source: 'osm',
          minzoom: 0,
          maxzoom: 19
        }]
      },
      center: position ? [position.lng, position.lat] : [-0.09, 51.505],
      zoom: 13
    });

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    // Add click handler
    map.current.on('click', async (e) => {
      const { lng, lat } = e.lngLat;
      await handleLocationSelect({ lat, lng });
    });

    // Add marker if initial position exists
    if (position) {
      addMarker(position.lat, position.lng);
    }

    // Try to get current location on mount
    getCurrentLocation();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  const addMarker = (lat: number, lng: number) => {
    if (marker.current) {
      marker.current.remove();
    }

    if (map.current) {
      marker.current = new maplibregl.Marker()
        .setLngLat([lng, lat])
        .addTo(map.current);
    }
  };

  useEffect(() => {
    if (debouncedSearch) {
      handleSearch();
    }
  }, [debouncedSearch]);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h3 className="text-white text-lg font-medium">Select Location</h3>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 md:flex-none">
            <Input
              type="text"
              placeholder="Search for a location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#2D2D2D] text-white border-[#404040] pl-10 pr-4"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#A3A3A3]" />
          </form>
          <Button
            variant="outline"
            size="sm"
            onClick={handleUseCurrentLocation}
            disabled={isLoading}
            className="bg-[#2D2D2D] text-white border-[#404040] hover:bg-[#404040] whitespace-nowrap"
          >
            <Navigation className="h-4 w-4 mr-2" />
            {isLoading ? "Locating..." : "Use my location"}
          </Button>
        </div>
      </div>
      
      <div className="h-[400px] rounded-lg overflow-hidden border border-[#404040]">
        <div ref={mapContainer} className="h-full w-full" />
      </div>

      {position && (
        <div className="flex items-center text-[#A3A3A3] text-sm">
          <MapPin className="h-4 w-4 mr-2" />
          <span className="truncate">
            {position.address || `Latitude: ${position.lat.toFixed(6)}, Longitude: ${position.lng.toFixed(6)}`}
          </span>
        </div>
      )}
    </div>
  );
}; 