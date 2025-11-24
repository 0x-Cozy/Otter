import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { CheckSquare, Terminal, Maximize, Minus, X, ArrowRight } from "lucide-react";

const Features: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-5%"]);
  const cardsY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

  return (
    <motion.div 
      ref={containerRef}
      className="relative min-h-[160vh] bg-[#22d3ee] overflow-hidden features-section border-t-4 border-black font-mono"
    >
      <div className="absolute inset-0 pointer-events-none opacity-10" 
           style={{ 
             backgroundImage: 'linear-gradient(#000 2px, transparent 2px), linear-gradient(90deg, #000 2px, transparent 2px)', 
             backgroundSize: '50px 50px' 
           }}>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none flex flex-col justify-between opacity-[0.05]">
         {[...Array(5)].map((_, i) => (
            <div key={i} className="whitespace-nowrap text-[12vw] font-black leading-none select-none" style={{ fontFamily: '"Space Grotesk"' }}>
                OTTER PROTOCOL // DATA LAYER // OTTER PROTOCOL // DATA LAYER
            </div>
         ))}
      </div>

      <div className="relative z-10">
        <div className="fixed top-8 left-8 z-50 pointer-events-none hidden md:block">
            <div className="w-12 h-12 border-l-4 border-t-4 border-black"></div>
        </div>
        <div className="fixed top-8 right-8 z-50 pointer-events-none hidden md:block">
            <div className="w-12 h-12 border-r-4 border-t-4 border-black"></div>
        </div>

        <motion.div 
          className="container mx-auto px-6 pt-32 pb-24"
          style={{ y: cardsY }}
        >

          <motion.div 
            className="text-center mb-24"
            style={{ y: textY }}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 border-4 border-black bg-white px-4 py-2 mb-8 shadow-[6px_6px_0px_0px_#000]"
            >
                <div className="w-3 h-3 bg-red-500 rounded-full border border-black"></div>
                <span className="font-bold text-sm tracking-widest uppercase">System_Config.json</span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-8xl font-black mb-6 leading-[0.9] tracking-tighter text-black drop-shadow-none" 
              style={{ fontFamily: '"Press Start 2P", cursive' }}
            >
              CORE<br/>FEATURES
            </motion.h2>
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl mx-auto border-l-4 border-black pl-6 text-left"
            >
                <p className="text-lg md:text-xl text-black font-bold leading-relaxed font-mono">
                &gt; Initializing decentralized data exchange...<br/>
                &gt; Loading programmable access control...
                </p>
            </motion.div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            
            <WindowCard 
                title="DATA_EXCHANGE.EXE"
                headerColor="bg-[#bef264]" 
                delay={0}
            >
                <div className="p-8 flex flex-col h-full">
                    <h3 className="text-4xl font-black uppercase leading-[0.9] mb-6 tracking-tighter border-b-4 border-black pb-6">
                        PROGRAMMABLE<br/>DATA EXCHANGE
                    </h3>
                    
                    <p className="text-black font-bold text-lg leading-relaxed mb-8 flex-1">
                        A data exchange layer that enables consumers to programmatically choose the amount of data to pay for and decrypt—enabling both human users and AI agents.
                    </p>

                    <div className="bg-black text-[#bef264] p-4 font-mono text-xs border-2 border-black">
                        <code>
                            $ initiate_transfer --auto<br/>
                            ... locating providers<br/>
                            ... 100% match found
                        </code>
                    </div>
                </div>
            </WindowCard>

            <WindowCard 
                title="ACCESS_CONTROL.BAT"
                headerColor="bg-[#fbbf24]" 
                delay={0.1}
            >
                <div className="p-8 flex flex-col h-full">
                    <h3 className="text-4xl font-black uppercase leading-[0.9] mb-6 tracking-tighter border-b-4 border-black pb-6">
                        PROGRAMMABLE<br/>ACCESS CONTROL
                    </h3>
                    
                    <p className="text-black font-bold text-lg leading-relaxed mb-8 flex-1">
                        Define granular data access policies that enforce themselves. Built on Sui, Walrus and Seal, Otter enables providers to define strict access rules.
                    </p>

                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 font-bold text-sm">
                            <CheckSquare size={20} className="fill-black text-white" />
                            <span>ENFORCE_ON_CHAIN_RULES</span>
                        </div>
                        <div className="flex items-center gap-3 font-bold text-sm">
                            <CheckSquare size={20} className="fill-black text-white" />
                            <span>VERIFY_DECRYPTION_KEYS</span>
                        </div>
                    </div>
                </div>
            </WindowCard>

          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mt-32"
            style={{ y: textY }}
          >
            <button className="group relative inline-block">
                <div className="absolute inset-0 bg-black translate-x-3 translate-y-3"></div>
                <div className="relative px-10 py-5 bg-white border-4 border-black text-black font-black font-mono text-sm uppercase tracking-widest hover:translate-x-1 hover:translate-y-1 transition-transform active:translate-x-3 active:translate-y-3 flex items-center gap-3">
                    <Terminal size={18} />
                    <span>Explore Documentation</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
            </button>
          </motion.div>

        </motion.div>
      </div>
    </motion.div>
  );
};

interface WindowCardProps {
  children: React.ReactNode;
  title: string;
  headerColor?: string;
  delay?: number;
}

const WindowCard: React.FC<WindowCardProps> = ({ 
  children, 
  title, 
  headerColor = "bg-gray-200",
  delay = 0 
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / rect.width - 0.5;
    const yPct = mouseY / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 300, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 300, damping: 20 });
  
  return (
    <div className="relative group perspective-1000">

        <div className="absolute inset-0 bg-black translate-x-5 translate-y-5 -z-10 transition-transform duration-200 group-hover:translate-x-8 group-hover:translate-y-8"></div>
        
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: false, amount: 0.3 }}
            className="relative bg-white border-4 border-black min-h-[500px] flex flex-col"
        >
            <div className={`h-12 border-b-4 border-black ${headerColor} flex items-center justify-between px-3 select-none`} style={{ transform: "translateZ(20px)" }}>
                <div className="flex items-center gap-2">

                    <div className="flex flex-col gap-[2px]">
                        <div className="w-4 h-[2px] bg-black"></div>
                        <div className="w-4 h-[2px] bg-black"></div>
                        <div className="w-4 h-[2px] bg-black"></div>
                    </div>
                    <span className="font-bold font-mono text-sm uppercase tracking-wider truncate">{title}</span>
                </div>
                <div className="flex items-center gap-0 border-2 border-black bg-white">
                    <div className="w-6 h-6 flex items-center justify-center border-r-2 border-black hover:bg-black hover:text-white cursor-pointer"><Minus size={12} strokeWidth={4} /></div>
                    <div className="w-6 h-6 flex items-center justify-center border-r-2 border-black hover:bg-black hover:text-white cursor-pointer"><Maximize size={10} strokeWidth={4} /></div>
                    <div className="w-6 h-6 flex items-center justify-center hover:bg-red-500 hover:text-white cursor-pointer"><X size={12} strokeWidth={4} /></div>
                </div>
            </div>

            <div className="flex-1 bg-white relative" style={{ transform: "translateZ(10px)" }}>
                {children}
                
                <div className="absolute top-0 right-0 bottom-0 w-6 border-l-4 border-black bg-gray-100 flex flex-col justify-between p-1">
                    <div className="w-full aspect-square bg-white border-2 border-black flex items-center justify-center">▲</div>
                    <div className="w-full h-1/3 bg-black border-2 border-white"></div>
                    <div className="w-full aspect-square bg-white border-2 border-black flex items-center justify-center">▼</div>
                </div>
            </div>
        </motion.div>
    </div>
  );
};

export default Features;