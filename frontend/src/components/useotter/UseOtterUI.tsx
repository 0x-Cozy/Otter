import React, { useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import OtterCard from "./OtterCard";
import otterHero from "@/assets/otter-hero.png";

const UseOtterUI = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 100 };
  const mouseXSpring = useSpring(x, springConfig);
  const mouseYSpring = useSpring(y, springConfig);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="min-h-screen px-8 py-12 flex items-center justify-center [perspective:2000px]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.h1 
             initial={{ opacity: 0, y: -20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.2 }}
             className="text-4xl md:text-6xl font-['Press_Start_2P'] text-white mb-8 leading-snug drop-shadow-[4px_4px_0_#0ea5e9] drop-shadow-[8px_8px_0_#1e3a8a]"
          >
            Use Otter UI
          </motion.h1>
          <motion.p 
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             transition={{ duration: 0.8, delay: 0.4 }}
             className="text-lg text-muted-foreground font-['Space_Grotesk'] tracking-wide"
          >
            Valuable for many audiences
          </motion.p>
        </div>

        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative flex items-center justify-center gap-8 flex-wrap lg:flex-nowrap p-4"
        >
          <motion.div
            style={{
               rotateX,
               rotateY,
               transformStyle: "preserve-3d",
            }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex-shrink-0 relative group shadow-2xl rounded-2xl"
          >
            <div className="absolute -inset-4 bg-gradient-to-tr from-purple-500/20 to-cyan-500/20 rounded-3xl blur-2xl -z-10 transition-opacity opacity-0 group-hover:opacity-100" />
            
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <img
              src={otterHero}
              alt="Otter skateboarding"
              className="relative w-full max-w-md h-[520px] object-cover rounded-2xl bg-background"
            />
          </motion.div>

          <div className="hidden lg:flex flex-col gap-4 flex-shrink-0 shadow-lg rounded-full bg-background/50 backdrop-blur-sm p-2">
            <div className="w-6 h-[250px] bg-[#2c4a4a] rounded-full"></div>
            <div className="w-6 h-[250px] bg-[#a8c5c5] rounded-full"></div>
          </div>

          <div className="flex-shrink-0 shadow-[0_20px_50px_rgba(8,_112,_184,_0.15)] rounded-xl relative z-10 bg-background">
            <OtterCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UseOtterUI;