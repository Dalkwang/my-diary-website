import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current || !contentRef.current || !imageRef.current) return;
      
      const scrollY = window.scrollY;
      const heroHeight = heroRef.current.offsetHeight;
      
      if (scrollY < heroHeight) {
        const progress = scrollY / heroHeight;
        contentRef.current.style.transform = `translateY(${-scrollY * 0.3}px)`;
        contentRef.current.style.opacity = `${1 - progress * 1.5}`;
        imageRef.current.style.transform = `translateY(${-scrollY * 0.15}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToContent = () => {
    const nextSection = document.getElementById('latest-diaries');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#f2f2f2] via-white to-[#f2f2f2]"
    >
      {/* 装饰性圆圈 */}
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full border-2 border-[#ff6e00]/20 animate-pulse" />
      <div className="absolute bottom-40 right-20 w-20 h-20 rounded-full bg-[#ff6e00]/10" />
      <div className="absolute top-1/3 right-1/4 w-4 h-4 rounded-full bg-[#ff6e00]" />
      
      {/* 主内容区 */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 items-center w-full">
          
          {/* 左侧文字内容 */}
          <div 
            ref={contentRef}
            className="space-y-6 lg:pr-12"
            style={{ willChange: 'transform, opacity' }}
          >
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1a1a1a] leading-tight tracking-tight">
                <span className="block overflow-hidden">
                  <span className="block animate-[slideUp_0.8s_ease-out_0.2s_both]">时光日记</span>
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-[#666666] leading-relaxed max-w-lg animate-[fadeIn_0.6s_ease-out_0.6s_both]">
                记录生活的点滴，分享每日的故事。每一天都是新的一页，每一刻都值得被铭记。
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 animate-[fadeIn_0.5s_ease-out_0.8s_both]">
              <Button 
                onClick={scrollToContent}
                className="bg-[#ff6e00] hover:bg-[#e56200] text-white px-8 py-6 text-base font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#ff6e00]/30"
              >
                开始阅读
              </Button>
            </div>

            {/* 统计数据预览 */}
            <div className="flex gap-8 pt-6 animate-[fadeIn_0.5s_ease-out_1s_both]">
              <div>
                <div className="text-2xl font-bold text-[#1a1a1a]">200+</div>
                <div className="text-sm text-[#666666]">日记篇数</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#1a1a1a]">50K+</div>
                <div className="text-sm text-[#666666]">总阅读量</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#1a1a1a]">5K+</div>
                <div className="text-sm text-[#666666]">注册用户</div>
              </div>
            </div>
          </div>

          {/* 右侧图片 */}
          <div 
            ref={imageRef}
            className="relative lg:pl-12"
            style={{ willChange: 'transform' }}
          >
            <div className="relative animate-[slideInRight_1s_ease-out_0.4s_both]">
              {/* 主图 */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-[#1a1a1a]/20">
                <img 
                  src="/hero-portrait.jpg" 
                  alt="时光日记"
                  className="w-full h-[500px] lg:h-[600px] object-cover"
                />
                {/* 渐变叠加 */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/30 via-transparent to-transparent" />
              </div>
              
              {/* 装饰元素 */}
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-[#ff6e00] rounded-lg -z-10" />
              <div className="absolute -top-6 -right-6 w-16 h-16 border-2 border-[#ff6e00] rounded-lg -z-10" />
            </div>
          </div>
        </div>
      </div>

      {/* 滚动提示 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-[#666666]" />
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px) rotateY(-15deg);
          }
          to {
            opacity: 1;
            transform: translateX(0) rotateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
