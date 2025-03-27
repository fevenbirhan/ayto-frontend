
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  UserCog, 
  Users, 
  ShieldCheck, 
  KeyRound, 
  Bell, 
  Mail, 
  Smartphone, 
  Globe, 
  HelpCircle,
  Save
} from "lucide-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data for users
const users = [
  { id: 1, name: "Admin User", email: "admin@example.com", role: "Administrator", status: "Active", lastActive: "Today" },
  { id: 2, name: "Department Manager", email: "manager@example.com", role: "Department Manager", status: "Active", lastActive: "Yesterday" },
  { id: 3, name: "Support Staff", email: "staff@example.com", role: "Support Staff", status: "Active", lastActive: "3 days ago" },
  { id: 4, name: "Maintenance Manager", email: "maintenance@example.com", role: "Maintenance Manager", status: "Inactive", lastActive: "2 weeks ago" },
  { id: 5, name: "New Hire", email: "newhire@example.com", role: "Support Staff", status: "Pending", lastActive: "Never" },
];

export const AdminSettings = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="users">
        <TabsList className="mb-6">
          <TabsTrigger value="users" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            Users & Roles
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-1">
            <ShieldCheck className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-1">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-1">
            <Globe className="h-4 w-4" />
            System Settings
          </TabsTrigger>
          <TabsTrigger value="help" className="flex items-center gap-1">
            <HelpCircle className="h-4 w-4" />
            Help & Support
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage user accounts and roles</CardDescription>
                </div>
                <Button>
                  <UserCog className="h-4 w-4 mr-2" />
                  Add New User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Select defaultValue={user.role}>
                            <SelectTrigger className="h-8 w-[180px]">
                              <SelectValue placeholder={user.role} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Administrator">Administrator</SelectItem>
                              <SelectItem value="Department Manager">Department Manager</SelectItem>
                              <SelectItem value="Maintenance Manager">Maintenance Manager</SelectItem>
                              <SelectItem value="Support Staff">Support Staff</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.status === 'Active' ? 'bg-green-100 text-green-800' :
                            user.status === 'Inactive' ? 'bg-gray-100 text-gray-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {user.status}
                          </span>
                        </TableCell>
                        <TableCell>{user.lastActive}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="outline" size="sm">Reset Password</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage account security and authentication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Password Policy</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="min-length">Minimum Password Length</Label>
                      <Input id="min-length" type="number" className="w-20" defaultValue={8} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="require-uppercase">Require Uppercase Letters</Label>
                      <Switch id="require-uppercase" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="require-numbers">Require Numbers</Label>
                      <Switch id="require-numbers" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="require-symbols">Require Symbols</Label>
                      <Switch id="require-symbols" defaultChecked />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password-expiry">Password Expiry (days)</Label>
                      <Input id="password-expiry" type="number" className="w-20" defaultValue={90} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enforce-history">Enforce Password History</Label>
                      <Input id="enforce-history" type="number" className="w-20" defaultValue={3} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="account-lockout">Account Lockout Threshold</Label>
                      <Input id="account-lockout" type="number" className="w-20" defaultValue={5} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="lockout-duration">Lockout Duration (minutes)</Label>
                      <Input id="lockout-duration" type="number" className="w-20" defaultValue={30} />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="require-2fa">Require 2FA for All Users</Label>
                      <p className="text-sm text-muted-foreground">Enforce two-factor authentication for enhanced security</p>
                    </div>
                    <Switch id="require-2fa" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="allow-sms">Allow SMS Authentication</Label>
                      <p className="text-sm text-muted-foreground">Enable SMS as a 2FA method</p>
                    </div>
                    <Switch id="allow-sms" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="allow-app">Allow Authenticator App</Label>
                      <p className="text-sm text-muted-foreground">Enable authenticator apps as a 2FA method</p>
                    </div>
                    <Switch id="allow-app" defaultChecked />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Session Management</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                    <Input id="session-timeout" type="number" className="w-20" defaultValue={60} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="concurrent-sessions">Allow Concurrent Sessions</Label>
                      <p className="text-sm text-muted-foreground">Allow users to be logged in from multiple devices</p>
                    </div>
                    <Switch id="concurrent-sessions" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enforce-logout">Enforce Logout on Browser Close</Label>
                      <p className="text-sm text-muted-foreground">Automatically log users out when they close their browser</p>
                    </div>
                    <Switch id="enforce-logout" />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Security Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure system and personal notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Notifications</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="new-reports">New Report Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive email alerts when new reports are submitted</p>
                    </div>
                    <Switch id="new-reports" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="report-updates">Report Status Updates</Label>
                      <p className="text-sm text-muted-foreground">Receive email alerts when report statuses change</p>
                    </div>
                    <Switch id="report-updates" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="resident-messages">Resident Messages</Label>
                      <p className="text-sm text-muted-foreground">Get notified when residents send messages or comments</p>
                    </div>
                    <Switch id="resident-messages" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="assignment-notifications">Assignment Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications when reports are assigned to your department</p>
                    </div>
                    <Switch id="assignment-notifications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="system-updates">System Updates</Label>
                      <p className="text-sm text-muted-foreground">Get notified about system maintenance and updates</p>
                    </div>
                    <Switch id="system-updates" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">In-App Notifications</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="in-app-new-reports">New Report Alerts</Label>
                      <p className="text-sm text-muted-foreground">Show in-app alerts for new reports</p>
                    </div>
                    <Switch id="in-app-new-reports" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="in-app-status-updates">Status Change Alerts</Label>
                      <p className="text-sm text-muted-foreground">Show in-app alerts when report statuses change</p>
                    </div>
                    <Switch id="in-app-status-updates" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="in-app-messages">Message Alerts</Label>
                      <p className="text-sm text-muted-foreground">Show in-app alerts for new messages</p>
                    </div>
                    <Switch id="in-app-messages" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="in-app-assignments">Assignment Alerts</Label>
                      <p className="text-sm text-muted-foreground">Show in-app alerts for new assignments</p>
                    </div>
                    <Switch id="in-app-assignments" defaultChecked />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">SMS Notifications</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sms-urgent">Urgent Report Alerts</Label>
                      <p className="text-sm text-muted-foreground">Receive SMS for urgent priority reports only</p>
                    </div>
                    <Switch id="sms-urgent" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sms-maintenance">Maintenance Team Updates</Label>
                      <p className="text-sm text-muted-foreground">Receive SMS when maintenance teams update their status</p>
                    </div>
                    <Switch id="sms-maintenance" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Schedule</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="notification-hours">Daily Notification Hours</Label>
                    <div className="flex items-center gap-2">
                      <Select defaultValue="7">
                        <SelectTrigger className="w-20">
                          <SelectValue placeholder="From" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }).map((_, i) => (
                            <SelectItem key={i} value={i.toString()}>{i}:00</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <span>to</span>
                      <Select defaultValue="19">
                        <SelectTrigger className="w-20">
                          <SelectValue placeholder="To" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }).map((_, i) => (
                            <SelectItem key={i} value={i.toString()}>{i}:00</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <p className="text-sm text-muted-foreground">Notifications will only be sent during these hours</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="weekend-notifications">Weekend Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications on weekends</p>
                      </div>
                      <Switch id="weekend-notifications" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="digest-mode">Enable Digest Mode</Label>
                        <p className="text-sm text-muted-foreground">Combine multiple notifications into a single digest</p>
                      </div>
                      <Switch id="digest-mode" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="digest-frequency">Digest Frequency</Label>
                      <Select defaultValue="daily">
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Notification Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configure general system settings and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Regional Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="EAT">
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EAT">East Africa Time (EAT)</SelectItem>
                        <SelectItem value="CAT">Central Africa Time (CAT)</SelectItem>
                        <SelectItem value="WAT">West Africa Time (WAT)</SelectItem>
                        <SelectItem value="UTC">Coordinated Universal Time (UTC)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="am">Amharic</SelectItem>
                        <SelectItem value="or">Oromo</SelectItem>
                        <SelectItem value="ti">Tigrinya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date-format">Date Format</Label>
                    <Select defaultValue="DMY">
                      <SelectTrigger>
                        <SelectValue placeholder="Select date format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DMY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MDY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="YMD">YYYY/MM/DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time-format">Time Format</Label>
                    <Select defaultValue="24">
                      <SelectTrigger>
                        <SelectValue placeholder="Select time format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12">12-hour (AM/PM)</SelectItem>
                        <SelectItem value="24">24-hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Report Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="auto-assign">Auto-Assign Reports</Label>
                    <Select defaultValue="category">
                      <SelectTrigger>
                        <SelectValue placeholder="Select assignment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual Assignment Only</SelectItem>
                        <SelectItem value="category">Auto-Assign by Category</SelectItem>
                        <SelectItem value="location">Auto-Assign by Location</SelectItem>
                        <SelectItem value="loadbalance">Load-Balanced Assignment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="default-priority">Default Priority</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger>
                        <SelectValue placeholder="Select default priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="require-approval">Require Approval Before Assignment</Label>
                        <p className="text-sm text-muted-foreground">Reports must be approved before being assigned</p>
                      </div>
                      <Switch id="require-approval" defaultChecked />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="allow-resident-edit">Allow Resident Edits</Label>
                        <p className="text-sm text-muted-foreground">Residents can edit reports after submission</p>
                      </div>
                      <Switch id="allow-resident-edit" defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">System Maintenance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="data-retention">Data Retention Period (months)</Label>
                    <Input id="data-retention" type="number" defaultValue={36} />
                    <p className="text-sm text-muted-foreground">Keep resolved reports for this many months</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="backup-frequency">Automatic Backup Frequency</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger>
                        <SelectValue placeholder="Select backup frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <div className="flex justify-between">
                      <Button variant="outline" className="gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-hard-drive-download"><path d="M12 2v8"/><path d="m16 6-4 4-4-4"/><rect x="2" y="14" width="20" height="8" rx="2"/><path d="M6 18h.01"/><path d="M10 18h.01"/></svg>
                        Backup System Now
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bar-chart-big"><path d="M3 3v18h18"/><rect x="7" y="10" width="4" height="8"/><rect x="15" y="6" width="4" height="12"/></svg>
                        Generate System Report
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button className="gap-2">
                  <Save className="h-4 w-4" />
                  Save System Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="help">
          <Card>
            <CardHeader>
              <CardTitle>Help & Support</CardTitle>
              <CardDescription>Access documentation and support resources</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open mr-2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                      User Guide
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Comprehensive guides for using the Government Dashboard
                    </p>
                    <Button className="w-full">Access Documentation</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-video mr-2"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
                      Video Tutorials
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Step-by-step video guides for common tasks
                    </p>
                    <Button className="w-full">View Tutorials</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-headphones mr-2"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg>
                      Contact Support
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Get help from our technical support team
                    </p>
                    <Button className="w-full">Contact Support</Button>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  <div className="border rounded-md p-4">
                    <h4 className="font-medium mb-2">How do I assign a report to a specific department?</h4>
                    <p className="text-sm text-muted-foreground">
                      From the Incoming Queue tab, click on the "Assign" button next to a report. 
                      In the assignment panel, you can select the appropriate department or 
                      maintenance team and set the priority level before confirming the assignment.
                    </p>
                  </div>
                  <div className="border rounded-md p-4">
                    <h4 className="font-medium mb-2">How can I generate performance reports?</h4>
                    <p className="text-sm text-muted-foreground">
                      Navigate to the Analytics Dashboard tab where you can view various 
                      performance metrics. Use the Export button to download reports in 
                      various formats for further analysis or sharing with stakeholders.
                    </p>
                  </div>
                  <div className="border rounded-md p-4">
                    <h4 className="font-medium mb-2">How do I add a new user to the system?</h4>
                    <p className="text-sm text-muted-foreground">
                      Go to the Admin tab, then select Users & Roles. Click the "Add New User" 
                      button and fill out the required information. You can set their role, 
                      permissions, and initial password. The new user will receive an email 
                      with instructions to access their account.
                    </p>
                  </div>
                  <div className="border rounded-md p-4">
                    <h4 className="font-medium mb-2">Can I communicate directly with residents?</h4>
                    <p className="text-sm text-muted-foreground">
                      Yes, when viewing a report's details, select the Communication tab 
                      where you can send messages to the resident who submitted the report. 
                      They will be notified by email and can respond through their dashboard.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button variant="outline" className="gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-question"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><path d="M10 10.3c.2-.4.5-.8.9-1a2.1 2.1 0 0 1 2.6.4c.3.4.5.8.5 1.3 0 1.3-2 2-2 2"/><path d="M12 17h.01"/></svg>
                  View All FAQs
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
