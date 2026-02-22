// 用户类型
export interface User {
  id: string;
  username: string;
  avatar?: string;
  createdAt: string;
}

// 评论类型
export interface Comment {
  id: string;
  diaryId: string;
  userId: string;
  username: string;
  avatar?: string;
  content: string;
  createdAt: string;
}

// 日记类型
export interface Diary {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage: string;
  category: string;
  date: string;
  views: number;
  comments: Comment[];
  author: string;
}

// 分类类型
export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  count: number;
}

// 统计数据类型
export interface Stats {
  totalViews: number;
  totalDiaries: number;
  totalUsers: number;
}
