import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Twitter, Github, Disc, Box } from 'lucide-react';
import otterMascot from '../assets/otter.png'; 

interface MousePosition {
  x: number;
  y: number;
}

interface FooterColumn {
  title: string;
  links: string[];
}

const OtterFooter: React.FC = () => {
  const footerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [mousePos, setMousePos] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1, 
        rootMargin: "-50px" 
      }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    const handleMouseMove = (e: MouseEvent): void => {
      if (!footerRef.current) return;
      const rect = footerRef.current.getBoundingClientRect();
      
      const x = (e.clientX - rect.left) / rect.width; 
      const y = (e.clientY - rect.top) / rect.height; 
      
      const limitedX = Math.max(0, Math.min(1, x));
      const limitedY = Math.max(0, Math.min(1, y));

      setMousePos({ x: limitedX - 0.5, y: limitedY - 0.5 });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      if (footerRef.current) observer.unobserve(footerRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const footerColumns: FooterColumn[] = [
    { title: 'Discover', links: ['OTTER', 'NETWORK', 'DEFLATION'] },
    { title: 'Build', links: ['GET STARTED', 'DOCS', 'GITHUB'] },
    { title: 'Join', links: ['TWITTER', 'DISCORD'] },
    { title: 'Use', links: ['SDK', 'APPS & SERVICES'] }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted');
  };

  return (
    <div 
      ref={footerRef}
      className="relative w-full border-t-4 border-black font-mono bg-[#22d3ee] overflow-hidden perspective-[2000px]"
    >
      <div 
        className="absolute inset-0 z-0 pointer-events-none transition-transform duration-100 ease-out"
        style={{
          transform: `translate3d(${mousePos.x * -40}px, ${mousePos.y * -40}px, 0) scale(1.1)`
        }}
      >
        <div 
          className="w-full h-full opacity-20 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, #000 1px, transparent 1px),
              linear-gradient(to bottom, #000 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className={`absolute top-0 left-0 right-0 h-16 z-10 hidden md:flex pointer-events-none transition-all duration-[1500ms] cubic-bezier(0.16, 1, 0.3, 1) ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
         <div className="w-16 h-16 bg-white border-r border-b border-black"></div>
         <div className="w-16 h-16 bg-white border-r border-b border-black"></div>
         <div className="w-16 h-16 bg-transparent border-r border-b border-black/20"></div>
         <div className="w-16 h-16 bg-white border-r border-b border-black ml-20"></div>
         <div className="absolute right-32 w-16 h-16 bg-white border-l border-b border-black"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 lg:pt-32 pb-12 sm:pb-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-end">
          
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start relative order-2 lg:order-1">
            
            <div 
              className={`relative mb-6 sm:mb-8 bg-white border-2 border-black px-6 sm:px-8 py-4 sm:py-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-[1500ms] cubic-bezier(0.34, 1.56, 0.64, 1) delay-200 ${isVisible ? 'opacity-100 translate-y-0 scale-100 rotate-0' : 'opacity-0 translate-y-32 scale-50 -rotate-12'}`}
              style={{
                transform: isVisible ? `translate3d(${mousePos.x * 20}px, ${mousePos.y * 20}px, 0)` : undefined
              }}
            >
              <p className="font-bold text-lg sm:text-xl uppercase tracking-tight text-black">Let's Connect</p>
              <div className="absolute -bottom-3 sm:-bottom-4 left-6 sm:left-8 w-0 h-0 border-l-[12px] sm:border-l-[16px] border-l-transparent border-r-[12px] sm:border-r-[16px] border-r-transparent border-t-[12px] sm:border-t-[16px] border-t-black"></div>
              <div className="absolute -bottom-[10px] sm:-bottom-[13px] left-6 sm:left-8 w-0 h-0 border-l-[12px] sm:border-l-[16px] border-l-transparent border-r-[12px] sm:border-r-[16px] border-r-transparent border-t-[12px] sm:border-t-[16px] border-t-white"></div>
            </div>

            <div 
              className={`relative w-64 sm:w-80 lg:w-[450px] transition-all duration-[2000ms] cubic-bezier(0.16, 1, 0.3, 1) ${isVisible ? 'translate-y-0 opacity-100 grayscale-0' : 'translate-y-[150%] opacity-0 grayscale'}`}
              style={{
                transform: isVisible 
                  ? `translate3d(${mousePos.x * -30}px, ${mousePos.y * -30}px, 0)` 
                  : undefined 
              }}
            >
              <img 
                src={otterMascot} 
                alt="Otter Mascot" 
                className="w-full h-full object-contain filter drop-shadow-[20px_20px_0px_rgba(0,0,0,0.1)]"
              />
            </div>
          </div>

          <div 
            className="lg:col-span-7 w-full perspective-[1000px] order-1 lg:order-2"
            style={{
                transform: window.innerWidth >= 1024 ? `rotateX(${mousePos.y * 5}deg) rotateY(${mousePos.x * -5}deg)` : 'none',
                transition: 'transform 0.1s ease-out'
            }}
          >
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16">
              {footerColumns.map((column, colIndex) => (
                <div 
                  key={column.title} 
                  className={`space-y-3 sm:space-y-4 transition-all duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1)`}
                  style={{ 
                    transitionDelay: `${300 + (colIndex * 150)}ms`,
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible 
                      ? 'translate3d(0,0,0) rotateX(0deg)' 
                      : 'translate3d(0, 100px, -100px) rotateX(45deg)'
                  }}
                >
                  <h4 className="font-black text-black text-xs sm:text-sm uppercase border-b-4 border-black inline-block pb-1 mb-2">{column.title}</h4>
                  <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm font-bold text-slate-800">
                    {column.links.map(link => (
                      <li key={link}>
                        <a 
                          href="#" 
                          className="hover:bg-white hover:text-black px-1 -ml-1 transition-all inline-block hover:translate-x-2 hover:scale-110 origin-left break-words"
                          onClick={(e) => e.preventDefault()}
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div 
              className={`bg-white border-4 border-black p-0 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-[1500ms] cubic-bezier(0.16, 1, 0.3, 1) delay-500 will-change-transform ${isVisible ? 'opacity-100 translate-x-0 rotate-y-0' : 'opacity-0 translate-x-40 rotate-y-12'}`}
            >
              <div className="bg-black text-white px-4 sm:px-6 py-2 sm:py-3 font-bold uppercase text-xs sm:text-sm tracking-wider flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 sm:gap-3">
                    <Box size={16} className="sm:w-[18px] sm:h-[18px] animate-pulse text-[#22d3ee]" /> 
                    <span className="text-[10px] sm:text-sm">System Update // Newsletter</span>
                </div>
                <div className="flex gap-1">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#22d3ee]"></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-white"></div>
                </div>
              </div>
              
              <div className="p-6 sm:p-8 md:p-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none hidden sm:block">
                    <Box size={120} />
                </div>

                <h3 className="text-2xl sm:text-3xl font-black uppercase mb-2 sm:mb-3 text-black relative z-10">Sign up for updates</h3>
                <p className="text-black font-medium mb-6 sm:mb-8 text-xs sm:text-sm relative z-10 max-w-md">Join the Otter data layer. Secure the blob. Don't miss a beat.</p>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5 relative z-10">
                  <input 
                    type="email" 
                    placeholder="ENTER YOUR EMAIL..." 
                    className="w-full bg-slate-100 border-2 border-black px-4 sm:px-6 py-3 sm:py-4 outline-none focus:bg-[#22d3ee] focus:placeholder-black text-black transition-all placeholder:text-slate-400 font-mono font-bold text-sm sm:text-lg shadow-[4px_4px_0px_rgba(0,0,0,0.2)] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px]"
                    required
                  />
                  
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <input 
                        type="checkbox" 
                        id="marketing" 
                        className="mt-0.5 sm:mt-1 w-4 h-4 sm:w-5 sm:h-5 border-2 border-black text-black focus:ring-0 rounded-none cursor-pointer flex-shrink-0" 
                        required
                      />
                      <label htmlFor="marketing" className="text-[10px] sm:text-xs font-bold leading-tight cursor-pointer select-none text-black pt-0.5 sm:pt-1">
                        I AGREE TO RECEIVE COMMS FROM <br className="hidden sm:inline"/>OTTER PROTOCOL.
                      </label>
                    </div>

                    <button 
                      type="submit"
                      className="w-full md:w-auto bg-black text-[#22d3ee] px-8 sm:px-10 py-3 sm:py-4 font-black uppercase text-xs sm:text-sm hover:bg-white hover:text-black border-2 border-transparent hover:border-black transition-all flex items-center justify-center gap-2 sm:gap-3 shadow-[4px_4px_0px_rgba(34,211,238,1)] sm:shadow-[6px_6px_0px_rgba(34,211,238,1)] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 active:translate-y-0 active:shadow-none group cursor-pointer"
                    >
                      Submit <ArrowRight size={18} className="sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform" />
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div 
              className={`mt-12 sm:mt-16 pt-6 sm:pt-8 border-t-2 border-black flex flex-col md:flex-row justify-between items-center text-[10px] sm:text-xs font-bold uppercase tracking-wider text-black transition-all duration-[1000ms] delay-700 gap-3 sm:gap-0 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
               <p className="text-center md:text-left">© 2025 OTTER PROTOCOL.</p>
               <div className="flex gap-4 sm:gap-6 flex-wrap justify-center">
                 <a href="#" className="hover:bg-black hover:text-[#22d3ee] px-1 transition-colors cursor-pointer whitespace-nowrap">Privacy Policy</a>
                 <a href="#" className="hover:bg-black hover:text-[#22d3ee] px-1 transition-colors cursor-pointer whitespace-nowrap">Terms of Service</a>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default OtterFooter;