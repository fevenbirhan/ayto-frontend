import React, { useState, useEffect } from "react";
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

interface UtilityProvider {
  id: string;
  name: string;
  serviceType: string;
  contactInfo: {
    email: string;
    phone: string;
  };
  status: "active" | "inactive" | "suspended";
  lastUpdated: string;
}

const ManageUtilityProviders = () => {
  const { toast } = useToast();
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

  // Simulate fetching providers
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockProviders: UtilityProvider[] = [
          {
            id: "1",
            name: "Ethio Telecom",
            serviceType: "Telecommunications",
            contactInfo: {
              email: "contact@ethiotelecom.et",
              phone: "+251 911 123 456"
            },
            status: "active",
            lastUpdated: "2024-03-15"
          },
          {
            id: "2",
            name: "Addis Ababa Water Supply",
            serviceType: "Water Supply",
            contactInfo: {
              email: "info@aaws.org",
              phone: "+251 911 234 567"
            },
            status: "suspended",
            lastUpdated: "2024-03-14"
          },
          {
            id: "3",
            name: "Ethiopian Electric Power",
            serviceType: "Electricity",
            contactInfo: {
              email: "support@eep.gov.et",
              phone: "+251 911 345 678"
            },
            status: "inactive",
            lastUpdated: "2024-03-13"
          }
        ];
        
        setProviders(mockProviders);
        setTotalPages(Math.ceil(mockProviders.length / 10));
        setError(null);
      } catch (err) {
        setError("Failed to load utility providers. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviders();
  }, []);

  const handleStatusChange = async (providerId: string, newStatus: "active" | "inactive" | "suspended") => {
    try {
      setUpdatingProvider(providerId);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProviders(prevProviders =>
        prevProviders.map(provider =>
          provider.id === providerId
            ? { ...provider, status: newStatus, lastUpdated: new Date().toISOString().split('T')[0] }
            : provider
        )
      );

      toast({
        title: "Status Updated",
        description: `Provider has been ${newStatus}.`,
        action: (
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2 bg-[#2D2D2D] text-white border-[#404040] hover:bg-[#404040]"
            onClick={() => handleUndoStatusChange(providerId)}
          >
            Undo
          </Button>
        ),
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update provider status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdatingProvider(null);
      setConfirmationDialog({ isOpen: false, providerId: null, action: null, providerName: "" });
    }
  };

  const handleUndoStatusChange = async (providerId: string) => {
    try {
      setUpdatingProvider(providerId);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProviders(prevProviders =>
        prevProviders.map(provider =>
          provider.id === providerId
            ? { ...provider, status: "active", lastUpdated: new Date().toISOString().split('T')[0] }
            : provider
        )
      );

      toast({
        title: "Status Restored",
        description: "Provider status has been restored to active.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to restore provider status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdatingProvider(null);
    }
  };

  const openConfirmationDialog = (providerId: string, action: "deactivate" | "suspend", providerName: string) => {
    setConfirmationDialog({
      isOpen: true,
      providerId,
      action,
      providerName,
    });
  };

  const getStatusBadgeColor = (status: "active" | "inactive" | "suspended") => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400";
      case "inactive":
        return "bg-red-500/20 text-red-400";
      case "suspended":
        return "bg-orange-500/20 text-orange-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.serviceType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesServiceType = !selectedServiceType || provider.serviceType === selectedServiceType;
    return matchesSearch && matchesServiceType;
  });

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
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#A3A3A3]" />
          <Input
            type="search"
            placeholder="Search providers..."
            className="pl-8 bg-[#2D2D2D] text-white border-[#404040] focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-1 bg-[#2D2D2D] text-white border-[#404040] hover:bg-[#404040]">
              <Filter className="h-4 w-4" />
              Service Type
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-[#2D2D2D] text-white border-[#404040]">
            <DropdownMenuItem
              className={cn(
                "cursor-pointer",
                !selectedServiceType && "bg-[#3B82F6] text-white"
              )}
              onClick={() => setSelectedServiceType(null)}
            >
              All Types
            </DropdownMenuItem>
            {serviceTypes.map((type) => (
              <DropdownMenuItem
                key={type}
                className={cn(
                  "cursor-pointer",
                  selectedServiceType === type && "bg-[#3B82F6] text-white"
                )}
                onClick={() => setSelectedServiceType(type)}
              >
                {type}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Providers Table */}
      <div className="rounded-md border border-[#404040] bg-[#2D2D2D]">
        <Table>
          <TableHeader>
            <TableRow className="border-[#404040] hover:bg-[#404040]">
              <TableHead className="text-white">Name</TableHead>
              <TableHead className="text-white">Service Type</TableHead>
              <TableHead className="text-white">Contact Info</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white">Last Updated</TableHead>
              <TableHead className="text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={index} className="border-[#404040] hover:bg-[#404040]">
                  <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-[100px]" /></TableCell>
                </TableRow>
              ))
            ) : filteredProviders.length === 0 ? (
              <TableRow className="border-[#404040] hover:bg-[#404040]">
                <TableCell colSpan={6} className="text-center text-[#A3A3A3] py-8">
                  No providers found
                </TableCell>
              </TableRow>
            ) : (
              filteredProviders.map((provider) => (
                <TableRow key={provider.id} className="border-[#404040] hover:bg-[#404040]">
                  <TableCell className="text-white">{provider.name}</TableCell>
                  <TableCell className="text-white">{provider.serviceType}</TableCell>
                  <TableCell className="text-white">
                    <div className="space-y-1">
                      <div className="text-sm">{provider.contactInfo.email}</div>
                      <div className="text-sm text-[#A3A3A3]">{provider.contactInfo.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={cn(getStatusBadgeColor(provider.status))}
                    >
                      {provider.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[#A3A3A3]">{provider.lastUpdated}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={updatingProvider === provider.id}
                          className="h-8 w-8 p-0 hover:bg-[#404040]"
                        >
                          {updatingProvider === provider.id ? (
                            <Skeleton className="h-4 w-4" />
                          ) : (
                            <MoreVertical className="h-4 w-4" />
                          )}
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 bg-[#2D2D2D] text-white border-[#404040]">
                        {provider.status !== "active" && (
                          <DropdownMenuItem
                            className="cursor-pointer hover:bg-[#404040]"
                            onClick={() => handleStatusChange(provider.id, "active")}
                          >
                            <Check className="mr-2 h-4 w-4 text-green-400" />
                            Activate
                          </DropdownMenuItem>
                        )}
                        {provider.status !== "inactive" && (
                          <DropdownMenuItem
                            className="cursor-pointer hover:bg-[#404040]"
                            onClick={() => openConfirmationDialog(provider.id, "deactivate", provider.name)}
                          >
                            <X className="mr-2 h-4 w-4 text-red-400" />
                            Deactivate
                          </DropdownMenuItem>
                        )}
                        {provider.status !== "suspended" && (
                          <DropdownMenuItem
                            className="cursor-pointer hover:bg-[#404040]"
                            onClick={() => openConfirmationDialog(provider.id, "suspend", provider.name)}
                          >
                            <AlertTriangle className="mr-2 h-4 w-4 text-orange-400" />
                            Suspend
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmationDialog.isOpen} onOpenChange={(open) => !open && setConfirmationDialog(prev => ({ ...prev, isOpen: false }))}>
        <DialogContent className="bg-[#2D2D2D] text-white border-[#404040]">
          <DialogHeader>
            <DialogTitle>
              {confirmationDialog.action === "deactivate" ? "Deactivate Provider" : "Suspend Provider"}
            </DialogTitle>
            <DialogDescription className="text-[#A3A3A3]">
              Are you sure you want to {confirmationDialog.action} {confirmationDialog.providerName}?
              {confirmationDialog.action === "suspend" && " This will temporarily prevent the provider from receiving new assignments."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmationDialog(prev => ({ ...prev, isOpen: false }))}
              className="bg-transparent text-white border-[#404040] hover:bg-[#404040]"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (confirmationDialog.providerId && confirmationDialog.action) {
                  handleStatusChange(
                    confirmationDialog.providerId,
                    confirmationDialog.action === "deactivate" ? "inactive" : "suspended"
                  );
                }
              }}
              className={cn(
                "text-white",
                confirmationDialog.action === "deactivate"
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-orange-500 hover:bg-orange-600"
              )}
            >
              {confirmationDialog.action === "deactivate" ? "Deactivate" : "Suspend"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pagination */}
      {!isLoading && filteredProviders.length > 0 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className={cn(
                  "bg-[#2D2D2D] text-white border-[#404040] hover:bg-[#404040]",
                  currentPage === 1 && "opacity-50 cursor-not-allowed"
                )}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    "bg-[#2D2D2D] text-white border-[#404040] hover:bg-[#404040]",
                    currentPage === page && "bg-[#3B82F6] text-white border-[#3B82F6]"
                  )}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className={cn(
                  "bg-[#2D2D2D] text-white border-[#404040] hover:bg-[#404040]",
                  currentPage === totalPages && "opacity-50 cursor-not-allowed"
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default ManageUtilityProviders; 