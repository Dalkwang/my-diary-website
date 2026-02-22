import { useEffect, useRef, useState } from 'react';
import { 
  Home, 
  Plane, 
  UtensilsCrossed, 
  Camera, 
  PenTool, 
  Music, 
  Film, 
  BookOpen 
} from 'lucide-react';

interface CategoriesProps {
  onCategoryClick: (category: string) => void;
}

const Categories = ({ onCategoryClick }: CategoriesProps) => {
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

  const categories = [
    { id: 'life', name: '生活', description: '日常生活的点滴记录', image: '/category-life.jpg', icon: Home },
    { id: 'travel', name: '旅行', description: '探索世界的美好', image: '/category-travel.jpg', icon: Plane },
    { id: 'food', name: '美食', description: '味蕾的奇妙旅程', image: '/category-food.jpg', icon: UtensilsCrossed },
    { id: 'photo', name: '摄影', description: '用镜头捕捉瞬间', image: '/category-photo.jpg', icon: Camera },
    { id: 'essay', name: '随笔', description: '随心的思考与感悟', image: '/category-essay.jpg', icon: PenTool },
    { id: 'music', name: '音乐', description: '旋律中的故事', image: '/category-music.jpg', icon: Music },
    { id: 'movie', name: '电影', description: '银幕内外的世界', image: '/category-movie.jpg', icon: Film },
    { id: 'book', name: '读书', description: '文字带来的启发', image: '/category-book.jpg', icon: BookOpen },
  ];

  return (
    <section 
      ref={sectionRef}
      className="py-20 lg:py-32 bg-[#f2f2f2]"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题 */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] mb-4">故事类别</h2>
          <p className="text-[#666666] text-lg">选择你感兴趣的主题</p>
        </div>

        {/* 分类网格 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category, index) => (
            <div 
              key={category.id}
              className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{ 
                transitionDelay: `${(index + 1) * 50}ms`,
                transform: isVisible ? `rotate(${index % 2 === 0 ? '-1' : '1'}deg)` : 'none'
              }}
            >
              <div 
                onClick={() => onCategoryClick(category.name)}
                className="group relative h-40 sm:h-48 rounded-xl overflow-hidden cursor-pointer"
              >
                {/* 背景图片 */}
                <div className="absolute inset-0">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                
                {/* 渐变叠加 */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/90 via-[#1a1a1a]/50 to-[#1a1a1a]/20 group-hover:from-[#ff6e00]/90 group-hover:via-[#ff6e00]/70 transition-all duration-500" />
                
                {/* 内容 */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <category.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white mb-2 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-1">{category.name}</h3>
                  <p className="text-white/80 text-xs sm:text-sm text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {category.description}
                  </p>
                </div>

                {/* 边框效果 */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/30 rounded-xl transition-colors duration-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
