import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import { CheckCircle2 } from "lucide-react";

const Features = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Balanced parallax speeds - smoother and more premium
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const cardsY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.02]);

  return (
    <motion.div 
      ref={containerRef}
      className="relative min-h-[140vh] bg-cream overflow-hidden features-section perspective-3d"
      style={{ scale }}
    >
      {/* Background OTTER Text - moves DOWN slowly */}
      <motion.div 
        className="absolute inset-0 z-0 flex items-center justify-center"
        style={{ 
          y: backgroundY,
          opacity 
        }}
      >
        <h1 className="text-black font-brush text-[30vw] leading-none rotate-[-4deg] tracking-tighter opacity-40">
          OTTER
        </h1>
      </motion.div>

      {/* Content - moves UP */}
      <div className="relative z-10">
        {/* Decorative Elements */}
        <div className="fixed top-8 left-8 z-50">
          <CrosshairIcon />
        </div>
        <div className="fixed top-8 right-8 z-50">
          <CrosshairIcon />
        </div>

        {/* Main Content */}
        <motion.div 
          className="container mx-auto px-6 pt-32 pb-20"
          style={{ 
            y: cardsY,
            opacity 
          }}
        >
          {/* Section Header */}
          <motion.div 
            className="text-center mb-20"
            style={{ y: textY }}
          >
            <h2 className="text-6xl md:text-8xl font-bold mb-6 leading-tight font-pixel">
              FEATURES
            </h2>
            <p className="text-xl md:text-2xl text-black/70 max-w-2xl mx-auto">
              Built for the next generation of decentralized AI and smart contracts
            </p>
          </motion.div>

          {/* Feature Cards */}
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <TiltCard 
              className="bg-gray-800 border-2 border-gray-700"
              delay={0}
            >
              <div className="flex justify-between items-start mb-8">
                <h3 className="text-white text-4xl md:text-5xl font-bold leading-[0.95] tracking-tight max-w-[80%]">
                  PRIVACY AS PUBLIC INFRASTRUCTURE
                </h3>
                <div className="bg-white rounded-full p-2 shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-black" />
                </div>
              </div>
              
              <p className="text-gray-300 text-lg leading-relaxed">
                Decentralized storage meets built-in encryption. OTTER brings zero-trust security to public infrastructure, eliminating the need for custom security implementations.
              </p>
            </TiltCard>

            <TiltCard 
              className="bg-teal border-2 border-teal/80"
              delay={0.1}
            >
              <div className="flex justify-between items-start mb-8">
                <h3 className="text-black text-4xl md:text-5xl font-bold leading-[0.95] tracking-tight max-w-[80%]">
                  PROGRAMMABLE ACCESS CONTROL
                </h3>
                <div className="bg-black rounded-full p-2 shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <p className="text-black/80 text-lg leading-relaxed font-medium">
                Define granular data access policies that enforce themselves. No custom infrastructure required—just smart contracts and cryptographic guarantees.
              </p>
            </TiltCard>
          </div>

          {/* Bottom CTA */}
          <motion.div 
            className="text-center mt-16"
            style={{ y: textY }}
          >
            <div className="inline-block px-6 py-3 bg-black rounded-full">
              <span className="text-cream font-mono text-sm uppercase tracking-wider">
                EXPLORE THE DOCS →
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const TiltCard = ({ 
  children, 
  className, 
  delay = 0 
}: { 
  children: React.ReactNode; 
  className?: string;
  delay?: number;
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

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { 
    stiffness: 150, 
    damping: 20 
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { 
    stiffness: 150, 
    damping: 20 
  });
  
  const sheenGradient = useMotionTemplate`linear-gradient(
      ${useTransform(rotateY, [-6, 6], [135, 45])}deg, 
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
        duration: 1, 
        ease: "easeOut",
        delay
      }}
      viewport={{ once: true }}
      className={`relative rounded-3xl p-8 md:p-12 min-h-[400px] flex flex-col justify-between shadow-2xl cursor-default ${className}`}
    >
      <motion.div 
        style={{ background: sheenGradient }}
        className="absolute inset-0 rounded-3xl opacity-50 pointer-events-none z-20"
      />
      <div style={{ transform: "translateZ(40px)" }}>
        {children}
      </div>
    </motion.div>
  );
};

const CrosshairIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-black">
    <line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" strokeWidth="1.5" />
    <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export default Features;