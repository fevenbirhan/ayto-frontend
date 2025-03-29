
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const NotificationsPanel = () => {
  const [unreadCount, setUnreadCount] = useState(3);
  
  // Mock notifications data
  const notifications = [
    {
      id: 1,
      message: "Your report 'Pothole on Main Street' status changed to 'In Progress'",
      date: "10 minutes ago",
      isUnread: true
    },
    {
      id: 2,
      message: "The municipality has responded to your report about the broken street light",
      date: "2 hours ago",
      isUnread: true
    },
    {
      id: 3,
      message: "Your report 'Overflowing Trash Bin' has been resolved",
      date: "Yesterday",
      isUnread: true
    },
    {
      id: 4,
      message: "Community update: Road construction scheduled next week on Oak Avenue",
      date: "2 days ago",
      isUnread: false
    },
    {
      id: 5,
      message: "5 residents upvoted your report about the damaged sidewalk",
      date: "3 days ago",
      isUnread: false
    }
  ];
  
  const markAllAsRead = () => {
    setUnreadCount(0);
    // In a real app, this would update the read status in the database
  };
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="relative border-[#255F38] dark:border-gray-700 text-white hover:bg-[#255F38]/20 dark:hover:bg-gray-700/50"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-0 bg-[#18230F] dark:bg-gray-800 border-[#255F38] dark:border-gray-700 text-white"
        align="end"
      >
        <div className="flex items-center justify-between p-4 border-b border-[#255F38] dark:border-gray-700">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="link" 
              className="text-[#6C7719] dark:text-[#255F38] h-auto p-0"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        
        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-white/60">
              <p>No notifications yet</p>
            </div>
          ) : (
            <div>
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-3 border-b border-[#255F38] dark:border-gray-700 hover:bg-[#255F38]/10 dark:hover:bg-gray-700/50 cursor-pointer ${
                    notification.isUnread ? "bg-[#255F38]/5 dark:bg-gray-700/30" : ""
                  }`}
                >
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-white/60 mt-1">{notification.date}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-3 border-t border-[#255F38] dark:border-gray-700 text-center">
          <Button 
            variant="link" 
            className="text-[#6C7719] dark:text-[#255F38] h-auto p-0"
          >
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
