import { useEffect, useRef, useState } from 'react';
import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Diary } from '@/types';

interface PopularStoriesProps {
  diaries: Diary[];
  onDiaryClick: (diary: Diary) => void;
}

const PopularStories = ({ diaries, onDiaryClick }: PopularStoriesProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 420;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // 模拟热门故事数据
  const popularStories = [
    { id: 'pop1', title: '春日漫步', views: 2300, date: '2024-01-10', image: '/story-spring.jpg' },
    { id: 'pop2', title: '星空下的思考', views: 1800, date: '2024-01-08', image: '/story-stars.jpg' },
    { id: 'pop3', title: '老街的记忆', views: 1500, date: '2024-01-05', image: '/story-oldstreet.jpg' },
    { id: 'pop4', title: '海边的日落', views: 1200, date: '2024-01-03', image: '/story-sea.jpg' },
  ];

  return (
    <section 
      ref={sectionRef}
      className="py-20 lg:py-32 bg-[#f2f2f2]"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题和导航 */}
        <div className={`flex items-center justify-between mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] mb-4">热门故事</h2>
            <p className="text-[#666666] text-lg">最受欢迎的精彩篇章</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('left')}
              className="rounded-full border-[#1a1a1a]/20 hover:bg-[#ff6e00] hover:text-white hover:border-[#ff6e00] transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('right')}
              className="rounded-full border-[#1a1a1a]/20 hover:bg-[#ff6e00] hover:text-white hover:border-[#ff6e00] transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* 横向滚动画廊 */}
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {popularStories.map((story, index) => (
            <div 
              key={story.id}
              className={`flex-shrink-0 w-[300px] sm:w-[380px] snap-start transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{ 
                transitionDelay: `${(index + 1) * 100}ms`,
                perspective: '1000px'
              }}
            >
              <div 
                onClick={() => {
                  const diary = diaries.find(d => d.title === story.title) || diaries[0];
                  onDiaryClick(diary);
                }}
                className="group relative h-[450px] sm:h-[500px] rounded-2xl overflow-hidden cursor-pointer bg-white shadow-lg hover:shadow-2xl transition-all duration-500"
                style={{
                  transform: `rotateY(${index % 2 === 0 ? '-2deg' : '2deg'})`,
                }}
              >
                {/* 图片 */}
                <div className="absolute inset-0">
                  <img 
                    src={story.image} 
                    alt={story.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                
                {/* 渐变叠加 */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/90 via-[#1a1a1a]/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                
                {/* 内容 */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex items-center gap-1 text-white/80 text-sm">
                      <Eye className="w-4 h-4" />
                      {(story.views / 1000).toFixed(1)}k
                    </span>
                    <span className="text-white/60 text-sm">{story.date}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#ff6e00] transition-colors">
                    {story.title}
                  </h3>
                </div>

                {/* 悬停效果 */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#ff6e00] rounded-2xl transition-colors duration-300" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default PopularStories;
