import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { MessageSquare, Search, Plus, Edit, Trash } from 'lucide-react';
import { Discussion, feedbackService } from '@/services/feedbackService';
import { motion } from 'framer-motion';
import { fadeIn, slideIn, staggerContainer } from '@/lib/motion';

interface DiscussionListProps {
  onViewItem: (id: string) => void;
}

export const DiscussionList = ({ onViewItem }: DiscussionListProps) => {
  const { token, userId } = useAuth();
  const { toast } = useToast();
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedDiscussion, setSelectedDiscussion] = useState<Discussion | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    message: ''
  });

  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        setIsLoading(true);
        const data = await feedbackService.getDiscussions();
        setDiscussions(data);
      } catch (error) {
        console.error('Error fetching discussions:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch discussions',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiscussions();
  }, []);

  const handleCreateDiscussion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.message) return;

    try {
      const newDiscussion = await feedbackService.createDiscussion({
        title: formData.title,
        message: formData.message
      });
      setDiscussions(prev => [newDiscussion, ...prev]);
      setShowCreateDialog(false);
      setFormData({ title: '', message: '' });
      toast({
        title: 'Success',
        description: 'Discussion created successfully'
      });
    } catch (error) {
      console.error('Error creating discussion:', error);
      toast({
        title: 'Error',
        description: 'Failed to create discussion',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateDiscussion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDiscussion || !formData.title || !formData.message) return;

    try {
      const updatedDiscussion = await feedbackService.updateDiscussion(selectedDiscussion.id, {
        title: formData.title,
        message: formData.message
      });
      setDiscussions(prev => prev.map(d => d.id === updatedDiscussion.id ? updatedDiscussion : d));
      setShowEditDialog(false);
      setSelectedDiscussion(null);
      setFormData({ title: '', message: '' });
      toast({
        title: 'Success',
        description: 'Discussion updated successfully'
      });
    } catch (error) {
      console.error('Error updating discussion:', error);
      toast({
        title: 'Error',
        description: 'Failed to update discussion',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteDiscussion = async (id: string) => {
    try {
      await feedbackService.deleteDiscussion(id);
      setDiscussions(prev => prev.filter(d => d.id !== id));
      toast({
        title: 'Success',
        description: 'Discussion deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting discussion:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete discussion',
        variant: 'destructive'
      });
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      try {
        const data = await feedbackService.getDiscussions();
        setDiscussions(data);
      } catch (error) {
        console.error('Error fetching discussions:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch discussions',
          variant: 'destructive'
        });
      }
      return;
    }

    try {
      const results = await feedbackService.searchDiscussions(query);
      setDiscussions(results);
    } catch (error) {
      console.error('Error searching discussions:', error);
      toast({
        title: 'Error',
        description: 'Failed to search discussions',
        variant: 'destructive'
      });
    }
  };

  const filteredDiscussions = discussions.filter(discussion =>
    discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    discussion.message.toLowerCase().includes(searchQuery.toLowerCase())
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
            placeholder="Search discussions..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Discussion
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Discussion</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateDiscussion} className="space-y-4">
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
                <Button type="submit">Create Discussion</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {filteredDiscussions.map((discussion, index) => (
          <motion.div
            key={discussion.id}
            variants={fadeIn('up', 0.2)}
            initial="visible"
            animate="visible"
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => onViewItem(discussion.id)}
            >
              <div className="p-6">
                {/* Title and Author Row */}
                <div className="flex justify-between items-start mb-4">
                  <div className="w-1/3">
                    <h2 className="text-xl font-bold text-foreground">{discussion.title}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-muted-foreground text-right">
                      <p>By {discussion.authorName}</p>
                      <p>on {new Date(discussion.createdAt).toLocaleDateString()}</p>
                    </div>
                    {userId === discussion.authorId && (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDiscussion(discussion);
                            setFormData({
                              title: discussion.title,
                              message: discussion.message
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
                            handleDeleteDiscussion(discussion.id);
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Message Content */}
                <div className="w-full pt-4 border-t">
                  <p className="whitespace-pre-wrap text-foreground">{discussion.message}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Discussion</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateDiscussion} className="space-y-4">
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
              <Button type="submit">Update Discussion</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};