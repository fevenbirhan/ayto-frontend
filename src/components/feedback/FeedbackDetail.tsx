import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft, Edit, Trash } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeIn, slideIn, staggerContainer } from '@/lib/motion';
import { ReplyList } from './ReplyList';
import { feedbackService, Discussion, Announcement } from '@/services/feedbackService';

interface FeedbackDetailProps {
  id: string;
  type: 'DISCUSSION' | 'ANNOUNCEMENT';
  onBack: () => void;
}

export function FeedbackDetail({ id, type, onBack }: FeedbackDetailProps) {
  const { userId } = useAuth();
  const [item, setItem] = useState<Discussion | Announcement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: ''
  });

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setIsLoading(true);
        const data = type === 'DISCUSSION'
          ? await feedbackService.getDiscussion(id)
          : await feedbackService.getAnnouncement(id);
        setItem(data);
      } catch (error) {
        console.error('Error fetching item:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch item',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchItem();
  }, [id, type]);

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item || !formData.title || !formData.message) return;

    try {
      const updatedItem = type === 'DISCUSSION'
        ? await feedbackService.updateDiscussion(item.id, {
            title: formData.title,
            message: formData.message
          })
        : await feedbackService.updateAnnouncement(item.id, {
            title: formData.title,
            message: formData.message
          });
      setItem(updatedItem);
      setShowEditDialog(false);
      setFormData({ title: '', message: '' });
      toast({
        title: 'Success',
        description: `${type === 'DISCUSSION' ? 'Discussion' : 'Announcement'} updated successfully`
      });
    } catch (error) {
      console.error('Error updating item:', error);
      toast({
        title: 'Error',
        description: `Failed to update ${type === 'DISCUSSION' ? 'discussion' : 'announcement'}`,
        variant: 'destructive'
      });
    }
  };

  const handleDeleteItem = async () => {
    if (!item) return;

    try {
      if (type === 'DISCUSSION') {
        await feedbackService.deleteDiscussion(item.id);
      } else {
        await feedbackService.deleteAnnouncement(item.id);
      }
      onBack();
      toast({
        title: 'Success',
        description: `${type === 'DISCUSSION' ? 'Discussion' : 'Announcement'} deleted successfully`
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: 'Error',
        description: `Failed to delete ${type === 'DISCUSSION' ? 'discussion' : 'announcement'}`,
        variant: 'destructive'
      });
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={staggerContainer()}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        {item && item.authorId === userId && (
          <div className="flex gap-2">
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : !item ? (
        <div className="text-center text-gray-500">
          {type === 'DISCUSSION' ? 'Discussion' : 'Announcement'} not found
        </div>
      ) : (
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="w-1/3">
              <CardTitle className="text-2xl font-bold text-foreground">{item.title}</CardTitle>
            </div>
            <div className="text-sm text-muted-foreground">
              By {item.authorName} on {new Date(item.createdAt).toLocaleDateString()}
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="w-2/3">
              <p className="whitespace-pre-wrap text-foreground">{item.message}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {item && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Replies</h3>
          </div>
          <ReplyList parentId={item.id} parentType={type} />
        </div>
      )}
    </motion.div>
  );
} 