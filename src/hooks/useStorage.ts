import { useState, useEffect, useCallback } from 'react';
import type { User, Diary, Comment } from '@/types';

// 生成唯一ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// 初始化默认数据
const initializeData = () => {
  const defaultDiaries: Diary[] = [
    {
      id: '1',
      title: '雨中的宁静',
      content: '窗外的雨滴轻轻敲打着玻璃，带来一份难得的宁静。我喜欢这样的天气，让人可以静下心来，思考生活中的点点滴滴。雨声如同大自然的交响乐，每一滴雨都在诉说着自己的故事。泡一杯热茶，坐在窗边，看着窗外的世界被雨水洗涤，心情也变得清新起来。',
      excerpt: '窗外的雨滴轻轻敲打着玻璃，带来一份难得的宁静...',
      coverImage: '/diary-rain.jpg',
      category: '生活',
      date: '2024-01-15',
      views: 1234,
      comments: [],
      author: '时光行者'
    },
    {
      id: '2',
      title: '咖啡与午后',
      content: '阳光透过咖啡馆的窗户，在桌面上投下斑驳的光影。我喜欢在这样的午后，找一个安静的角落，品味一杯香浓的咖啡。咖啡的香气在空气中弥漫，伴随着轻柔的音乐，时间仿佛慢了下来。这是属于自己的时光，可以阅读、思考，或者只是发呆。',
      excerpt: '阳光透过咖啡馆的窗户，在桌面上投下斑驳的光影...',
      coverImage: '/diary-coffee.jpg',
      category: '随笔',
      date: '2024-01-14',
      views: 987,
      comments: [],
      author: '时光行者'
    },
    {
      id: '3',
      title: '城市的黄昏',
      content: '夕阳西下，整座城市被染成了金黄色。站在高处俯瞰，楼宇间的光影交错，构成了一幅美丽的画卷。城市的黄昏总是让人感到既熟悉又陌生，熟悉的是每天都在这里生活，陌生的是每一次黄昏都有不同的美。这是属于城市的诗意时刻。',
      excerpt: '夕阳西下，整座城市被染成了金黄色...',
      coverImage: '/diary-city.jpg',
      category: '摄影',
      date: '2024-01-13',
      views: 2156,
      comments: [],
      author: '时光行者'
    }
  ];

  const defaultUsers: User[] = [
    {
      id: '1',
      username: '时光行者',
      createdAt: '2024-01-01'
    }
  ];

  if (!localStorage.getItem('diaries')) {
    localStorage.setItem('diaries', JSON.stringify(defaultDiaries));
  }
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(defaultUsers));
  }
  if (!localStorage.getItem('currentUser')) {
    localStorage.setItem('currentUser', JSON.stringify(null));
  }
};

// 用户管理
export const useUser = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    initializeData();
    const stored = localStorage.getItem('currentUser');
    if (stored && stored !== 'null') {
      setCurrentUser(JSON.parse(stored));
    }
    setIsLoaded(true);
  }, []);

  const register = useCallback((username: string): User | null => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // 检查用户名是否已存在
    if (users.some((u: User) => u.username === username)) {
      return null;
    }

    const newUser: User = {
      id: generateId(),
      username,
      createdAt: new Date().toISOString().split('T')[0]
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    setCurrentUser(newUser);
    
    // 更新总用户数统计
    const stats = JSON.parse(localStorage.getItem('stats') || '{}');
    stats.totalUsers = (stats.totalUsers || 5000) + 1;
    localStorage.setItem('stats', JSON.stringify(stats));
    
    return newUser;
  }, []);

  const login = useCallback((username: string): User | null => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: User) => u.username === username);
    
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      setCurrentUser(user);
      return user;
    }
    return null;
  }, []);

  const logout = useCallback(() => {
    localStorage.setItem('currentUser', JSON.stringify(null));
    setCurrentUser(null);
  }, []);

  return { currentUser, isLoaded, register, login, logout };
};

// 日记管理
export const useDiaries = () => {
  const [diaries, setDiaries] = useState<Diary[]>([]);

  useEffect(() => {
    initializeData();
    const stored = localStorage.getItem('diaries');
    if (stored) {
      setDiaries(JSON.parse(stored));
    }
  }, []);

  const getDiaryById = useCallback((id: string): Diary | undefined => {
    return diaries.find(d => d.id === id);
  }, [diaries]);

  const getDiariesByCategory = useCallback((category: string): Diary[] => {
    return diaries.filter(d => d.category === category);
  }, [diaries]);

  const addComment = useCallback((diaryId: string, user: User, content: string): boolean => {
    const stored = JSON.parse(localStorage.getItem('diaries') || '[]');
    const diaryIndex = stored.findIndex((d: Diary) => d.id === diaryId);
    
    if (diaryIndex === -1) return false;

    const newComment: Comment = {
      id: generateId(),
      diaryId,
      userId: user.id,
      username: user.username,
      avatar: user.avatar,
      content,
      createdAt: new Date().toISOString()
    };

    stored[diaryIndex].comments.push(newComment);
    localStorage.setItem('diaries', JSON.stringify(stored));
    setDiaries(stored);
    
    return true;
  }, []);

  const incrementViews = useCallback((diaryId: string) => {
    const stored = JSON.parse(localStorage.getItem('diaries') || '[]');
    const diaryIndex = stored.findIndex((d: Diary) => d.id === diaryId);
    
    if (diaryIndex !== -1) {
      stored[diaryIndex].views += 1;
      localStorage.setItem('diaries', JSON.stringify(stored));
      setDiaries(stored);
    }
  }, []);

  return {
    diaries,
    getDiaryById,
    getDiariesByCategory,
    addComment,
    incrementViews
  };
};

// 统计数据
export const useStats = () => {
  const [stats, setStats] = useState({
    totalViews: 50000,
    totalDiaries: 200,
    totalUsers: 5000
  });

  useEffect(() => {
    const stored = localStorage.getItem('stats');
    if (stored) {
      setStats(JSON.parse(stored));
    } else {
      localStorage.setItem('stats', JSON.stringify(stats));
    }
  }, []);

  return stats;
};
