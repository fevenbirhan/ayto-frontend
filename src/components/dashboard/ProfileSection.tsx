
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { User, History, LogOut } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const ProfileSection = () => {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [phone, setPhone] = useState("(555) 123-4567");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update the user's profile
    alert("Profile updated successfully!");
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    // In a real app, this would update the user's password
    alert("Password changed successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleLogout = () => {
    // In a real app, this would log the user out
    window.location.href = "/login";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-1 bg-[#18230F] dark:bg-gray-800 border-[#255F38] dark:border-gray-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">Profile Settings</CardTitle>
            <User className="h-5 w-5 text-[#6C7719] dark:text-[#255F38]" />
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="bg-[#1E2A13] dark:bg-gray-700 border border-[#255F38] dark:border-gray-600 p-1 mb-4">
                <TabsTrigger 
                  value="personal" 
                  className="data-[state=active]:bg-[#255F38] data-[state=active]:text-white text-white/70"
                >
                  Personal Info
                </TabsTrigger>
                <TabsTrigger 
                  value="security" 
                  className="data-[state=active]:bg-[#255F38] data-[state=active]:text-white text-white/70"
                >
                  Security
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-[#1E2A13] dark:bg-gray-700 text-white border-[#255F38] dark:border-gray-600"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-[#1E2A13] dark:bg-gray-700 text-white border-[#255F38] dark:border-gray-600"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-[#1E2A13] dark:bg-gray-700 text-white border-[#255F38] dark:border-gray-600"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-[#6C7719] dark:bg-[#255F38] hover:bg-[#5a6415] dark:hover:bg-[#1e4a2b] text-white"
                  >
                    Update Profile
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="security">
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="bg-[#1E2A13] dark:bg-gray-700 text-white border-[#255F38] dark:border-gray-600"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="bg-[#1E2A13] dark:bg-gray-700 text-white border-[#255F38] dark:border-gray-600"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-[#1E2A13] dark:bg-gray-700 text-white border-[#255F38] dark:border-gray-600"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-[#6C7719] dark:bg-[#255F38] hover:bg-[#5a6415] dark:hover:bg-[#1e4a2b] text-white"
                  >
                    Change Password
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 pt-6 border-t border-[#255F38] dark:border-gray-700">
              <Button 
                onClick={handleLogout} 
                variant="outline" 
                className="w-full border-[#255F38] dark:border-gray-700 text-white hover:bg-[#255F38]/20 dark:hover:bg-gray-700/50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1 bg-[#18230F] dark:bg-gray-800 border-[#255F38] dark:border-gray-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">Submission History</CardTitle>
            <History className="h-5 w-5 text-[#6C7719] dark:text-[#255F38]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-white/70 dark:text-gray-300">
                Your recent activity and submissions across the platform.
              </p>
              
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div 
                    key={item} 
                    className="p-3 rounded-md bg-[#1E2A13] dark:bg-gray-700 border border-[#255F38] dark:border-gray-600"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Pothole on Main Street</h4>
                        <p className="text-xs text-white/70 dark:text-gray-300">
                          Submitted on {new Date().toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        item === 1 ? "bg-yellow-600/20 text-yellow-400" : 
                        item === 2 ? "bg-green-600/20 text-green-400" : 
                        "bg-blue-600/20 text-blue-400"
                      }`}>
                        {item === 1 ? "Pending" : item === 2 ? "Resolved" : "In Progress"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button 
                variant="outline" 
                className="w-full border-[#255F38] dark:border-gray-700 text-white hover:bg-[#255F38]/20 dark:hover:bg-gray-700/50"
                onClick={() => document.getElementById("reports-tab")?.click()}
              >
                View All Reports
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
