import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, PieChart, TrendingUp, Activity } from "lucide-react";
import { BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data for the charts
const monthlyReportsData = [
  { name: 'Jan', reports: 65 },
  { name: 'Feb', reports: 59 },
  { name: 'Mar', reports: 80 },
  { name: 'Apr', reports: 81 },
  { name: 'May', reports: 56 },
  { name: 'Jun', reports: 55 },
  { name: 'Jul', reports: 40 },
  { name: 'Aug', reports: 70 },
  { name: 'Sep', reports: 90 },
  { name: 'Oct', reports: 72 },
  { name: 'Nov', reports: 0 },
  { name: 'Dec', reports: 0 },
];

const categoryData = [
  { name: 'Water Issues', value: 40 },
  { name: 'Road Damage', value: 30 },
  { name: 'Electricity', value: 20 },
  { name: 'Telecom', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const HomeAnalytics = () => {
  // Calculate statistics
  const totalReports = monthlyReportsData.reduce((acc, item) => acc + item.reports, 0);
  const resolvedReports = 65;
  const pendingReports = 45;
  
  return (
    <section className="bg-[#0F172A] py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-white text-3xl font-bold mb-8 text-center">Community Impact Analytics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="bg-[#1E293B] border-[#334155] text-white">
            <CardHeader className="pb-2">
              <CardDescription className="text-white/70">Total Reports</CardDescription>
              <CardTitle className="text-2xl text-white">668</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="text-xs text-white/70 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-[#3B82F6]" />
                <span className="text-[#3B82F6] font-medium">12% increase</span> from last month
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1E293B] border-[#334155] text-white">
            <CardHeader className="pb-2">
              <CardDescription className="text-white/70">Resolved Reports</CardDescription>
              <CardTitle className="text-2xl text-white">65</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="text-xs text-white/70">
                <div className="w-full bg-[#0F172A] rounded-full h-2">
                  <div className="bg-[#3B82F6] h-2 rounded-full" style={{ width: '9.73054%' }}></div>
                </div>
                <div className="mt-1">10% resolution rate</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1E293B] border-[#334155] text-white">
            <CardHeader className="pb-2">
              <CardDescription className="text-white/70">Pending Reports</CardDescription>
              <CardTitle className="text-2xl text-white">45</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="text-xs text-white/70 flex items-center">
                <Activity className="h-3 w-3 mr-1 text-[#3B82F6]" />
                <span className="text-[#3B82F6] font-medium">8 reports</span> require attention
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-[#1E293B] border-[#334155] text-white">
            <CardHeader>
              <CardTitle className="text-lg flex items-center text-white">
                <BarChart3 className="h-5 w-5 mr-2" />
                Monthly Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyReportsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#ffffff80" />
                  <YAxis stroke="#ffffff80" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                      border: '1px solid #334155',
                      borderRadius: '4px',
                      color: 'white'
                    }} 
                  />
                  <Bar dataKey="reports" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1E293B] border-[#334155] text-white">
            <CardHeader>
              <CardTitle className="text-lg flex items-center text-white">
                <PieChart className="h-5 w-5 mr-2" />
                Reports by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                      border: '1px solid #334155',
                      borderRadius: '4px',
                      color: 'white'
                    }} 
                  />
                  <Legend formatter={(value) => <span style={{ color: 'white' }}>{value}</span>} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
