import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { CheckSquare, Terminal, Maximize, Minus, X, ArrowRight, Box, Cpu } from "lucide-react";

const Features: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const textParallax = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const gridY = useTransform(scrollYProgress, [0, 1], ["0%", "5%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[140vh] sm:min-h-[160vh] bg-[#22d3ee] overflow-hidden features-section border-t-4 border-black font-mono"
    >
      <motion.div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{ 
          y: gridY,
          opacity: useTransform(scrollYProgress, [0, 0.9], [0.1, 0.02])
        }}
      >
         <div className="absolute inset-0" style={{ 
             backgroundImage: 'linear-gradient(#000 2px, transparent 2px), linear-gradient(90deg, #000 2px, transparent 2px)', 
             backgroundSize: '60px 60px' 
           }}>
         </div>
      </motion.div>

      {!isMobile && (
        <>
          <motion.div 
            className="absolute top-20 left-10 w-16 h-16 border-4 border-black bg-white z-0 hidden sm:block" 
            style={{ 
              y: backgroundY, 
              rotate: 12,
              opacity: useTransform(scrollYProgress, [0, 0.7], [0.3, 0])
            }} 
          />
          <motion.div 
            className="absolute bottom-40 right-20 w-24 h-24 bg-black z-0 hidden sm:block" 
            style={{ 
              y: useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]), 
              rotate: -12,
              opacity: useTransform(scrollYProgress, [0, 0.7], [0.3, 0])
            }} 
          />
        </>
      )}

      <motion.div 
        className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none select-none"
        style={{ 
          y: backgroundY,
          opacity: useTransform(scrollYProgress, [0, 0.8], [0.04, 0.01])
        }}
      >
        <h1 className="text-black font-black text-[20vw] sm:text-[25vw] leading-none tracking-tighter" style={{ fontFamily: '"Space Grotesk"' }}>
          OTTER
        </h1>
      </motion.div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 pt-20 sm:pt-32 pb-16 sm:pb-24">
          
          <motion.div 
            className="text-center mb-16 sm:mb-24"
            style={{ y: textParallax }}
          >
            <motion.div 
              className="inline-flex items-center gap-3 border-4 border-black bg-white px-4 sm:px-6 py-2 mb-6 sm:mb-8 shadow-[4px_4px_0px_0px_#000] sm:shadow-[8px_8px_0px_0px_#000]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ 
                duration: 0.8, 
                ease: [0.16, 1, 0.3, 1],
                delay: 0.1
              }}
            >
                <div className="flex gap-1">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-black"></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-black/20"></div>
                </div>
                <span className="font-bold text-xs sm:text-sm tracking-widest uppercase">System_Config_V2.json</span>
            </motion.div>

            <motion.h2 
              className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-black mb-4 sm:mb-6 leading-[0.9] tracking-tighter text-black drop-shadow-none px-4" 
              style={{ fontFamily: '"Press Start 2P", cursive' }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ 
                duration: 1, 
                ease: [0.16, 1, 0.3, 1],
                delay: 0.2
              }}
            >
              CORE<br/>FEATURES
            </motion.h2>
            
            <motion.div 
              className="max-w-2xl mx-auto border-l-2 sm:border-l-4 border-black pl-4 sm:pl-6 text-left px-4 sm:px-0"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ 
                duration: 0.8, 
                ease: [0.16, 1, 0.3, 1],
                delay: 0.3
              }}
            >
                <p className="text-base sm:text-lg md:text-xl text-black font-bold leading-relaxed font-mono">
                &gt; Initializing decentralized data exchange...<br/>
                &gt; Loading programmable access control...
                </p>
            </motion.div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 sm:gap-16 max-w-7xl mx-auto px-2 sm:px-0">
            <motion.div
                initial={{ opacity: 0, x: isMobile ? -40 : -80 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ 
                  duration: 1, 
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.1
                }}
            >
                <WindowCard 
                    title="DATA_EXCHANGE.EXE"
                    headerColor="bg-[#bef264]"
                    isMobile={isMobile}
                >
                    <div className="p-4 sm:p-6 md:p-8 flex flex-col h-full relative">
                        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 opacity-10">
                          <Box size={isMobile ? 60 : 100} />
                        </div>
                        
                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase leading-[0.9] mb-4 sm:mb-6 tracking-tighter border-b-2 sm:border-b-4 border-black pb-4 sm:pb-6 relative z-10">
                            PROGRAMMABLE<br/>DATA EXCHANGE
                        </h3>
                        
                        <p className="text-black font-bold text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8 flex-1 relative z-10">
                            A data exchange layer that enables consumers to programmatically choose the amount of data to pay for and decrypt—enabling both human users and AI agents.
                        </p>

                        <div className="bg-black text-[#bef264] p-3 sm:p-4 font-mono text-xs border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,0.2)] sm:shadow-[4px_4px_0px_rgba(0,0,0,0.2)] relative z-10">
                            <code className="text-xs sm:text-sm">
                                $ initiate_transfer --auto<br/>
                                ... locating providers<br/>
                                ... 100% match found
                            </code>
                        </div>
                    </div>
                </WindowCard>
            </motion.div>

            
            <motion.div
                initial={{ opacity: 0, x: isMobile ? 40 : 80 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ 
                  duration: 1, 
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.2
                }}
            >
                <WindowCard 
                    title="ACCESS_CONTROL.BAT"
                    headerColor="bg-[#fbbf24]"
                    isMobile={isMobile}
                >
                    <div className="p-4 sm:p-6 md:p-8 flex flex-col h-full relative">
                        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 opacity-10">
                          <Cpu size={isMobile ? 60 : 100} />
                        </div>

                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase leading-[0.9] mb-4 sm:mb-6 tracking-tighter border-b-2 sm:border-b-4 border-black pb-4 sm:pb-6 relative z-10">
                            PROGRAMMABLE<br/>ACCESS CONTROL
                        </h3>
                        
                        <p className="text-black font-bold text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8 flex-1 relative z-10">
                            Define granular data access policies that enforce themselves. Built on Sui, Walrus and Seal, Otter enables providers to define strict access rules.
                        </p>

                        <div className="flex flex-col gap-2 relative z-10">
                            <div className="flex items-center gap-2 sm:gap-3 font-bold text-xs sm:text-sm p-2 bg-gray-100 border-2 border-black/10">
                                <CheckSquare size={isMobile ? 16 : 20} className="fill-black text-white flex-shrink-0" />
                                <span className="truncate">ENFORCE_ON_CHAIN_RULES</span>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3 font-bold text-xs sm:text-sm p-2 bg-gray-100 border-2 border-black/10">
                                <CheckSquare size={isMobile ? 16 : 20} className="fill-black text-white flex-shrink-0" />
                                <span className="truncate">VERIFY_DECRYPTION_KEYS</span>
                            </div>
                        </div>
                    </div>
                </WindowCard>
            </motion.div>

          </div>

          
          <motion.div 
            className="text-center mt-20 sm:mt-32 px-4 sm:px-0"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ 
              duration: 0.8, 
              ease: [0.16, 1, 0.3, 1],
              delay: 0.4
            }}
          >
            <motion.button 
              className="group relative inline-block"
              whileHover={{ scale: isMobile ? 1.02 : 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
                <motion.div 
                  className="absolute inset-0 bg-black translate-x-3 sm:translate-x-4 translate-y-3 sm:translate-y-4"
                  whileHover={{ 
                    translateX: isMobile ? 4 : 5, 
                    translateY: isMobile ? 4 : 5,
                    transition: { duration: 0.2 }
                  }}
                />
                <div className="relative px-6 sm:px-8 md:px-12 py-4 sm:py-5 md:py-6 bg-white border-3 sm:border-4 border-black text-black font-black font-mono text-xs sm:text-sm uppercase tracking-widest hover:translate-x-1 sm:hover:translate-x-2 hover:translate-y-1 sm:hover:translate-y-2 transition-all duration-200 active:translate-x-2 sm:active:translate-x-4 active:translate-y-2 sm:active:translate-y-4 flex items-center gap-3 sm:gap-4">
                    <Terminal size={isMobile ? 16 : 20} />
                    <span className="whitespace-nowrap">Explore Documentation</span>
                    <ArrowRight size={isMobile ? 16 : 20} className="group-hover:translate-x-1 transition-transform duration-200" />
                </div>
            </motion.button>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

// --- THE 3D WINDOW CARD ---
interface WindowCardProps {
  children: React.ReactNode;
  title: string;
  headerColor?: string;
  isMobile: boolean;
}

const WindowCard: React.FC<WindowCardProps> = ({ 
  children, 
  title, 
  headerColor = "bg-gray-200",
  isMobile
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / rect.width - 0.5;
    const yPct = mouseY / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    x.set(0);
    y.set(0);
  };

  const rotateX = isMobile ? 0 : useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { 
    stiffness: 150, 
    damping: 25,
    mass: 0.5
  });
  const rotateY = isMobile ? 0 : useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { 
    stiffness: 150, 
    damping: 25,
    mass: 0.5
  });
  
  return (
    <motion.div 
      className="relative group perspective-[1500px] h-full"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1] 
      }}
    >
        
        <motion.div 
          className="absolute inset-0 bg-black -z-10"
          initial={{ translateX: isMobile ? 4 : 6, translateY: isMobile ? 4 : 6 }}
          whileHover={{ 
            translateX: isMobile ? 5 : 8, 
            translateY: isMobile ? 5 : 8,
            transition: { type: "spring", stiffness: 300, damping: 20 }
          }}
        />
        
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            className="relative bg-white border-3 sm:border-4 border-black h-full flex flex-col min-h-[400px] sm:min-h-[500px]"
        >
            
            <div className={`h-10 sm:h-12 md:h-14 border-b-2 sm:border-b-3 md:border-b-4 border-black ${headerColor} flex items-center justify-between px-3 sm:px-4 select-none`} style={{ transform: isMobile ? "none" : "translateZ(20px)" }}>
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex flex-col gap-[2px] sm:gap-[3px]">
                        <div className="w-3 h-[2px] sm:w-4 sm:h-[3px] md:w-5 bg-black"></div>
                        <div className="w-3 h-[2px] sm:w-4 sm:h-[3px] md:w-5 bg-black"></div>
                        <div className="w-3 h-[2px] sm:w-4 sm:h-[3px] md:w-5 bg-black"></div>
                    </div>
                    <span className="font-black font-mono text-xs sm:text-sm uppercase tracking-wider truncate">{title}</span>
                </div>
                <div className="flex items-center gap-0 border-2 border-black bg-white">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center border-r-2 border-black hover:bg-black hover:text-white cursor-pointer transition-colors duration-200">
                      <Minus size={isMobile ? 10 : 12} strokeWidth={3} />
                    </div>
                    <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center border-r-2 border-black hover:bg-black hover:text-white cursor-pointer transition-colors duration-200">
                      <Maximize size={isMobile ? 8 : 10} strokeWidth={3} />
                    </div>
                    <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center hover:bg-red-500 hover:text-white cursor-pointer transition-colors duration-200">
                      <X size={isMobile ? 10 : 12} strokeWidth={3} />
                    </div>
                </div>
            </div>

            
            <div className="flex-1 bg-white relative" style={{ transform: isMobile ? "none" : "translateZ(40px)", transformStyle: "preserve-3d" }}>
                {children}
                
                {/* Decorative Scrollbar Track - Hidden on mobile */}
                {!isMobile && (
                  <div className="absolute top-0 right-0 bottom-0 w-6 sm:w-8 border-l-2 sm:border-l-4 border-black bg-gray-100 flex flex-col justify-between p-1 pointer-events-none">
                      <div className="w-full aspect-square bg-white border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors duration-200 cursor-pointer text-xs">▲</div>
                      <div className="w-full h-8 sm:h-12 bg-black border-2 border-white"></div>
                      <div className="w-full aspect-square bg-white border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors duration-200 cursor-pointer text-xs">▼</div>
                  </div>
                )}
            </div>
        </motion.div>
    </motion.div>
  );
};

export default Features;