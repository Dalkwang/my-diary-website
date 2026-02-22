import { useState, useCallback } from 'react';
import Navbar from '@/sections/Navbar';
import Hero from '@/sections/Hero';
import LatestDiaries from '@/sections/LatestDiaries';
import PopularStories from '@/sections/PopularStories';
import Stats from '@/sections/Stats';
import Categories from '@/sections/Categories';
import CTA from '@/sections/CTA';
import Footer from '@/sections/Footer';
import DiaryDetail from '@/sections/DiaryDetail';
import { useUser, useDiaries, useStats } from '@/hooks/useStorage';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import type { Diary } from '@/types';

function App() {
  const { currentUser, register, login, logout } = useUser();
  const { diaries, getDiaryById, addComment, incrementViews } = useDiaries();
  const stats = useStats();
  
  const [selectedDiary, setSelectedDiary] = useState<Diary | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleRegister = useCallback((username: string): boolean => {
    // 先尝试登录
    const loginResult = login(username);
    if (loginResult) {
      toast.success(`欢迎回来，${username}！`);
      return true;
    }
    
    // 登录失败则注册
    const registerResult = register(username);
    if (registerResult) {
      toast.success(`注册成功，欢迎加入时光日记！`);
      return true;
    }
    
    return false;
  }, [login, register]);

  const handleLogout = useCallback(() => {
    logout();
    toast.success('已退出登录');
  }, [logout]);

  const handleDiaryClick = useCallback((diary: Diary) => {
    setSelectedDiary(diary);
    setIsDetailOpen(true);
    incrementViews(diary.id);
  }, [incrementViews]);

  const handleAddComment = useCallback((diaryId: string, content: string) => {
    if (!currentUser) {
      toast.error('请先登录后再评论');
      return;
    }
    
    const success = addComment(diaryId, currentUser, content);
    if (success) {
      toast.success('评论发表成功！');
      // 更新选中的日记数据
      const updatedDiary = getDiaryById(diaryId);
      if (updatedDiary) {
        setSelectedDiary(updatedDiary);
      }
    }
  }, [currentUser, addComment, getDiaryById]);

  const handleCategoryClick = useCallback((category: string) => {
    toast.info(`正在查看「${category}」分类的内容`);
    // 这里可以添加分类筛选逻辑
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-center" richColors />
      
      <Navbar 
        currentUser={currentUser}
        onRegister={handleRegister}
        onLogout={handleLogout}
      />
      
      <main>
        <div id="hero">
          <Hero />
        </div>
        
        <LatestDiaries 
          diaries={diaries}
          onDiaryClick={handleDiaryClick}
        />
        
        <div id="popular-stories">
          <PopularStories 
            diaries={diaries}
            onDiaryClick={handleDiaryClick}
          />
        </div>
        
        <Stats stats={stats} />
        
        <div id="categories">
          <Categories onCategoryClick={handleCategoryClick} />
        </div>
        
        <CTA 
          currentUser={currentUser}
          onRegister={handleRegister}
        />
      </main>
      
      <Footer />
      
      <DiaryDetail
        diary={selectedDiary}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedDiary(null);
        }}
        currentUser={currentUser}
        onAddComment={handleAddComment}
      />
    </div>
  );
}

export default App;
