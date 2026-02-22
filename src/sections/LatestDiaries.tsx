import { useEffect, useRef, useState } from 'react';
import { Calendar, Eye, MessageCircle } from 'lucide-react';
import type { Diary } from '@/types';

interface LatestDiariesProps {
  diaries: Diary[];
  onDiaryClick: (diary: Diary) => void;
}

const LatestDiaries = ({ diaries, onDiaryClick }: LatestDiariesProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
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

  const latestDiaries = diaries.slice(0, 3);
  const featuredDiary = latestDiaries[0];
  const sideDiaries = latestDiaries.slice(1);

  return (
    <section 
      id="latest-diaries"
      ref={sectionRef}
      className="py-20 lg:py-32 bg-white"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题 */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] mb-4">最新日记</h2>
          <p className="text-[#666666] text-lg">探索最新的故事与思考</p>
        </div>

        {/* 日记网格 */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* 特色大卡片 */}
          {featuredDiary && (
            <div 
              className={`lg:col-span-3 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
            >
              <div 
                onClick={() => onDiaryClick(featuredDiary)}
                className="group relative h-full min-h-[400px] lg:min-h-[500px] rounded-2xl overflow-hidden cursor-pointer"
                style={{ perspective: '1000px' }}
              >
                <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                  <img 
                    src={featuredDiary.coverImage} 
                    alt={featuredDiary.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/90 via-[#1a1a1a]/40 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="px-3 py-1 bg-[#ff6e00] text-white text-sm rounded-full">
                      {featuredDiary.category}
                    </span>
                    <span className="flex items-center gap-1 text-white/80 text-sm">
                      <Calendar className="w-4 h-4" />
                      {featuredDiary.date}
                    </span>
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3 group-hover:text-[#ff6e00] transition-colors">
                    {featuredDiary.title}
                  </h3>
                  <p className="text-white/80 text-base lg:text-lg line-clamp-2 mb-4">
                    {featuredDiary.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-white/60 text-sm">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {featuredDiary.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {featuredDiary.comments.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 侧边小卡片 */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {sideDiaries.map((diary, index) => (
              <div 
                key={diary.id}
                className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}
                style={{ transitionDelay: `${(index + 2) * 100}ms` }}
              >
                <div 
                  onClick={() => onDiaryClick(diary)}
                  className="group flex gap-4 p-4 rounded-xl bg-[#f2f2f2] hover:bg-white hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={diary.coverImage} 
                      alt={diary.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-[#ff6e00]/10 text-[#ff6e00] text-xs rounded-full">
                        {diary.category}
                      </span>
                      <span className="text-[#a6a6a6] text-xs">{diary.date}</span>
                    </div>
                    <h4 className="font-bold text-[#1a1a1a] mb-2 group-hover:text-[#ff6e00] transition-colors line-clamp-1">
                      {diary.title}
                    </h4>
                    <p className="text-[#666666] text-sm line-clamp-2">
                      {diary.excerpt}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestDiaries;
