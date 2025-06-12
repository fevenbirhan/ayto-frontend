import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, PieChart, TrendingUp, Activity, Languages, Sun, Moon } from "lucide-react";

import { BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

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

// Translation content
const translations = {
  en: {
    title: "Community Impact Analytics",
    totalReports: "Total Reports",
    resolvedReports: "Resolved Reports",
    pendingReports: "Pending Reports",
    increase: "increase",
    fromLastMonth: "from last month",
    resolutionRate: "resolution rate",
    requireAttention: "require attention",
    monthlyReports: "Monthly Reports",
    reportsByCategory: "Reports by Category",
    reports: "reports",
    waterIssues: "Water Issues",
    roadDamage: "Road Damage",
    electricity: "Electricity",
    telecom: "Telecom"
  },
  am: {
    title: "የማህበረሰብ ተጽእኖ ትንተና",
    totalReports: "ጠቅላላ ሪፖርቶች",
    resolvedReports: "የተፈቱ ሪፖርቶች",
    pendingReports: "በጥበቃ ላይ ያሉ ሪፖርቶች",
    increase: "ጭማሪ",
    fromLastMonth: "ካለፈው ወር",
    resolutionRate: "የፍትህ መጠን",
    requireAttention: "ትኩረት ያስፈልጋል",
    monthlyReports: "ወርሃዊ ሪፖርቶች",
    reportsByCategory: "በምድብ የተከፋፈሉ ሪፖርቶች",
    reports: "ሪፖርቶች",
    waterIssues: "የውሃ ጉዳዮች",
    roadDamage: "የመንገድ ጉዳት",
    electricity: "ኤሌክትሪክ",
    telecom: "ቴሊኮም"
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const chartVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: "anticipate"
    }
  }
};

export const HomeAnalytics = () => {
  const { theme, toggleTheme} = useTheme();
  const { language, setLanguage } = useAuth();
  
  const t = translations[language];
  const darkMode = theme === "dark";
  
  // Calculate statistics
  const totalReports = monthlyReportsData.reduce((acc, item) => acc + item.reports, 0);
  const resolvedReports = 65;
  const pendingReports = 45;
  
  const toggleDarkMode = toggleTheme;
  const toggleLanguage = () => setLanguage(language === 'en' ? 'am' : 'en');
  
  const bgColor = darkMode ? 'bg-[#0F172A]' : 'bg-gradient-to-br from-blue-50 to-purple-50';
  const cardBg = darkMode ? 'bg-[#1E293B]' : 'bg-white';
  const cardBorder = darkMode ? 'border-[#334155]' : 'border-gray-200';
  const textColor = darkMode ? 'text-white' : 'text-gray-800';
  const subtextColor = darkMode ? 'text-white/70' : 'text-gray-500';
  const gridColor = darkMode ? '#334155' : '#E5E7EB';
  const axisColor = darkMode ? '#ffffff80' : '#6B7280';
  
  return (
    <motion.section 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`${bgColor} min-h-screen py-16 px-4 sm:px-6 transition-colors duration-300`}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div 
          variants={itemVariants}
          className="flex justify-between items-center mb-8"
        >
          <h2 className={`${textColor} text-3xl font-bold text-center`}>{t.title}</h2>
          <div className="flex gap-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleLanguage}
              className={`p-2 rounded-full ${darkMode ? 'bg-[#1E293B] text-white' : 'bg-white text-gray-800'} shadow-md transition-all`}
              title="Toggle Language"
            >
              <Languages className="h-5 w-5" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${darkMode ? 'bg-[#1E293B] text-white' : 'bg-white text-gray-800'} shadow-md transition-all`}
              title="Toggle Dark Mode"
            >
              {darkMode ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: 0, opacity: 0 }}
                  animate={{ rotate: 360, opacity: 1 }}
                  exit={{ rotate: -180, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Sun className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 0, opacity: 0 }}
                  animate={{ rotate: 360, opacity: 1 }}
                  exit={{ rotate: -180, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Moon className="h-5 w-5" />
                </motion.div>
              )}
            </motion.button>
          </div>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
        >
          <motion.div variants={itemVariants}>
            <Card className={`${cardBg} ${cardBorder} ${textColor} shadow-lg hover:shadow-xl transition-all h-full`}>
              <CardHeader className="pb-2">
                <CardDescription className={subtextColor}>{t.totalReports}</CardDescription>
                <CardTitle className="text-2xl">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {totalReports.toLocaleString()}
                  </motion.div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className={`text-xs ${subtextColor} flex items-center`}>
                  <TrendingUp className="h-3 w-3 mr-1 text-[#3B82F6]" />
                  <span className="text-[#3B82F6] font-medium">12% {t.increase}</span> {t.fromLastMonth}
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className={`${cardBg} ${cardBorder} ${textColor} shadow-lg hover:shadow-xl transition-all h-full`}>
              <CardHeader className="pb-2">
                <CardDescription className={subtextColor}>{t.resolvedReports}</CardDescription>
                <CardTitle className="text-2xl">{resolvedReports}</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className={`text-xs ${subtextColor}`}>
                  <div className={`w-full ${darkMode ? 'bg-[#0F172A]' : 'bg-gray-200'} rounded-full h-2`}>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '9.73054%' }}
                      transition={{ duration: 1, delay: 0.4 }}
                      className="bg-[#3B82F6] h-2 rounded-full" 
                    />
                  </div>
                  <div className="mt-1">10% {t.resolutionRate}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className={`${cardBg} ${cardBorder} ${textColor} shadow-lg hover:shadow-xl transition-all h-full`}>
              <CardHeader className="pb-2">
                <CardDescription className={subtextColor}>{t.pendingReports}</CardDescription>
                <CardTitle className="text-2xl">{pendingReports}</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className={`text-xs ${subtextColor} flex items-center`}>
                  <Activity className="h-3 w-3 mr-1 text-[#3B82F6]" />
                  <span className="text-[#3B82F6] font-medium">8 {t.reports}</span> {t.requireAttention}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <motion.div variants={chartVariants}>
            <Card className={`${cardBg} ${cardBorder} ${textColor} shadow-lg hover:shadow-xl transition-all h-full`}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-[#3B82F6]" />
                  {t.monthlyReports}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyReportsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis dataKey="name" stroke={axisColor} />
                    <YAxis stroke={axisColor} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: darkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                        border: darkMode ? '1px solid #334155' : '1px solid #E5E7EB',
                        borderRadius: '8px',
                        color: darkMode ? 'white' : '#1F2937',
                        boxShadow: darkMode ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 4px 6px rgba(0, 0, 0, 0.1)'
                      }} 
                    />
                    <Bar 
                      dataKey="reports" 
                      fill="#3B82F6" 
                      radius={[4, 4, 0, 0]}
                      animationDuration={1500}
                    >
                      {monthlyReportsData.map((entry, index) => (
                        <motion.rect
                          key={`bar-${index}`}
                          initial={{ height: 0 }}
                          animate={{ height: '100%' }}
                          transition={{ duration: 0.8, delay: index * 0.05 }}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={chartVariants}>
            <Card className={`${cardBg} ${cardBorder} ${textColor} shadow-lg hover:shadow-xl transition-all h-full`}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <PieChart className="h-5 w-5 mr-2 text-[#3B82F6]" />
                  {t.reportsByCategory}
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
                      label={({ name, percent }) => {
                        const translatedName = t[name.toLowerCase().replace(' ', '') as keyof typeof t];
                        return `${translatedName}: ${(percent * 100).toFixed(0)}%`;
                      }}
                      animationBegin={0}
                      animationDuration={1000}
                      animationEasing="ease-out"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: darkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                        border: darkMode ? '1px solid #334155' : '1px solid #E5E7EB',
                        borderRadius: '8px',
                        color: darkMode ? 'white' : '#1F2937',
                        boxShadow: darkMode ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 4px 6px rgba(0, 0, 0, 0.1)'
                      }} 
                      formatter={(value, name) => {
                        let translatedName = name;
                      
                        if (typeof name === 'string') {
                          translatedName = t[name.toLowerCase().replace(/\s/g, '') as keyof typeof t] || name;
                        }
                      
                        return [value, translatedName];
                      }}
                    />
                    <Legend 
                      formatter={(value) => {
                        const translatedName = t[value.toLowerCase().replace(' ', '') as keyof typeof t];
                        return <span style={{ color: darkMode ? 'white' : '#1F2937' }}>{translatedName}</span>;
                      }} 
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}; 