import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { MessageSquare, Plus, Edit, Trash } from 'lucide-react';
import { Reply, feedbackService } from '@/services/feedbackService';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '@/lib/motion';

interface ReplyListProps {
  parentId: string;
  parentType: 'DISCUSSION' | 'ANNOUNCEMENT';
}

export const ReplyList = ({ parentId, parentType }: ReplyListProps) => {
  const { token, userId } = useAuth();
  const { toast } = useToast();
  const [replies, setReplies] = useState<Reply[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedReply, setSelectedReply] = useState<Reply | null>(null);
  const [formData, setFormData] = useState<{ message: string }>({ message: '' });

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        setIsLoading(true);
        const data = await feedbackService.getReplies(parentId);
        setReplies(data);
      } catch (error) {
        console.error('Error fetching replies:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch replies',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchReplies();
  }, [parentId]);

  const handleCreateReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.message) return;

    try {
      const newReply = await feedbackService.createReply(parentId, {
        message: formData.message
      });
      setReplies(prev => [newReply, ...prev]);
      setShowCreateDialog(false);
      setFormData({ message: '' });
      toast({
        title: 'Success',
        description: 'Reply created successfully'
      });
    } catch (error) {
      console.error('Error creating reply:', error);
      toast({
        title: 'Error',
        description: 'Failed to create reply',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReply || !formData.message) return;

    try {
      const updatedReply = await feedbackService.updateReply(selectedReply.id, {
        message: formData.message
      });
      setReplies(prev => prev.map(r => r.id === updatedReply.id ? updatedReply : r));
      setShowEditDialog(false);
      setSelectedReply(null);
      setFormData({ message: '' });
      toast({
        title: 'Success',
        description: 'Reply updated successfully'
      });
    } catch (error) {
      console.error('Error updating reply:', error);
      toast({
        title: 'Error',
        description: 'Failed to update reply',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteReply = async (id: string) => {
    try {
      await feedbackService.deleteReply(id);
      setReplies(prev => prev.filter(r => r.id !== id));
      toast({
        title: 'Success',
        description: 'Reply deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting reply:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete reply',
        variant: 'destructive'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-white"></div>
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
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Replies</h3>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Reply
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Reply</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateReply} className="space-y-4">
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
                <Button type="submit">Create Reply</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {replies.map((reply, index) => (
          <motion.div
            key={reply.id}
            variants={fadeIn('up', 0.2)}
            initial="visible"
            animate="visible"
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4">
              {/* Message Content (2/3 width) */}
              <div className="w-full mb-3">
                <p className="whitespace-pre-wrap">{reply.message}</p>
              </div>
              
              {/* Author Info and Actions (1/3 width, right-aligned) */}
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  By {reply.authorName} • {new Date(reply.createdAt).toLocaleDateString()}
                </div>
                {reply.authorId === userId && (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2"
                      onClick={() => {
                        setSelectedReply(reply);
                        setFormData({ message: reply.message });
                        setShowEditDialog(true);
                      }}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2"
                      onClick={() => handleDeleteReply(reply.id)}
                    >
                      <Trash className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Reply</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateReply} className="space-y-4">
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
              <Button type="submit">Update Reply</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};