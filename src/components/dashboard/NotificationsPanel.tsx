import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const NotificationsPanel = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative bg-[#2D2D2D] hover:bg-[#404040] text-white"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#3B82F6] text-[10px] font-medium flex items-center justify-center">
            3
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 bg-[#2D2D2D] border-[#404040]">
        <div className="p-2">
          <h4 className="text-white font-medium mb-2">Notifications</h4>
          <div className="space-y-2">
            <DropdownMenuItem className="text-white hover:bg-[#404040] cursor-pointer">
              <div className="flex flex-col">
                <span className="font-medium">New Report</span>
                <span className="text-sm text-[#A3A3A3]">A new report has been submitted in your area</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white hover:bg-[#404040] cursor-pointer">
              <div className="flex flex-col">
                <span className="font-medium">Status Update</span>
                <span className="text-sm text-[#A3A3A3]">Your report #123 has been resolved</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white hover:bg-[#404040] cursor-pointer">
              <div className="flex flex-col">
                <span className="font-medium">New Comment</span>
                <span className="text-sm text-[#A3A3A3]">Someone commented on your report</span>
              </div>
            </DropdownMenuItem>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
