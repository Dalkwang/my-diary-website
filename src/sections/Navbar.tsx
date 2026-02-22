import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { User, LogOut, Menu, X } from 'lucide-react';
import type { User as UserType } from '@/types';

interface NavbarProps {
  currentUser: UserType | null;
  onRegister: (username: string) => boolean;
  onLogout: () => void;
}

const Navbar = ({ currentUser, onRegister, onLogout }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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
      setError('用户名已存在，请尝试登录');
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { label: '首页', id: 'hero' },
    { label: '最新日记', id: 'latest-diaries' },
    { label: '热门故事', id: 'popular-stories' },
    { label: '分类', id: 'categories' },
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg' 
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xl lg:text-2xl font-bold"
            >
              <span className={isScrolled ? 'text-[#1a1a1a]' : 'text-[#1a1a1a]'}>
                时光
              </span>
              <span className="text-[#ff6e00]">日记</span>
            </a>

            {/* 桌面导航 */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`text-sm font-medium transition-colors hover:text-[#ff6e00] ${
                    isScrolled ? 'text-[#666666]' : 'text-[#666666]'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* 用户操作 */}
            <div className="hidden lg:flex items-center gap-4">
              {currentUser ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 bg-[#f2f2f2] rounded-full">
                    <div className="w-8 h-8 rounded-full bg-[#ff6e00] flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-[#1a1a1a]">
                      {currentUser.username}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onLogout}
                    className="text-[#666666] hover:text-[#ff6e00] hover:bg-[#ff6e00]/10"
                  >
                    <LogOut className="w-5 h-5" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-[#ff6e00] hover:bg-[#e56200] text-white px-6"
                >
                  登录 / 注册
                </Button>
              )}
            </div>

            {/* 移动端菜单按钮 */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2"
            >
              {isMobileMenuOpen ? (
                <X className={`w-6 h-6 ${isScrolled ? 'text-[#1a1a1a]' : 'text-[#1a1a1a]'}`} />
              ) : (
                <Menu className={`w-6 h-6 ${isScrolled ? 'text-[#1a1a1a]' : 'text-[#1a1a1a]'}`} />
              )}
            </button>
          </div>
        </div>

        {/* 移动端菜单 */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-[#f2f2f2]">
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className="text-left py-2 text-[#666666] hover:text-[#ff6e00] transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
                <div className="border-t border-[#f2f2f2] pt-4">
                  {currentUser ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#ff6e00] flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium text-[#1a1a1a]">
                          {currentUser.username}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        onClick={onLogout}
                        className="text-[#666666]"
                      >
                        <LogOut className="w-5 h-5 mr-2" />
                        退出
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => {
                        setIsDialogOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full bg-[#ff6e00] hover:bg-[#e56200] text-white"
                    >
                      登录 / 注册
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* 登录/注册弹窗 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#1a1a1a]">加入我们</DialogTitle>
            <DialogDescription className="text-[#666666]">
              输入用户名注册或登录
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
              开始旅程
            </Button>
            <p className="text-center text-[#a6a6a6] text-sm">
              新用户将自动注册，老用户直接登录
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Navbar;
