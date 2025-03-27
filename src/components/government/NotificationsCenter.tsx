
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Check, MessageSquare, ClipboardList } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock data for notifications
const notifications = [
  {
    id: "n1",
    type: "report",
    title: "New Report Submitted",
    description: "A new report for broken water pipe has been submitted.",
    time: "10 minutes ago",
    unread: true
  },
  {
    id: "n2",
    type: "assignment",
    title: "Report Assigned",
    description: "Report #1234 has been assigned to Water & Sewerage Authority.",
    time: "35 minutes ago",
    unread: true
  },
  {
    id: "n3",
    type: "message",
    title: "New Message",
    description: "Jane Smith commented on report #1234.",
    time: "1 hour ago",
    unread: false
  },
  {
    id: "n4",
    type: "status",
    title: "Status Update",
    description: "Report #1236 has been marked as In Progress by maintenance team.",
    time: "2 hours ago",
    unread: false
  },
  {
    id: "n5",
    type: "report",
    title: "New Report Submitted",
    description: "A new report for street light outage has been submitted.",
    time: "3 hours ago",
    unread: false
  },
  {
    id: "n6",
    type: "system",
    title: "System Maintenance",
    description: "Scheduled maintenance will occur tonight from 2AM to 4AM.",
    time: "5 hours ago",
    unread: false
  },
  {
    id: "n7",
    type: "assignment",
    title: "Report Assigned",
    description: "Report #1235 has been assigned to Power Corporation.",
    time: "6 hours ago",
    unread: false
  },
  {
    id: "n8",
    type: "status",
    title: "Status Update",
    description: "Report #1228 has been marked as Resolved by maintenance team.",
    time: "1 day ago",
    unread: false
  }
];

export const NotificationsCenter = () => {
  const [activeTab, setActiveTab] = React.useState("all");
  const unreadCount = notifications.filter(n => n.unread).length;
  
  const filteredNotifications = activeTab === "all" 
    ? notifications 
    : notifications.filter(n => n.type === activeTab);
  
  return (
    <Card className="w-[380px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Notifications
          </div>
          {unreadCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-1">
              {unreadCount} new
            </span>
          )}
        </CardTitle>
        <CardDescription>
          Stay updated on reports and assignments
        </CardDescription>
      </CardHeader>
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-2">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="report">Reports</TabsTrigger>
          <TabsTrigger value="assignment">Assigned</TabsTrigger>
          <TabsTrigger value="message">Messages</TabsTrigger>
        </TabsList>
      </Tabs>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="px-4">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`py-3 border-b last:border-0 ${notification.unread ? 'bg-muted/30' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 rounded-full p-1.5 ${
                      notification.type === 'report' ? 'bg-blue-100 text-blue-700' :
                      notification.type === 'assignment' ? 'bg-purple-100 text-purple-700' :
                      notification.type === 'message' ? 'bg-green-100 text-green-700' :
                      notification.type === 'status' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {notification.type === 'report' ? <ClipboardList className="h-4 w-4" /> :
                       notification.type === 'assignment' ? <Check className="h-4 w-4" /> :
                       notification.type === 'message' ? <MessageSquare className="h-4 w-4" /> :
                       <Bell className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {notification.title}
                        {notification.unread && (
                          <span className="ml-2 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                            New
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {notification.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
                <p>No notifications found</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-4">
        <Button variant="ghost" size="sm">
          Mark all as read
        </Button>
        <Button variant="ghost" size="sm">
          View all
        </Button>
      </CardFooter>
    </Card>
  );
};
