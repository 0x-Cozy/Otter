import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, MousePointer2 } from 'lucide-react';

import otterMegaphone from '../assets/otter-megaphone.jpg';
import otterWhiteboard from '../assets/otter-whiteboard.jpg';
import otterComputer from '../assets/otter-computer.jpg';

const slides = [
  {
    id: '01',
    headline: "Otter = Embedded data access.",
    description: "Otter is a protocol that adds a native, standard data-exchange layer to the Sui ecosystem. Data providers embed their contract entrypoint directly in the blob.",
    cta: "EXPLORE PROTOCOL",
    image: otterMegaphone,
  },
  {
    id: '02',
    headline: "Otter = Zero-UI data economy.",
    description: "Enable autonomous agents and users to request access, verify policies, and decrypt data without any human interface. A true automated data marketplace.",
    cta: "READ THE DOCS",
    image: otterWhiteboard,
  },
  {
    id: '03',
    headline: "Completing the Sui Stack.",
    description: "Otter is the final layer that completes Sui + Seal + Walrus. It connects storage to execution, creating a seamless environment for decentralized data exchange.",
    cta: "JOIN TELEGRAM",
    image: otterComputer,
  },
];

export default function OtterScrollSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 30, stiffness: 200 }; 
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imageContainerRef.current) return;
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  useEffect(() => {
    const element = imageContainerRef.current;
    
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      
      if (isAnimating) return;

      const isScrollingDown = e.deltaY > 0;
      const isScrollingUp = e.deltaY < 0;

      if (isScrollingDown) {
        if (currentIndex < slides.length - 1) {
          triggerChange(currentIndex + 1);
        }
        
      } else if (isScrollingUp) {
        if (currentIndex > 0) {
          triggerChange(currentIndex - 1);
        }
      }
    };

    if (element) {
      element.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (element) {
        element.removeEventListener('wheel', handleWheel);
      }
    };
  }, [currentIndex, isAnimating]);

  const triggerChange = (newIndex: number) => {
    setIsAnimating(true);
    setCurrentIndex(newIndex);
    setTimeout(() => setIsAnimating(false), 1200); 
  };

  return (
    <div className="w-full bg-white flex flex-col font-sans">

      <div className="w-full px-8 md:px-24 pt-20 pb-10 bg-white">
        <h1 className="text-4xl md:text-6xl text-slate-900 mb-4 uppercase tracking-tighter" style={{ fontFamily: '"Press Start 2P", cursive' }}>
          THE PROTOCOL
        </h1>
        <p className="text-xl text-slate-500 font-medium tracking-wide" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
          The native data layer for the Sui ecosystem.
        </p>
      </div>

      <div className="relative h-screen w-full overflow-hidden border-t border-slate-100">
        <div className="flex h-full w-full flex-col md:flex-row">

          <div
            ref={imageContainerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative h-1/2 w-full md:h-full md:w-1/2 bg-slate-100 overflow-hidden cursor-crosshair perspective-[1200px] group"
          >
            <div className="absolute top-6 left-0 w-full z-30 flex flex-col items-center justify-center pointer-events-none mix-blend-difference text-white opacity-60 group-hover:opacity-100 transition-opacity duration-500">
               <div className="flex items-center gap-2 mb-1">
                 <MousePointer2 size={16} className="animate-bounce" />
                 <span className="font-mono text-xs tracking-[0.2em] font-bold">SCROLL TO INTERACT</span>
               </div>
               <div className="w-32 h-[1px] bg-white/50"></div>
            </div>

            <AnimatePresence initial={false}>
              {slides.map((slide, index) => {
                
                if (Math.abs(index - currentIndex) > 1) return null;
                
                return (
                  <Image3DCard
                    key={slide.id}
                    slide={slide}
                    index={index}
                    currentIndex={currentIndex}
                    mouseX={smoothMouseX}
                    mouseY={smoothMouseY}
                  />
                );
              })}
            </AnimatePresence>

            <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.05] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          </div>

          <div className="relative h-1/2 w-full md:h-full md:w-1/2 bg-white flex flex-col justify-center px-8 md:px-24 z-10 border-l border-slate-100 shadow-[-20px_0px_40px_rgba(0,0,0,0.05)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} 
              >
                <div className="w-12 h-12 bg-purple-50 text-purple-900 rounded-lg flex items-center justify-center mb-8 text-lg border border-purple-100" style={{ fontFamily: '"Space Mono", monospace', fontWeight: 700 }}>
                  {slides[currentIndex].id}
                </div>

                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-6 tracking-tight" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                  {slides[currentIndex].headline}
                </h2>

                <p className="text-lg text-slate-500 mb-10 max-w-md leading-relaxed" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                  {slides[currentIndex].description}
                </p>

                <button className="group flex w-fit items-center gap-3 text-sm font-bold tracking-wider text-slate-900 uppercase hover:opacity-70 transition-opacity" style={{ fontFamily: '"Space Mono", monospace' }}>
                  {slides[currentIndex].cta}
                  <div className="bg-slate-900 text-white p-1 rounded transition-transform group-hover:translate-x-1">
                    <ArrowRight size={16} />
                  </div>
                </button>
              </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-12 right-12 flex gap-3">
              {slides.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    idx === currentIndex ? 'w-12 bg-slate-900' : 'w-3 bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

 
function Image3DCard({ slide, index, currentIndex, mouseX, mouseY }: any) {
  const isActive = index === currentIndex;
  const isPast = index < currentIndex;
  
  
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [8, -8]); 
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-8, 8]);

  return (
    <motion.div
      initial={ isPast ? { clipPath: 'inset(0% 0% 0% 0%)' } : { clipPath: 'inset(100% 0% 0% 0%)' }}
      animate={{ 
        clipPath: isActive 
          ? 'inset(0% 0% 0% 0%)' 
          : isPast
            ? 'inset(0% 0% 100% 0%)'
            : 'inset(100% 0% 0% 0%)',
        zIndex: isActive ? 10 : 0
      }}
      transition={{ 
        duration: 1.2, 
        ease: [0.16, 1, 0.3, 1]
      }}
      className="absolute inset-0 h-full w-full flex items-center justify-center p-12 md:p-20"
      style={{ perspective: 1000 }}
    >
      <motion.div
        style={{
          rotateX: isActive ? rotateX : 0,
          rotateY: isActive ? rotateY : 0,
          scale: isActive ? 1 : 0.95,
        }}
        className="relative w-full h-full shadow-2xl overflow-hidden bg-white"
      >
        <motion.img
          src={slide.image}
          alt={slide.headline}
          style={{ scale: 1.1, x: useTransform(mouseX, [-0.5, 0.5], ['-3%', '3%']) }} 
          className="w-full h-full object-cover"
        />
        
        
        <motion.div 
            style={{
                background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 45%, rgba(255,255,255,0) 50%)',
                x: useTransform(mouseX, [-0.5, 0.5], ['-150%', '150%'])
            }}
            className="absolute inset-0 z-20 pointer-events-none mix-blend-overlay"
        />
      </motion.div>
    </motion.div>
  );
}