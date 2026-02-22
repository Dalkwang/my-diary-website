import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Sparkles } from 'lucide-react';

interface CTAProps {
  currentUser: { username: string } | null;
  onRegister: (username: string) => boolean;
}

const CTA = ({ currentUser, onRegister }: CTAProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleRegister = () => {
    if (!username.trim()) {
      setError('请输入用户名');
      return;
    }
    
    const success = onRegister(username.trim());
    if (success) {
      setIsDialogOpen(false);
      setUsername('');
      setError('');
    } else {
      setError('用户名已存在，请尝试其他名称');
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="py-20 lg:py-32 bg-white relative overflow-hidden"
    >
      {/* 背景装饰 */}
      <div className="absolute inset-0">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-radial from-[#ff6e00]/10 via-transparent to-transparent"
          style={{
            animation: 'pulse 4s ease-in-out infinite'
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`max-w-2xl mx-auto text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          {/* 装饰图标 */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#ff6e00]/10 flex items-center justify-center animate-bounce">
              <Sparkles className="w-8 h-8 text-[#ff6e00]" />
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1a1a1a] mb-6">
            开始你的日记之旅
          </h2>
          <p className="text-[#666666] text-lg mb-8 leading-relaxed">
            注册成为会员，记录你的故事，与更多人分享你的精彩人生。每一天都值得被记录，每一刻都值得被铭记。
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!currentUser ? (
              <>
                <Button 
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-[#ff6e00] hover:bg-[#e56200] text-white px-8 py-6 text-base font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#ff6e00]/30"
                >
                  立即注册
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setIsDialogOpen(true)}
                  className="border-2 border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white px-8 py-6 text-base font-semibold rounded-lg transition-all duration-300"
                >
                  了解更多
                </Button>
              </>
            ) : (
              <div className="bg-[#f2f2f2] rounded-xl p-6">
                <p className="text-[#1a1a1a] font-semibold mb-2">
                  欢迎回来，{currentUser.username}！
                </p>
                <p className="text-[#666666] text-sm">
                  你已经成功注册，可以开始评论日记了
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 注册弹窗 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#1a1a1a]">加入我们</DialogTitle>
            <DialogDescription className="text-[#666666]">
              创建一个用户名，开始你的日记之旅
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Input
                placeholder="请输入用户名"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
                className="w-full px-4 py-3 border-2 border-[#e5e5e5] rounded-lg focus:border-[#ff6e00] focus:ring-[#ff6e00] transition-colors"
              />
              {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
              )}
            </div>
            <Button 
              onClick={handleRegister}
              className="w-full bg-[#ff6e00] hover:bg-[#e56200] text-white py-3 rounded-lg font-semibold transition-all duration-300"
            >
              注册
            </Button>
            <p className="text-center text-[#a6a6a6] text-sm">
              已有账号？直接输入用户名即可登录
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.5;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 0.8;
          }
        }
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-from), var(--tw-gradient-via), var(--tw-gradient-to));
        }
      `}</style>
    </section>
  );
};

export default CTA;
