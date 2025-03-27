
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, Users, Bell } from "lucide-react";

export const FeedbackSection = () => {
  const [replyText, setReplyText] = useState("");
  
  // Mock data for government feedback and community discussions
  const governmentFeedback = [
    {
      id: 1,
      title: "Water Service Interruption",
      message: "There will be a scheduled water service interruption in the downtown area on July 15th from 10 PM to 4 AM for maintenance work. Please store water accordingly.",
      date: "2023-07-10",
      department: "Water Utility Department",
      hasReplied: true,
    },
    {
      id: 2,
      title: "Road Repairs on Main Street",
      message: "We've received multiple reports about the condition of Main Street. A repair crew has been scheduled to fix the potholes and resurface damaged sections starting next Monday.",
      date: "2023-07-05",
      department: "Public Works",
      hasReplied: false,
    },
  ];
  
  const communityDiscussions = [
    {
      id: 1,
      title: "Neighborhood Watch Program",
      author: "Sarah Johnson",
      message: "I'm interested in starting a neighborhood watch program in our area. Is anyone interested in joining? We could coordinate with local police and improve community safety.",
      date: "2023-07-08",
      replies: 12,
    },
    {
      id: 2,
      title: "Community Garden Proposal",
      author: "Mike Williams",
      message: "There's an empty lot on Cedar Street that could be perfect for a community garden. I've checked with the city, and they're open to community projects. Who would be interested in helping?",
      date: "2023-07-06",
      replies: 8,
    },
  ];
  
  const handleSubmitReply = (e: React.FormEvent, id: number) => {
    e.preventDefault();
    // In a real app, this would submit the reply to the backend
    console.log(`Replying to message ${id}: ${replyText}`);
    setReplyText("");
    alert("Your reply has been submitted.");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Government Feedback</h2>
        
        {governmentFeedback.map((item) => (
          <Card key={item.id} className="bg-[#18230F] dark:bg-gray-800 border-[#255F38] dark:border-gray-700 text-white">
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div>
                <CardTitle className="text-xl">{item.title}</CardTitle>
                <p className="text-sm text-white/70">
                  {item.department} • {new Date(item.date).toLocaleDateString()}
                </p>
              </div>
              <Bell className="h-5 w-5 text-[#6C7719] dark:text-[#255F38]" />
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white">{item.message}</p>
              
              {item.hasReplied ? (
                <div className="border-t border-[#255F38] dark:border-gray-700 pt-4 mt-4">
                  <p className="text-sm text-white/70">You have already replied to this message.</p>
                </div>
              ) : (
                <form onSubmit={(e) => handleSubmitReply(e, item.id)} className="border-t border-[#255F38] dark:border-gray-700 pt-4 mt-4">
                  <div className="space-y-3">
                    <label htmlFor={`reply-${item.id}`} className="text-sm font-medium text-white">
                      Reply to this notification:
                    </label>
                    <Textarea 
                      id={`reply-${item.id}`}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your response here..."
                      className="bg-[#1E2A13] dark:bg-gray-700 text-white border-[#255F38] dark:border-gray-600"
                    />
                    <div className="flex justify-end">
                      <Button 
                        type="submit" 
                        className="bg-[#6C7719] dark:bg-[#255F38] hover:bg-[#5a6415] dark:hover:bg-[#1e4a2b] text-white"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send Reply
                      </Button>
                    </div>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="space-y-6 pt-6 border-t border-[#255F38] dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Community Discussions</h2>
          <Button 
            className="bg-[#6C7719] dark:bg-[#255F38] hover:bg-[#5a6415] dark:hover:bg-[#1e4a2b] text-white"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Start New Discussion
          </Button>
        </div>
        
        {communityDiscussions.map((item) => (
          <Card key={item.id} className="bg-[#18230F] dark:bg-gray-800 border-[#255F38] dark:border-gray-700 text-white">
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div>
                <CardTitle className="text-xl">{item.title}</CardTitle>
                <p className="text-sm text-white/70">
                  Posted by {item.author} • {new Date(item.date).toLocaleDateString()}
                </p>
              </div>
              <Users className="h-5 w-5 text-[#6C7719] dark:text-[#255F38]" />
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white">{item.message}</p>
              
              <div className="flex justify-between items-center pt-4 border-t border-[#255F38] dark:border-gray-700">
                <span className="text-sm text-white/70">
                  {item.replies} replies
                </span>
                <Button 
                  className="bg-[#255F38] hover:bg-[#1e4a2b] text-white"
                >
                  View Discussion
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
