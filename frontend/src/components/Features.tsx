import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import { CheckCircle2 } from "lucide-react";

const Features = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  const cardsY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.95], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.01]);

  return (
    <motion.div 
      ref={containerRef}
      className="relative min-h-[180vh] bg-cream overflow-hidden features-section perspective-3d"
      style={{ scale }}
    >
      <motion.div 
        className="absolute inset-0 z-0 flex items-center justify-center"
        style={{ 
          y: backgroundY,
          opacity 
        }}
      >
        <h1 className="text-black font-brush text-[40vw] sm:text-[35vw] md:text-[30vw] leading-none rotate-[-4deg] tracking-tighter opacity-40">
          OTTER
        </h1>
      </motion.div>

      <div className="relative z-10">
        <div className="fixed top-4 sm:top-6 md:top-8 left-4 sm:left-6 md:left-8 z-50">
          <CrosshairIcon />
        </div>
        <div className="fixed top-4 sm:top-6 md:top-8 right-4 sm:right-6 md:right-8 z-50">
          <CrosshairIcon />
        </div>

        <motion.div 
          className="container mx-auto px-4 sm:px-6 pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20"
          style={{ 
            y: cardsY,
            opacity 
          }}
        >
          <motion.div 
            className="text-center mb-16 sm:mb-20"
            style={{ y: textY }}
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 leading-tight font-pixel">
              FEATURES
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-black/70 max-w-2xl mx-auto px-4">
              Built for the next generation of decentralized data exchange.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
            <TiltCard 
              className="bg-gray-800 border-2 border-gray-700"
              delay={0}
            >
              <div className="flex justify-between items-start mb-6 sm:mb-8 gap-4">
                <h3 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-[0.95] tracking-tight max-w-[80%]">
                  PROGRAMMABLE <div>DATA</div>EXCHANGE
                </h3>
                <div className="bg-white rounded-full p-1.5 sm:p-2 shrink-0">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
                </div>
              </div>
              
              <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed">
                A data exchange layer that enables consumers to programmatically choose the amount of data to pay for and decrypt—enabling both human users and AI agents to access exactly what they need without the need for a provider-defined interface.
              </p>
            </TiltCard>

            <TiltCard 
              className="bg-teal border-2 border-teal/80"
              delay={0.1}
            >
              <div className="flex justify-between items-start mb-6 sm:mb-8 gap-4">
                <h3 className="text-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-[0.95] tracking-tight max-w-[80%]">
                  PROGRAMMABLE ACCESS CONTROL
                </h3>
                <div className="bg-black rounded-full p-1.5 sm:p-2 shrink-0">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
              
              <p className="text-black/80 text-sm sm:text-base md:text-lg leading-relaxed font-medium">
              Define granular data access policies that enforce themselves. Built on Sui, Walrus and Seal, Otter enables providers to define access rules for their data through fine-grained access control.
              </p>
            </TiltCard>
          </div>

          <motion.div 
            className="text-center mt-12 sm:mt-16"
            style={{ y: textY }}
          >
            <button className="px-6 sm:px-8 py-3 sm:py-4 bg-black hover:bg-black/90 text-cream font-mono text-xs sm:text-sm uppercase tracking-wider rounded-full transition-all duration-300 hover:scale-105">
              EXPLORE THE DOCS →
            </button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const TiltCard = ({ 
  children, 
  className, 
  delay = 0 
}: TiltCardProps) => {
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

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [4, -4]), { 
    stiffness: 150, 
    damping: 20 
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-4, 4]), { 
    stiffness: 150, 
    damping: 20 
  });
  
  const sheenGradient = useMotionTemplate`linear-gradient(
      ${useTransform(rotateY, [-4, 4], [135, 45])}deg, 
      rgba(255,255,255,0) 0%, 
      rgba(255,255,255,0.12) 40%, 
      rgba(255,255,255,0) 100%
  )`;

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      initial={{ 
        opacity: 0, 
        y: 40,
        scale: 0.95
      }}
      whileInView={{ 
        opacity: 1, 
        y: 0,
        scale: 1
      }}
      transition={{ 
        duration: 1.2, 
        ease: "easeOut",
        delay
      }}
      viewport={{ once: true }}
      className={`relative rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 min-h-[320px] sm:min-h-[360px] md:min-h-[400px] flex flex-col justify-between shadow-2xl cursor-default ${className}`}
    >
      <motion.div 
        style={{ background: sheenGradient }}
        className="absolute inset-0 rounded-2xl sm:rounded-3xl opacity-50 pointer-events-none z-20"
      />
      <div style={{ transform: "translateZ(40px)" }}>
        {children}
      </div>
    </motion.div>
  );
};

const CrosshairIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-black sm:w-6 sm:h-6 md:w-7 md:h-7">
    <line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" strokeWidth="1.5" />
    <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export default Features;