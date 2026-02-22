import { useEffect, useRef, useState } from 'react';
import { 
  Twitter, 
  Instagram, 
  Youtube, 
  MessageCircle 
} from 'lucide-react';

const Footer = () => {
  const footerRef = useRef<HTMLDivElement>(null);
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

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const socialLinks = [
    { icon: Twitter, label: '微博', href: '#' },
    { icon: MessageCircle, label: '微信', href: '#' },
    { icon: Youtube, label: '抖音', href: '#' },
    { icon: Instagram, label: '小红书', href: '#' },
  ];

  const navLinks = [
    { label: '首页', href: '#' },
    { label: '关于我们', href: '#' },
    { label: '联系方式', href: '#' },
    { label: '隐私政策', href: '#' },
    { label: '使用条款', href: '#' },
  ];

  return (
    <footer 
      ref={footerRef}
      className="bg-[#1a1a1a] text-white py-12 lg:py-16"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* 上部：Logo 和社交链接 */}
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-6 mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-2xl font-bold">
            时光<span className="text-[#ff6e00]">日记</span>
          </div>
          
          <div className="flex gap-4">
            {socialLinks.map((social, index) => (
              <a
                key={social.label}
                href={social.href}
                className={`w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#ff6e00] transition-all duration-300 hover:-translate-y-1 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
                style={{ transitionDelay: `${(index + 1) * 100}ms` }}
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* 分隔线 */}
        <div className={`h-px bg-white/10 mb-8 transition-all duration-700 delay-300 ${isVisible ? 'scale-x-100' : 'scale-x-0'}`} style={{ transformOrigin: 'center' }} />

        {/* 中部：导航链接 */}
        <div className={`flex flex-wrap justify-center gap-6 mb-8 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-white/60 hover:text-[#ff6e00] transition-colors duration-300 text-sm"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* 下部：版权信息 */}
        <div className={`text-center transition-all duration-700 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-white/40 text-sm mb-2">
            © 2024 时光日记. 保留所有权利.
          </p>
          <p className="text-white/30 text-xs">
            京ICP备XXXXXXXX号
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
