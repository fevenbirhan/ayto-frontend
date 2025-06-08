import React, { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, ChevronDown, AlertCircle, MoreVertical, Check, X, AlertTriangle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AuthContext } from "@/context/AuthContext";
import { utilityProviderService, UtilityProvider } from "@/services/utility-provider";

const ManageUtilityProviders = () => {
  const { toast } = useToast();
  const { token } = useContext(AuthContext);
  const [providers, setProviders] = useState<UtilityProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedServiceType, setSelectedServiceType] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingProvider, setUpdatingProvider] = useState<string | null>(null);
  const [confirmationDialog, setConfirmationDialog] = useState<{
    isOpen: boolean;
    providerId: string | null;
    action: "deactivate" | "suspend" | null;
    providerName: string;
  }>({
    isOpen: false,
    providerId: null,
    action: null,
    providerName: "",
  });

  const serviceTypes = [
    "Water Supply",
    "Electricity",
    "Waste Management",
    "Telecommunications",
    "Road Maintenance"
  ];

  const fetchProviders = async () => {
    try {
      setIsLoading(true);
      const data = await utilityProviderService.getAllUtilityProviders(token);
      setProviders(data);
    } catch (error: any) {
      console.error("Error fetching providers:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch utility providers",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProviders();
    }
  }, [token]);

  const handleActivate = async (providerId: string) => {
    try {
      await utilityProviderService.activateUtilityProvider(providerId, token);
      toast({
        title: "Success",
        description: "Provider activated successfully",
      });
      fetchProviders(); // Refresh the list
    } catch (error: any) {
      console.error("Error activating provider:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to activate provider",
        variant: "destructive",
      });
    }
  };

  const handleDeactivate = async (providerId: string) => {
    try {
      await utilityProviderService.deactivateUtilityProvider(providerId, token);
      toast({
        title: "Success",
        description: "Provider deactivated successfully",
      });
      fetchProviders(); // Refresh the list
    } catch (error: any) {
      console.error("Error deactivating provider:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to deactivate provider",
        variant: "destructive",
      });
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-500/20 text-green-500";
      case "INACTIVE":
        return "bg-red-500/20 text-red-500";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };

  const filteredProviders = providers.filter(provider =>
    provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    provider.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    provider.phoneNumber.includes(searchQuery)
  );

  if (error) {
    return (
      <Alert variant="destructive" className="bg-[#2D2D2D] border-[#404040]">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            placeholder="Search providers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#2D2D2D] border-[#404040]"
          />
        </div>
      </div>

      <div className="border border-[#404040] rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-[#2D2D2D]">
            <TableRow className="border-[#404040] hover:bg-[#2D2D2D]">
              <TableHead className="text-white">Provider Name</TableHead>
              <TableHead className="text-white">Contact Info</TableHead>
              <TableHead className="text-white">Location</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <div className="flex justify-center items-center space-x-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span className="text-white">Loading providers...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredProviders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-white">
                  No utility providers found.
                </TableCell>
              </TableRow>
            ) : (
              filteredProviders.map((provider) => (
                <TableRow
                  key={provider.id}
                  className="border-[#404040] hover:bg-[#2D2D2D]/50"
                >
                  <TableCell className="text-white">
                    <div>
                      <div className="font-medium">{provider.name}</div>
                      <div className="text-sm text-gray-400">{provider.description}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-white">
                    <div>
                      <div>{provider.email}</div>
                      <div className="text-sm text-gray-400">{provider.phoneNumber}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-white">
                    {provider.location}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeClass(provider.accountStatus)}>
                      {provider.accountStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        onClick={() => handleActivate(provider.id)}
                        disabled={provider.accountStatus === 'ACTIVE'}
                        className={cn(
                          "flex items-center gap-2",
                          provider.accountStatus === 'ACTIVE'
                            ? "bg-green-500/10 text-green-500/50"
                            : "bg-green-500/20 hover:bg-green-500/30 text-green-500"
                        )}
                      >
                        <Check className="h-4 w-4" />
                        Activate
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleDeactivate(provider.id)}
                        disabled={provider.accountStatus === 'INACTIVE'}
                        className={cn(
                          "flex items-center gap-2",
                          provider.accountStatus === 'INACTIVE'
                            ? "bg-red-500/10 text-red-500/50"
                            : "bg-red-500/20 hover:bg-red-500/30 text-red-500"
                        )}
                      >
                        <X className="h-4 w-4" />
                        Deactivate
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ManageUtilityProviders; 