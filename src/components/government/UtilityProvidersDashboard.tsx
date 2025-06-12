import React, { useState, useEffect, useContext } from "react";
import axios from 'axios';
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/context/AuthContext";
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card";
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
  Edit, Trash2, HardHat, Activity, Zap, Droplets 
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const API_BASE_URL = 'http://localhost:8080';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Translation dictionaries
const translations = {
  en: {
    utilityProvidersManagement: "Utility Providers Management",
    manageUtilityProvidersDescription: "Manage all utility providers under your administration",
    addNewUtilityProvider: "Add New Utility Provider",
    registerNewUtilityProvider: "Register New Utility Provider",
    createProviderDescription: "Create a new utility provider account under your administration",
    providerName: "Provider Name",
    email: "Email",
    phoneNumber: "Phone Number",
    location: "Location",
    description: "Description",
    createProvider: "Create Provider",
    providerInformation: "Provider Information",
    status: "Status",
    edit: "Edit",
    deactivate: "Deactivate",
    activate: "Activate",
    reportStatusDistribution: "Report Status Distribution",
    averageResponseTime: "Average response time",
    assignedReports: "Assigned Reports",
    searchReports: "Search reports...",
    filter: "Filter",
    export: "Export",
    id: "ID",
    title: "Title",
    priority: "Priority",
    assigned: "Assigned",
    dueDate: "Due Date",
    actions: "Actions",
    noReportsFound: "No reports found. Try adjusting your search.",
    noUtilityProvidersFound: "No utility providers found",
    createFirstProvider: "Create your first provider",
    electricity: "Electricity",
    water: "Water",
    internet: "Internet",
    waste: "Waste",
    view: "View",
    update: "Update",
    completed: "Completed",
    assignedStatus: "Assigned",
    inProgress: "In Progress",
    completedStatus: "Completed",
    overdue: "Overdue"
  },
  am: {
    utilityProvidersManagement: "የተጠቃሚ አገልግሎት አቅራቢዎች አስተዳደር",
    manageUtilityProvidersDescription: "በእርስዎ አስተዳደር ስር ያሉ ሁሉንም የተጠቃሚ አገልግሎት አቅራቢዎች ያስተዳድሩ",
    addNewUtilityProvider: "አዲስ የተጠቃሚ አገልግሎት አቅራቢ ያክሉ",
    registerNewUtilityProvider: "አዲስ የተጠቃሚ አገልግሎት አቅራቢ ይመዝግቡ",
    createProviderDescription: "በእርስዎ አስተዳደር ስር አዲስ የተጠቃሚ አገልግሎት አቅራቢ መለያ ይፍጠሩ",
    providerName: "የአቅራቢው �ስም",
    email: "ኢሜይል",
    phoneNumber: "ስልክ ቁጥር",
    location: "አካባቢ",
    description: "መግለጫ",
    createProvider: "አቅራቢ ይፍጠሩ",
    providerInformation: "የአቅራቢው መረጃ",
    status: "ሁኔታ",
    edit: "አርትዕ",
    deactivate: "እንቅስቃሴ አቁም",
    activate: "እንቅስቃሴ ጀምር",
    reportStatusDistribution: "የሪፖርት ሁኔታ ስርጭት",
    averageResponseTime: "አማካይ የምላሽ ጊዜ",
    assignedReports: "የተመደቡ ሪፖርቶች",
    searchReports: "ሪፖርቶችን ይፈልጉ...",
    filter: "አጣራ",
    export: "ወደ ውጪ ላክ",
    id: "መለያ",
    title: "ርዕስ",
    priority: "ቅድሚያ",
    assigned: "የተመደበ",
    dueDate: "የመጨረሻ ቀን",
    actions: "ድርጊቶች",
    noReportsFound: "ምንም ሪፖርት አልተገኘም። የፈለጉትን ይለውጡ።",
    noUtilityProvidersFound: "ምንም የተጠቃሚ አገልግሎት አቅራቢዎች አልተገኙም",
    createFirstProvider: "የመጀመሪያዎትን አቅራቢ ይፍጠሩ",
    electricity: "ኤሌክትሪክ",
    water: "ውሃ",
    internet: "ኢንተርኔት",
    waste: "አገልግሎት ቆሻሻ",
    view: "ይመልከቱ",
    update: "አዘምን",
    completed: "ተጠናቅቋል",
    assignedStatus: "ተመድቧል",
    inProgress: "በሂደት ላይ",
    completedStatus: "ተጠናቅቋል",
    overdue: "ያለቀ"
  }
};

interface UtilityProvider {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  location: string;
  description: string;
  accountStatus: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  providerType?: 'ELECTRICITY' | 'WATER' | 'INTERNET' | 'WASTE';
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
  const { theme } = useTheme();
  const { language } = useAuth();
  const [providers, setProviders] = useState<UtilityProvider[]>([]);
  const [activeProvider, setActiveProvider] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [newProvider, setNewProvider] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    location: '',
    description: '',
    providerType: 'ELECTRICITY'
  });
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to get translations
  const t = (key: keyof typeof translations.en) => {
    return translations[language][key] || translations.en[key];
  };

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
        description: '',
        providerType: 'ELECTRICITY'
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
    { name: t('assignedStatus'), value: currentProvider.stats.assigned || 0 },
    { name: t('inProgress'), value: currentProvider.stats.inProgress || 0 },
    { name: t('completedStatus'), value: currentProvider.stats.completed || 0 },
    { name: t('overdue'), value: currentProvider.stats.overdue || 0 },
  ] : [];

  // Filter reports based on search query
  const filteredReports = currentProvider?.reports?.filter(report => 
    report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.id.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const getProviderIcon = (type?: string) => {
    switch(type) {
      case 'ELECTRICITY': return <Zap className="h-4 w-4" />;
      case 'WATER': return <Droplets className="h-4 w-4" />;
      case 'WASTE': return <Trash2 className="h-4 w-4" />;
      default: return <HardHat className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'ACTIVE': return 'bg-green-500/20 text-green-600';
      case 'PENDING': return 'bg-yellow-500/20 text-yellow-600';
      case 'INACTIVE': return 'bg-red-500/20 text-red-600';
      default: return 'bg-gray-500/20 text-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'Urgent': return 'bg-red-500/20 text-red-600';
      case 'High': return 'bg-orange-500/20 text-orange-600';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-600';
      default: return 'bg-blue-500/20 text-blue-600';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold">
                {t('utilityProvidersManagement')}
              </CardTitle>
              <CardDescription>
                {t('manageUtilityProvidersDescription')}
              </CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  {t('addNewUtilityProvider')}
                </Button>
              </DialogTrigger>
              <DialogContent className={theme === 'dark' ? 'bg-gray-900' : ''}>
                <DialogHeader>
                  <DialogTitle>{t('registerNewUtilityProvider')}</DialogTitle>
                  <DialogDescription>
                    {t('createProviderDescription')}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input 
                      placeholder={t('providerName')} 
                      value={newProvider.name}
                      onChange={(e) => setNewProvider({...newProvider, name: e.target.value})}
                    />
                    <Input 
                      placeholder={t('email')} 
                      type="email"
                      value={newProvider.email}
                      onChange={(e) => setNewProvider({...newProvider, email: e.target.value})}
                    />
                    <Input 
                      placeholder={t('phoneNumber')} 
                      value={newProvider.phoneNumber}
                      onChange={(e) => setNewProvider({...newProvider, phoneNumber: e.target.value})}
                    />
                    <Input 
                      placeholder={t('location')} 
                      value={newProvider.location}
                      onChange={(e) => setNewProvider({...newProvider, location: e.target.value})}
                    />
                  </div>
                  <Input 
                    placeholder={t('description')} 
                    value={newProvider.description}
                    onChange={(e) => setNewProvider({...newProvider, description: e.target.value})}
                  />
                  <select
                    value={newProvider.providerType}
                    onChange={(e) => setNewProvider({...newProvider, providerType: e.target.value as any})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="ELECTRICITY">{t('electricity')}</option>
                    <option value="WATER">{t('water')}</option>
                    <option value="INTERNET">{t('internet')}</option>
                    <option value="WASTE">{t('waste')}</option>
                  </select>
                  <Button onClick={handleCreateProvider}>{t('createProvider')}</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid gap-6">
              <div className="flex space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-10 w-full rounded-md" />
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-64 rounded-md" />
                <Skeleton className="h-64 rounded-md" />
              </div>
              <Skeleton className="h-96 rounded-md" />
            </div>
          ) : providers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <HardHat className="h-12 w-12 text-muted-foreground" />
              <p className="text-lg text-muted-foreground">
                {t('noUtilityProvidersFound')}
              </p>
              <p className="text-sm text-muted-foreground">
                {t('createFirstProvider')}
              </p>
            </div>
          ) : (
            <>
              <Tabs value={activeProvider} onValueChange={setActiveProvider}>
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6 bg-transparent gap-2">
                  {providers.map(provider => (
                    <TabsTrigger 
                      key={provider.id} 
                      value={provider.id}
                      className="data-[state=active]:shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        {getProviderIcon(provider.providerType)}
                        <span className="truncate">{provider.name}</span>
                      </div>
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-background">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Activity className="h-5 w-5" />
                          {t('providerInformation')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-muted-foreground">{t('email')}</span>
                            <span>{currentProvider?.email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-muted-foreground">{t('phoneNumber')}</span>
                            <span>{currentProvider?.phoneNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-muted-foreground">{t('location')}</span>
                            <span>{currentProvider?.location}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-muted-foreground">{t('status')}</span>
                            <Badge className={getStatusColor(currentProvider?.accountStatus || '')}>
                              {currentProvider?.accountStatus}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" size="sm" className="gap-1">
                            <Edit className="h-4 w-4" />
                            {t('edit')}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="gap-1"
                            onClick={() => currentProvider && toggleProviderStatus(currentProvider.id)}
                          >
                            <Power className="h-4 w-4" />
                            {currentProvider?.accountStatus === 'ACTIVE' ? t('deactivate') : t('activate')}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-background">
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {t('reportStatusDistribution')}
                        </CardTitle>
                        {currentProvider?.stats && (
                          <CardDescription>
                            {t('averageResponseTime')}: {currentProvider.stats.avgResponseTime}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="h-[200px]">
                          <ResponsiveContainer width="100%" height="100%">
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
                                  backgroundColor: theme === 'dark' ? 'hsl(240, 10%, 10%)' : 'hsl(0, 0%, 100%)',
                                  borderColor: theme === 'dark' ? 'hsl(240, 10%, 20%)' : 'hsl(0, 0%, 90%)',
                                  borderRadius: '6px',
                                  color: theme === 'dark' ? 'hsl(0, 0%, 90%)' : 'hsl(240, 10%, 10%)'
                                }} 
                              />
                              <Legend 
                                wrapperStyle={{
                                  paddingTop: '20px'
                                }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <HardHat className="h-5 w-5" />
                        {t('assignedReports')}
                      </h3>
                      <div className="flex flex-col sm:flex-row items-center gap-2">
                        <div className="relative w-full sm:w-[250px]">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="search"
                            placeholder={t('searchReports')}
                            className="pl-8 w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                        <Button variant="outline" className="gap-1">
                          <Filter className="h-4 w-4" />
                          {t('filter')}
                        </Button>
                        <Button variant="outline" className="gap-1">
                          <Download className="h-4 w-4" />
                          {t('export')}
                        </Button>
                      </div>
                    </div>
                    
                    <Card className="border-0 shadow-sm">
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader className={theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}>
                            <TableRow>
                              <TableHead>{t('id')}</TableHead>
                              <TableHead>{t('title')}</TableHead>
                              <TableHead>{t('location')}</TableHead>
                              <TableHead>{t('status')}</TableHead>
                              <TableHead>{t('priority')}</TableHead>
                              <TableHead>{t('assigned')}</TableHead>
                              <TableHead>{t('dueDate')}</TableHead>
                              <TableHead>{t('actions')}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredReports.length > 0 ? (
                              filteredReports.map((report) => (
                                <TableRow key={report.id} className="hover:bg-muted/50">
                                  <TableCell className="font-medium">{report.id}</TableCell>
                                  <TableCell>{report.title}</TableCell>
                                  <TableCell>{report.location}</TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className="capitalize">
                                      {report.status.toLowerCase()}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className={getPriorityColor(report.priority)}>
                                      {report.priority}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>{report.assignedDate}</TableCell>
                                  <TableCell>
                                    {new Date(report.dueDate) < new Date() ? (
                                      <Badge variant="destructive" className="gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {report.dueDate}
                                      </Badge>
                                    ) : (
                                      <span>{report.dueDate}</span>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex gap-2">
                                      <Button variant="outline" size="sm">{t('view')}</Button>
                                      <Button 
                                        variant={report.status === 'Completed' ? 'secondary' : 'outline'}
                                        size="sm" 
                                        className="gap-1"
                                        disabled={report.status === 'Completed'}
                                      >
                                        {report.status === 'Completed' ? (
                                          <>
                                            <CheckCircle2 className="h-3 w-3" />
                                            {t('completed')}
                                          </>
                                        ) : (
                                          <>
                                            <Clock className="h-3 w-3" />
                                            {t('update')}
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
                                  {t('noReportsFound')}
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </Card>
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