import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Search, Filter, CheckCircle2, Clock, 
  AlertCircle, Download, PlusCircle, Power,
  Edit, Trash2 
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const API_BASE_URL = 'http://localhost:8080';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface UtilityProvider {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  location: string;
  description: string;
  accountStatus: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  reports?: {
    id: string;
    title: string;
    location: string;
    status: string;
    priority: string;
    assignedDate: string;
    dueDate: string;
  }[];
  stats?: {
    assigned: number;
    inProgress: number;
    completed: number;
    overdue: number;
    avgResponseTime: string;
  };
}

export const UtilityProvidersDashboard = () => {
  const [providers, setProviders] = useState<UtilityProvider[]>([]);
  const [activeProvider, setActiveProvider] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [newProvider, setNewProvider] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    location: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch providers on component mount
  useEffect(() => {
    fetchUtilityProviders();
  }, []);

  const fetchUtilityProviders = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/ayto/utility-provider/all`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setProviders(response.data);
      if (response.data.length > 0) {
        setActiveProvider(response.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching providers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProvider = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/ayto/utility-provider/register`,
        newProvider,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      await fetchUtilityProviders();
      setNewProvider({
        name: '',
        email: '',
        phoneNumber: '',
        location: '',
        description: ''
      });
    } catch (error) {
      console.error('Error creating provider:', error);
    }
  };

  const toggleProviderStatus = async (providerId: string) => {
    try {
      await axios.put(
        `${API_BASE_URL}/ayto/utility-provider/${providerId}/delete`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      fetchUtilityProviders();
    } catch (error) {
      console.error('Error toggling provider status:', error);
    }
  };

  const currentProvider = providers.find(provider => provider.id === activeProvider);

  // Generate chart data from the selected provider's stats
  const chartData = currentProvider?.stats ? [
    { name: 'Assigned', value: currentProvider.stats.assigned || 0 },
    { name: 'In Progress', value: currentProvider.stats.inProgress || 0 },
    { name: 'Completed', value: currentProvider.stats.completed || 0 },
    { name: 'Overdue', value: currentProvider.stats.overdue || 0 },
  ] : [];

  // Filter reports based on search query
  const filteredReports = currentProvider?.reports?.filter(report => 
    report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.id.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Utility Providers Management</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Add New Utility Provider
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Register New Utility Provider</DialogTitle>
                  <DialogDescription>
                    Create a new utility provider account under your administration
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <Input 
                    placeholder="Provider Name" 
                    value={newProvider.name}
                    onChange={(e) => setNewProvider({...newProvider, name: e.target.value})}
                  />
                  <Input 
                    placeholder="Email" 
                    type="email"
                    value={newProvider.email}
                    onChange={(e) => setNewProvider({...newProvider, email: e.target.value})}
                  />
                  <Input 
                    placeholder="Phone Number" 
                    value={newProvider.phoneNumber}
                    onChange={(e) => setNewProvider({...newProvider, phoneNumber: e.target.value})}
                  />
                  <Input 
                    placeholder="Location" 
                    value={newProvider.location}
                    onChange={(e) => setNewProvider({...newProvider, location: e.target.value})}
                  />
                  <Input 
                    placeholder="Description" 
                    value={newProvider.description}
                    onChange={(e) => setNewProvider({...newProvider, description: e.target.value})}
                  />
                  <Button onClick={handleCreateProvider}>Create Provider</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading providers...</p>
            </div>
          ) : providers.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p>No utility providers found. Create your first provider.</p>
            </div>
          ) : (
            <>
              <Tabs value={activeProvider} onValueChange={setActiveProvider}>
                <TabsList className="grid grid-cols-4 mb-6">
                  {providers.map(provider => (
                    <TabsTrigger key={provider.id} value={provider.id}>
                      {provider.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Provider Information</h3>
                      <div className="space-y-2">
                        <p><strong>Email:</strong> {currentProvider?.email}</p>
                        <p><strong>Phone:</strong> {currentProvider?.phoneNumber}</p>
                        <p><strong>Location:</strong> {currentProvider?.location}</p>
                        <p><strong>Status:</strong> 
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                            currentProvider?.accountStatus === 'ACTIVE' 
                              ? 'bg-green-100 text-green-800' 
                              : currentProvider?.accountStatus === 'PENDING'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {currentProvider?.accountStatus}
                          </span>
                        </p>
                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => currentProvider && toggleProviderStatus(currentProvider.id)}
                          >
                            <Power className="h-4 w-4 mr-2" />
                            {currentProvider?.accountStatus === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Report Status Distribution</h3>
                      <Card>
                        <CardContent className="pt-6">
                          <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                              <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              >
                                {chartData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: 'rgba(23, 23, 23, 0.8)', 
                                  border: 'none',
                                  borderRadius: '4px',
                                  color: 'white'
                                }} 
                              />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Assigned Reports</h3>
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="search"
                            placeholder="Search reports..."
                            className="pl-8 w-[250px]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                        <Button variant="outline" className="gap-1">
                          <Filter className="h-4 w-4" />
                          Filter
                        </Button>
                        <Button variant="outline" className="gap-1">
                          <Download className="h-4 w-4" />
                          Export
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Assigned</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredReports.length > 0 ? (
                            filteredReports.map((report) => (
                              <TableRow key={report.id}>
                                <TableCell className="font-medium">{report.id}</TableCell>
                                <TableCell>{report.title}</TableCell>
                                <TableCell>{report.location}</TableCell>
                                <TableCell>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    report.status === 'Assigned' ? 'bg-blue-100 text-blue-800' :
                                    report.status === 'In Progress' ? 'bg-amber-100 text-amber-800' :
                                    report.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {report.status}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    report.priority === 'Urgent' ? 'bg-red-100 text-red-800' :
                                    report.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                                    report.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-blue-100 text-blue-800'
                                  }`}>
                                    {report.priority}
                                  </span>
                                </TableCell>
                                <TableCell>{report.assignedDate}</TableCell>
                                <TableCell>
                                  {new Date(report.dueDate) < new Date() ? (
                                    <span className="text-red-500 flex items-center">
                                      <AlertCircle className="h-3 w-3 mr-1" />
                                      {report.dueDate}
                                    </span>
                                  ) : (
                                    report.dueDate
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-2">
                                    <Button variant="outline" size="sm">View</Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className={`${
                                        report.status === 'Completed' ? 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100' : ''
                                      }`}
                                      disabled={report.status === 'Completed'}
                                    >
                                      {report.status === 'Completed' ? (
                                        <>
                                          <CheckCircle2 className="h-3 w-3 mr-1" />
                                          Completed
                                        </>
                                      ) : (
                                        <>
                                          <Clock className="h-3 w-3 mr-1" />
                                          Update
                                        </>
                                      )}
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                                No reports found. Try adjusting your search.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              </Tabs>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};