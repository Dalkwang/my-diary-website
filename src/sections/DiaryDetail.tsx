import { useEffect, useState } from 'react';
import { 
  Dialog, 
  DialogContent
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Calendar, 
  Eye, 
  MessageCircle, 
  User, 
  Send,
  X
} from 'lucide-react';
import type { Diary, User as UserType } from '@/types';

interface DiaryDetailProps {
  diary: Diary | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserType | null;
  onAddComment: (diaryId: string, content: string) => void;
}

const DiaryDetail = ({ 
  diary, 
  isOpen, 
  onClose, 
  currentUser, 
  onAddComment 
}: DiaryDetailProps) => {
  const [comment, setComment] = useState('');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    if (isOpen && diary) {
      setComment('');
      setShowLoginPrompt(false);
    }
  }, [isOpen, diary]);

  if (!diary) return null;

  const handleSubmitComment = () => {
    if (!currentUser) {
      setShowLoginPrompt(true);
      return;
    }
    
    if (!comment.trim()) return;
    
    onAddComment(diary.id, comment.trim());
    setComment('');
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        {/* 封面图 */}
        <div className="relative h-64 sm:h-80">
          <img 
            src={diary.coverImage} 
            alt={diary.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/80 via-transparent to-transparent" />
          
          {/* 关闭按钮 */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* 标题信息 */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-[#ff6e00] text-white text-sm rounded-full">
                {diary.category}
              </span>
              <span className="flex items-center gap-1 text-white/80 text-sm">
                <Calendar className="w-4 h-4" />
                {diary.date}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              {diary.title}
            </h2>
          </div>
        </div>

        {/* 内容区 */}
        <div className="p-6">
          {/* 作者和统计 */}
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-[#f2f2f2]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#ff6e00] flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-[#1a1a1a]">{diary.author}</div>
                <div className="text-sm text-[#a6a6a6]">{formatDate(diary.date)}</div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[#666666]">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {diary.views}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                {diary.comments.length}
              </span>
            </div>
          </div>

          {/* 正文 */}
          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-[#1a1a1a] leading-relaxed whitespace-pre-line">
              {diary.content}
            </p>
          </div>

          {/* 评论区 */}
          <div className="border-t border-[#f2f2f2] pt-6">
            <h3 className="text-xl font-bold text-[#1a1a1a] mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-[#ff6e00]" />
              评论 ({diary.comments.length})
            </h3>

            {/* 评论输入 */}
            <div className="mb-6">
              {currentUser ? (
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#ff6e00] flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-[#1a1a1a] mb-2">
                      {currentUser.username}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="写下你的评论..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSubmitComment()}
                        className="flex-1"
                      />
                      <Button 
                        onClick={handleSubmitComment}
                        className="bg-[#ff6e00] hover:bg-[#e56200]"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-[#f2f2f2] rounded-lg p-4 text-center">
                  <p className="text-[#666666] mb-3">登录后可以发表评论</p>
                  <Button 
                    onClick={() => setShowLoginPrompt(true)}
                    className="bg-[#ff6e00] hover:bg-[#e56200]"
                  >
                    立即登录
                  </Button>
                </div>
              )}
            </div>

            {/* 登录提示 */}
            {showLoginPrompt && !currentUser && (
              <div className="bg-[#ff6e00]/10 rounded-lg p-4 mb-4">
                <p className="text-[#ff6e00] text-sm">
                  请先注册或登录后再发表评论
                </p>
              </div>
            )}

            {/* 评论列表 */}
            <div className="space-y-4">
              {diary.comments.length === 0 ? (
                <p className="text-[#a6a6a6] text-center py-8">
                  暂无评论，来发表第一条评论吧！
                </p>
              ) : (
                diary.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 p-4 bg-[#f2f2f2] rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-[#ff6e00]/20 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-[#ff6e00]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-[#1a1a1a]">
                          {comment.username}
                        </span>
                        <span className="text-xs text-[#a6a6a6]">
                          {new Date(comment.createdAt).toLocaleDateString('zh-CN')}
                        </span>
                      </div>
                      <p className="text-[#666666]">{comment.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DiaryDetail;
