import { useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, Users, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn, slideIn, staggerContainer, textVariant, cardVariants } from "@/lib/motion";

export const FeedbackSection = () => {
  const [replyText, setReplyText] = useState("");
  const { theme } = useTheme();
  const { language } = useAuth();

  // Translations
  const translations = {
    governmentFeedback: {
      en: "Government Feedback",
      am: "የመንግስት ግብረ መልስ"
    },
    communityDiscussions: {
      en: "Community Discussions",
      am: "የማህበረሰብ ውይይቶች"
    },
    replyPlaceholder: {
      en: "Type your response here...",
      am: "መልስዎን እዚህ ይተይቡ..."
    },
    sendReply: {
      en: "Send Reply",
      am: "መልስ ላክ"
    },
    alreadyReplied: {
      en: "You have already replied to this message.",
      am: "በዚህ መልዕክት አስቀድመው መልሰዋል።"
    },
    replyToNotification: {
      en: "Reply to this notification:",
      am: "ለዚህ ማስታወቂያ መልስ ይስጡ:"
    },
    postedBy: {
      en: "Posted by",
      am: "በ"
    },
    replies: {
      en: "replies",
      am: "መልሶች"
    },
    viewDiscussion: {
      en: "View Discussion",
      am: "ውይይቱን ይመልከቱ"
    },
    startNewDiscussion: {
      en: "Start New Discussion",
      am: "አዲስ ውይይት ጀምር"
    },
    waterService: {
      en: "Water Service Interruption",
      am: "የውሃ አገልግሎት መቋረጥ"
    },
    roadRepairs: {
      en: "Road Repairs on Main Street",
      am: "በዋና ጎዳና ላይ የመንገድ ጥገና"
    },
    neighborhoodWatch: {
      en: "Neighborhood Watch Program",
      am: "የሰፈር ተጠባባቂ ፕሮግራም"
    },
    communityGarden: {
      en: "Community Garden Proposal",
      am: "የማህበረሰብ አትክልት የምክር ሃሳብ"
    }
  };

  const getTranslation = (key: keyof typeof translations) => translations[key][language] || translations[key].en;

  // Mock data for government feedback and community discussions
  const governmentFeedback = [
    {
      id: 1,
      title: getTranslation('waterService'),
      message: language === 'am' ? 
        "በዋና ከተማ አካባቢ ለጥገና ሥራ በጁላይ 15 ከምሽቱ 10 ሰዓት እስከ ጠዋቱ 4 ሰዓት ድረስ የውሃ አገልግሎት መቋረጥ ይኖራል። በዚህ መሠረት ውሃ እንዲያከማቹ ተጠይቋል።" :
        "There will be a scheduled water service interruption in the downtown area on July 15th from 10 PM to 4 AM for maintenance work. Please store water accordingly.",
      date: "2023-07-10",
      department: language === 'am' ? "የውሃ አገልግሎት ክፍል" : "Water Utility Department",
      hasReplied: true,
    },
    {
      id: 2,
      title: getTranslation('roadRepairs'),
      message: language === 'am' ?
        "ስለ ዋና ጎዳና ሁኔታ ብዙ ሪፖርቶች ቀርበዋል። የጥገና ቡድን በሚቀጥለው ሰኞ ለመስራት ተዘጋጅቷል።" :
        "We've received multiple reports about the condition of Main Street. A repair crew has been scheduled to fix the potholes and resurface damaged sections starting next Monday.",
      date: "2023-07-05",
      department: language === 'am' ? "የህዝብ ሥራ ክፍል" : "Public Works",
      hasReplied: false,
    },
  ];
  
  const communityDiscussions = [
    {
      id: 1,
      title: getTranslation('neighborhoodWatch'),
      author: language === 'am' ? "ሳራ ጆንሰን" : "Sarah Johnson",
      message: language === 'am' ?
        "በአካባቢችን የሰፈር ተጠባባቂ ፕሮግራም ለመጀመር ፍላጎት አለኝ። ማንም ለመቀላቀል ፈቃደኛ ነው? ከአካባቢ ፖሊስ ጋር በመተባበር የማህበረሰብ ደህንነት ልንሻሽል እንችላለን።" :
        "I'm interested in starting a neighborhood watch program in our area. Is anyone interested in joining? We could coordinate with local police and improve community safety.",
      date: "2023-07-08",
      replies: 12,
    },
    {
      id: 2,
      title: getTranslation('communityGarden'),
      author: language === 'am' ? "ማይክ ዊልያምስ" : "Mike Williams",
      message: language === 'am' ?
        "በሲዳር ጎዳና ላይ ለማህበረሰብ አትክልት ተስማሚ የሆነ ባዶ ቦታ አለ። ከከተማ ጋር ተገናኝቼ ነው፣ ለማህበረሰብ ፕሮጀክቶች ክፍት ናቸው። ማን ለመርዳት ፈቃደኛ ይሆናል?" :
        "There's an empty lot on Cedar Street that could be perfect for a community garden. I've checked with the city, and they're open to community projects. Who would be interested in helping?",
      date: "2023-07-06",
      replies: 8,
    },
  ];
  
  const handleSubmitReply = (e: React.FormEvent, id: number) => {
    e.preventDefault();
    console.log(`Replying to message ${id}: ${replyText}`);
    setReplyText("");
    alert(language === 'am' ? "መልስዎ ቀርቧል።" : "Your reply has been submitted.");
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={staggerContainer()}
      className="space-y-8"
    >
      {/* Government Feedback Section */}
      <motion.div variants={fadeIn(0.1)} className="space-y-6">
        <motion.h2 variants={textVariant(0.2)} className="text-2xl font-bold dark:text-white text-gray-900">
          {getTranslation('governmentFeedback')}
        </motion.h2>
        
        <AnimatePresence>
          {governmentFeedback.map((item, index) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
            >
              <Card className="dark:bg-gray-800 bg-white border dark:border-gray-700 border-gray-200">
                <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
                  <div>
                    <CardTitle className="text-xl dark:text-white text-gray-900">
                      {item.title}
                    </CardTitle>
                    <p className="text-sm dark:text-white/70 text-gray-600">
                      {item.department} • {new Date(item.date).toLocaleDateString()}
                    </p>
                  </div>
                  <Bell className="h-5 w-5 dark:text-[#255F38] text-[#6C7719]" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="dark:text-white text-gray-800">{item.message}</p>
                  
                  {item.hasReplied ? (
                    <div className="border-t dark:border-gray-700 border-gray-200 pt-4 mt-4">
                      <p className="text-sm dark:text-white/70 text-gray-600">
                        {getTranslation('alreadyReplied')}
                      </p>
                    </div>
                  ) : (
                    <motion.form 
                      onSubmit={(e) => handleSubmitReply(e, item.id)} 
                      className="border-t dark:border-gray-700 border-gray-200 pt-4 mt-4"
                      variants={fadeIn(0.3)}
                    >
                      <div className="space-y-3">
                        <label htmlFor={`reply-${item.id}`} className="text-sm font-medium dark:text-white text-gray-900">
                          {getTranslation('replyToNotification')}
                        </label>
                        <Textarea 
                          id={`reply-${item.id}`}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={getTranslation('replyPlaceholder')}
                          className="dark:bg-gray-700 bg-gray-50 dark:text-white text-gray-900 dark:border-gray-600 border-gray-300"
                        />
                        <div className="flex justify-end">
                          <Button 
                            type="submit" 
                            className="dark:bg-[#255F38] bg-[#6C7719] hover:dark:bg-[#1e4a2b] hover:bg-[#5a6415] text-white"
                          >
                            <Send className="h-4 w-4 mr-2" />
                            {getTranslation('sendReply')}
                          </Button>
                        </div>
                      </div>
                    </motion.form>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      
      {/* Community Discussions Section */}
      <motion.div 
        variants={fadeIn(0.4)}
        className="space-y-6 pt-8 border-t dark:border-gray-700 border-gray-200"
      >
        <div className="flex items-center justify-between">
          <motion.h2 variants={textVariant(0.3)} className="text-2xl font-bold dark:text-white text-gray-900">
            {getTranslation('communityDiscussions')}
          </motion.h2>
          <motion.div variants={slideIn('right', 0.4)}>
            <Button 
              className="dark:bg-[#255F38] bg-[#6C7719] hover:dark:bg-[#1e4a2b] hover:bg-[#5a6415] text-white"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              {getTranslation('startNewDiscussion')}
            </Button>
          </motion.div>
        </div>
        
        <AnimatePresence>
          {communityDiscussions.map((item, index) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 + 0.2 }}
            >
              <Card className="dark:bg-gray-800 bg-white border dark:border-gray-700 border-gray-200">
                <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
                  <div>
                    <CardTitle className="text-xl dark:text-white text-gray-900">
                      {item.title}
                    </CardTitle>
                    <p className="text-sm dark:text-white/70 text-gray-600">
                      {getTranslation('postedBy')} {item.author} • {new Date(item.date).toLocaleDateString()}
                    </p>
                  </div>
                  <Users className="h-5 w-5 dark:text-[#255F38] text-[#6C7719]" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="dark:text-white text-gray-800">{item.message}</p>
                  
                  <div className="flex justify-between items-center pt-4 border-t dark:border-gray-700 border-gray-200">
                    <span className="text-sm dark:text-white/70 text-gray-600">
                      {item.replies} {getTranslation('replies')}
                    </span>
                    <Button 
                      className="dark:bg-[#255F38] bg-[#6C7719] hover:dark:bg-[#1e4a2b] hover:bg-[#5a6415] text-white"
                    >
                      {getTranslation('viewDiscussion')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};