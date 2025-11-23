import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

import otterMegaphone from '../assets/otter-megaphone.jpg';
import otterWhiteboard from '../assets/otter-whiteboard.jpg';
import otterComputer from '../assets/otter-computer.jpg';

interface Slide {
  id: string;
  headline: string;
  description: string;
  cta: string;
  image: string;
  color: string;
}

const slides: Slide[] = [
  {
    id: '01',
    headline: "Otter = Embedded data access.",
    description:
      "Otter is a protocol that adds a native, standard data-exchange layer to the Sui ecosystem. Data providers embed their contract entrypoint directly in the blob.",
    cta: "EXPLORE PROTOCOL",
    image: otterMegaphone,
    color: "#e0e7ff"
  },
  {
    id: '02',
    headline: "Otter = Zero-UI data economy.",
    description:
      "Enable autonomous agents and users to request access, verify policies, and decrypt data without any human interface. A true automated data marketplace.",
    cta: "READ THE DOCS",
    image: otterWhiteboard,
    color: "#f3e8ff"
  },
  {
    id: '03',
    headline: "Completing the Sui Stack.",
    description:
      "Otter is the final layer that completes Sui + Seal + Walrus. It connects storage to execution, creating a seamless environment for decentralized data exchange.",
    cta: "JOIN TELEGRAM",
    image: otterComputer,
    color: "#ffedd5"
  },
];

export default function OtterScrollSection() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 200 };
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
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <div className="w-full bg-white flex flex-col font-sans">
      
      <div className="w-full px-8 md:px-24 pt-20 pb-10 bg-white relative z-20">
        <h1 className="text-4xl md:text-6xl text-slate-900 mb-4 uppercase tracking-tighter" style={{ fontFamily: '"Press Start 2P", cursive' }}>
          THE PROTOCOL
        </h1>
        <p className="text-xl text-slate-500 font-medium tracking-wide" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
          The native data exchange layer for the Sui ecosystem.
        </p>
      </div>

      <div className="relative h-[110vh] w-full overflow-hidden border-t-4 border-black">
        <div className="flex h-full w-full flex-col md:flex-row">

          <div
            ref={imageContainerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative h-1/2 w-full md:h-full md:w-1/2 bg-slate-100 overflow-hidden cursor-crosshair perspective-[1500px]"
          >
            <div className="absolute inset-0 z-20 pointer-events-none opacity-[0.08]" 
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

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
            
            <div className="absolute inset-0 z-10 pointer-events-none opacity-10 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          </div>

          <div className="relative h-1/2 w-full md:h-full md:w-1/2 bg-white flex flex-col justify-center px-8 md:px-24 border-l-0 md:border-l-4 border-black">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
                  exit: { opacity: 0, transition: { duration: 0.2 } }
                }}
              >
                <motion.div
                  variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                  className="w-16 h-16 border-2 border-black text-black flex items-center justify-center mb-8 text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  style={{ fontFamily: '"Space Mono", monospace', fontWeight: 700, backgroundColor: slides[currentIndex].color }}
                >
                  {slides[currentIndex].id}
                </motion.div>

                <div className="overflow-hidden mb-6">
                  <motion.h2
                    variants={{ 
                      hidden: { y: "100%" }, 
                      visible: { y: 0, transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] } } 
                    }}
                    className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tighter"
                    style={{ fontFamily: '"Space Grotesk", sans-serif' }}
                  >
                    {slides[currentIndex].headline}
                  </motion.h2>
                </div>

                <motion.p
                  variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                  className="text-lg md:text-xl text-slate-600 mb-12 max-w-lg leading-relaxed font-medium"
                  style={{ fontFamily: '"Space Grotesk", sans-serif' }}
                >
                  {slides[currentIndex].description}
                </motion.p>

                <motion.button
                  variants={{ hidden: { x: -20, opacity: 0 }, visible: { x: 0, opacity: 1 } }}
                  className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-black border-2 border-transparent hover:bg-white hover:text-black hover:border-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                  style={{ fontFamily: '"Space Mono", monospace' }}
                >
                  {slides[currentIndex].cta}
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                  <div className="absolute -bottom-2 -right-2 w-full h-full border-2 border-black -z-10 group-hover:bottom-0 group-hover:right-0 transition-all"></div>
                </motion.button>
              </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-12 right-12 flex gap-3">
              {slides.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 transition-all duration-500 ease-\[cubic-bezier\(0\.25\,1\,0\.5\,1\)\] ${
                    idx === currentIndex ? 'w-16 bg-black' : 'w-4 bg-slate-300'
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

interface Image3DCardProps {
  slide: Slide;
  index: number;
  currentIndex: number;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}

function Image3DCard({ slide, index, currentIndex, mouseX, mouseY }: Image3DCardProps) {
  const isActive = index === currentIndex;
  
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [15, -15]); 
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);

  return (
    <motion.div
      initial={ index > currentIndex ? { clipPath: 'inset(100% 0% 0% 0%)' } : { clipPath: 'inset(0% 0% 100% 0%)' }}
      animate={{ 
        clipPath: isActive 
          ? 'inset(0% 0% 0% 0%)' 
          : index < currentIndex 
            ? 'inset(0% 0% 100% 0%)'
            : 'inset(100% 0% 0% 0%)',
        zIndex: isActive ? 10 : 0
      }}
      transition={{ 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1] 
      }}
      className="absolute inset-0 h-full w-full flex items-center justify-center p-12 md:p-24"
    >
      <motion.div
        style={{
          rotateX: isActive ? rotateX : 0,
          rotateY: isActive ? rotateY : 0,
          scale: isActive ? 1 : 0.9,
        }}
        className="relative w-full h-full shadow-2xl overflow-hidden border-4 border-black bg-black"
      >
          <motion.img
            src={slide.image}
            alt={slide.headline}
            style={{ scale: 1.2 }} 
            animate={{ 
                scale: isActive ? 1.2 : 1.4,
                filter: isActive ? 'grayscale(0%) contrast(100%)' : 'grayscale(100%) contrast(120%)'
            }}
            transition={{ duration: 0.8 }}
            className="w-full h-full object-cover"
          />

          <motion.div 
            style={{
                background: useTransform(
                    mouseX, 
                    [-0.5, 0.5], 
                    ['linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 45%, rgba(255,255,255,0) 50%)', 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0) 45%, rgba(255,255,255,0) 50%)']
                ),
                x: useTransform(mouseX, [-0.5, 0.5], ['-100%', '100%'])
            }}
            className="absolute inset-0 z-20 pointer-events-none"
          />
      </motion.div>
    </motion.div>
  );
}