import { useEffect, useRef, useState } from 'react';
import { Eye, BookOpen, Users } from 'lucide-react';

interface StatsProps {
  stats: {
    totalViews: number;
    totalDiaries: number;
    totalUsers: number;
  };
}

const Stats = ({ stats }: StatsProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({
    totalViews: 0,
    totalDiaries: 0,
    totalUsers: 0
  });

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

  // 数字动画
  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setAnimatedStats({
        totalViews: Math.floor(stats.totalViews * easeOut),
        totalDiaries: Math.floor(stats.totalDiaries * easeOut),
        totalUsers: Math.floor(stats.totalUsers * easeOut)
      });

      if (step >= steps) {
        clearInterval(timer);
        setAnimatedStats(stats);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [isVisible, stats]);

  const statItems = [
    {
      icon: Eye,
      value: animatedStats.totalViews,
      suffix: '+',
      label: '总阅读量',
      color: 'from-[#ff6e00] to-[#ff8c00]'
    },
    {
      icon: BookOpen,
      value: animatedStats.totalDiaries,
      suffix: '+',
      label: '日记篇数',
      color: 'from-[#ff8c00] to-[#ffa500]'
    },
    {
      icon: Users,
      value: animatedStats.totalUsers,
      suffix: '+',
      label: '注册用户',
      color: 'from-[#ffa500] to-[#ffbf00]'
    }
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(num >= 10000 ? 0 : 1) + 'K';
    }
    return num.toString();
  };

  return (
    <section 
      ref={sectionRef}
      className="py-20 lg:py-32 bg-white"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* 左侧文字 */}
          <div className={`space-y-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a]">
              数字见证
            </h2>
            <p className="text-[#666666] text-lg leading-relaxed">
              每一个数字背后，都是无数的故事与陪伴。感谢每一位读者的支持与厚爱，让我们一起继续书写更多美好的篇章。
            </p>
            <div className="flex items-center gap-4 pt-4">
              <div className="w-16 h-1 bg-[#ff6e00] rounded-full" />
              <span className="text-[#a6a6a6] text-sm">持续更新中</span>
            </div>
          </div>

          {/* 右侧统计卡片 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {statItems.map((item, index) => (
              <div 
                key={item.label}
                className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                style={{ transitionDelay: `${(index + 1) * 150}ms` }}
              >
                <div 
                  className="group relative p-6 rounded-2xl bg-white border border-[#f2f2f2] hover:border-[#ff6e00]/30 hover:shadow-xl hover:shadow-[#ff6e00]/10 transition-all duration-500"
                  style={{
                    animation: isVisible ? `float 4s ease-in-out ${index * 0.5}s infinite` : 'none'
                  }}
                >
                  {/* 图标 */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  {/* 数字 */}
                  <div className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] mb-2">
                    {formatNumber(item.value)}{item.suffix}
                  </div>
                  
                  {/* 标签 */}
                  <div className="text-[#666666] text-sm">
                    {item.label}
                  </div>

                  {/* 装饰光效 */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#ff6e00]/5 to-transparent rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </section>
  );
};

export default Stats;
