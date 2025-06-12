import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageContent } from "@/components/layout/PageContent";
import { NotificationsPanel } from "@/components/dashboard/NotificationsPanel";
import { DiscussionList } from "@/components/feedback/DiscussionList";
import { AnnouncementList } from "@/components/feedback/AnnouncementList";
import { FeedbackDetail } from "@/components/feedback/FeedbackDetail";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

type ViewMode = 'list' | 'detail';
type ContentType = 'DISCUSSION' | 'ANNOUNCEMENT';

export default function Feedback() {
  const { theme } = useTheme();
  const { language } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [contentType, setContentType] = useState<ContentType>('DISCUSSION');
  const [selectedItem, setSelectedItem] = useState<{ id: string; type: ContentType } | null>(null);

  const getTranslation = (key: string) => {
    const translations: { [key: string]: { en: string; am: string } } = {
      pageTitle: {
        en: 'Feedback & Discussions',
        am: 'ግብረመልስ እና ውይይቶች'
      },
      footerText: {
        en: '© 2024 AYTO. All rights reserved.',
        am: '© 2024 አይቶ. መብቶች የተጠበቁ ናቸው.'
      }
    };
    return translations[key]?.[language] || translations[key]?.en || key;
  };

  const handleViewItem = (id: string, type: ContentType) => {
    setSelectedItem({ id, type });
    setViewMode('detail');
  };

  const handleBack = () => {
    setViewMode('list');
    setSelectedItem(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageContent>
        <motion.div
          initial="hidden"
          animate="show"
          variants={containerVariants}
          className="container mx-auto px-4 py-8"
        >
          {viewMode === 'list' ? (
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">{getTranslation('pageTitle')}</h1>
                <div className="flex gap-2">
                  <Button
                    variant={contentType === 'DISCUSSION' ? 'default' : 'outline'}
                    onClick={() => setContentType('DISCUSSION')}
                  >
                    Discussions
                  </Button>
                  <Button
                    variant={contentType === 'ANNOUNCEMENT' ? 'default' : 'outline'}
                    onClick={() => setContentType('ANNOUNCEMENT')}
                  >
                    Announcements
                  </Button>
                  <NotificationsPanel />
                </div>
              </div>
              <Toaster />

              {contentType === 'DISCUSSION' ? (
                <DiscussionList onViewItem={(id) => handleViewItem(id, 'DISCUSSION')} />
              ) : (
                <AnnouncementList onViewItem={(id) => handleViewItem(id, 'ANNOUNCEMENT')} />
              )}
            </motion.div>
          ) : (
            selectedItem && (
              <motion.div variants={itemVariants}>
                <FeedbackDetail
                  id={selectedItem.id}
                  type={selectedItem.type}
                  onBack={handleBack}
                />
              </motion.div>
            )
          )}
        </motion.div>
      </PageContent>
      <Footer text={getTranslation('footerText')} darkMode={theme === 'dark'} language={language} />
      
    </div>
  );
}