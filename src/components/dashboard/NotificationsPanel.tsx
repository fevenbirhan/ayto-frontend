import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { API_BASE_URL, fetchWithAuth } from "@/utils/api";

interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  recipientId: string;
  recipientType: string;
  type: string;
  reportId: string | null;
  read: boolean;
}

export const NotificationsPanel = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await fetchWithAuth(`${API_BASE_URL}/notifications/RESIDENT/unread`);
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative bg-[#2D2D2D] hover:bg-[#404040] text-white"
        >
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#3B82F6] text-[10px] font-medium flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 bg-[#2D2D2D] border-[#404040]">
        <div className="p-2">
          <h4 className="text-white font-medium mb-2">Notifications</h4>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {notifications.length === 0 ? (
              <div className="text-white text-sm text-center py-2">No new notifications</div>
            ) : (
              notifications.map((notification) => (
                <DropdownMenuItem 
                  key={notification.id}
                  className="text-white hover:bg-[#404040] cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{notification.title}</span>
                    <span className="text-sm text-[#A3A3A3]">{notification.message}</span>
                    <span className="text-xs text-[#A3A3A3] mt-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))
            )}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
