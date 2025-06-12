import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Bell, Search, Plus, Edit, Trash } from 'lucide-react';
import { Announcement, feedbackService } from '@/services/feedbackService';
import { motion } from 'framer-motion';
import { fadeIn, slideIn, staggerContainer } from '@/lib/motion';

interface AnnouncementListProps {
  onViewItem: (id: string) => void;
}

export const AnnouncementList = ({ onViewItem }: AnnouncementListProps) => {
  const { token, userId, userRole } = useAuth();
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    message: ''
  });

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setIsLoading(true);
        const data = await feedbackService.getAnnouncements();
        setAnnouncements(data);
      } catch (error) {
        console.error('Error fetching announcements:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch announcements',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.message) return;

    try {
      const newAnnouncement = await feedbackService.createAnnouncement({
        title: formData.title,
        message: formData.message
      });
      setAnnouncements(prev => [newAnnouncement, ...prev]);
      setShowCreateDialog(false);
      setFormData({ title: '', message: '' });
      toast({
        title: 'Success',
        description: 'Announcement created successfully'
      });
    } catch (error) {
      console.error('Error creating announcement:', error);
      toast({
        title: 'Error',
        description: 'Failed to create announcement',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAnnouncement || !formData.title || !formData.message) return;

    try {
      const updatedAnnouncement = await feedbackService.updateAnnouncement(selectedAnnouncement.id, {
        title: formData.title,
        message: formData.message
      });
      setAnnouncements(prev => prev.map(a => a.id === updatedAnnouncement.id ? updatedAnnouncement : a));
      setShowEditDialog(false);
      setSelectedAnnouncement(null);
      setFormData({ title: '', message: '' });
      toast({
        title: 'Success',
        description: 'Announcement updated successfully'
      });
    } catch (error) {
      console.error('Error updating announcement:', error);
      toast({
        title: 'Error',
        description: 'Failed to update announcement',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      await feedbackService.deleteAnnouncement(id);
      setAnnouncements(prev => prev.filter(a => a.id !== id));
      toast({
        title: 'Success',
        description: 'Announcement deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting announcement:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete announcement',
        variant: 'destructive'
      });
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      try {
        const data = await feedbackService.getAnnouncements();
        setAnnouncements(data);
      } catch (error) {
        console.error('Error fetching announcements:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch announcements',
          variant: 'destructive'
        });
      }
      return;
    }

    // Filter announcements locally since there's no search endpoint for announcements
    const filtered = announcements.filter(a => 
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.message.toLowerCase().includes(query.toLowerCase())
    );
    setAnnouncements(filtered);
  };

  const filteredAnnouncements = announcements.filter(announcement =>
    announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    announcement.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer()}
      className="space-y-4"
    >
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search announcements..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        {userRole === 'GOVERNMENT_OFFICE' && (
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Announcement
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Announcement</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Title
                  </label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    maxLength={1000}
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit">Create Announcement</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="space-y-4">
        {filteredAnnouncements.map((announcement, index) => (
          <motion.div
            key={announcement.id}
            variants={fadeIn('up', 0.2)}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => onViewItem(announcement.id)}
            >
              <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
                <div>
                  <CardTitle className="text-xl">{announcement.title}</CardTitle>
                  <p className="text-sm text-gray-500">
                    By {announcement.authorName} on {new Date(announcement.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {userRole === 'GOVERNMENT_OFFICE' && announcement.authorId === userId && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAnnouncement(announcement);
                        setFormData({
                          title: announcement.title,
                          message: announcement.message
                        });
                        setShowEditDialog(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAnnouncement(announcement.id);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">{announcement.message}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Announcement</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateAnnouncement} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="edit-title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-message" className="text-sm font-medium">
                Message
              </label>
              <Textarea
                id="edit-message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                maxLength={1000}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit">Update Announcement</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};