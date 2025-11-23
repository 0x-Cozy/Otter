import React, { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { Starfield } from "../components/Starfield";
import { AstronautOtter } from "../components/AstronautOtter";
import astronautCream from "@/assets/astronaut-cream.png";
import astronautGreen from "@/assets/astronaut-green.png";
import astronautBlue from "@/assets/astronaut-blue.png";

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const astronautY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <motion.div 
      ref={containerRef}
      className="relative h-screen overflow-hidden bg-background hero-dark-theme perspective-3d"
    >
      <motion.div 
        className="absolute inset-0 z-0 parallax-deep"
        style={{ 
          y: backgroundY,
          opacity 
        }}
      >
        <Starfield />
      </motion.div>

      <div className="relative z-10 h-full parallax-foreground">
        <main className="container mx-auto px-6 h-full flex items-center justify-center">
          <div className="max-w-7xl mx-auto w-full">
            <motion.div 
              initial={{ opacity: 0, x: 100, rotate: -20 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ 
                duration: 1.2, 
                delay: 0.3,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="absolute top-16 -right-12 md:-right-16 w-48 md:w-64 lg:w-80 z-[60] parallax-medium"
              style={{ 
                y: astronautY,
                opacity 
              }}
            >
              <AstronautOtter 
                src={astronautCream} 
                alt="Cream Astronaut Otter"
                animationDelay="0s"
              />
            </motion.div>

            <motion.div 
              className="text-center relative z-10 parallax-foreground"
              style={{ 
                y: textY,
                opacity 
              }}
            >
              <div className="overflow-hidden mb-8">
                <motion.h1 
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ 
                    duration: 1,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-pixel tracking-wider text-foreground"
                >
                  <span className="block">
                    THE MISSING
                  </span>
                  <span className="block">
                    DATA BRIDGE
                  </span>
                </motion.h1>
              </div>

              <motion.p 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ 
                  duration: 0.8,
                  delay: 0.4,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="text-lg md:text-xl lg:text-2xl text-foreground/90 max-w-3xl mx-auto leading-relaxed font-light"
              >
                Otter is a programmable data exchange layer that connects data providers and consumers through secure, self-discoverable access-control removing the need for provider-defined interfaces.
              </motion.p>
            </motion.div>

            <motion.div 
              className="absolute bottom-8 left-0 right-0 parallax-medium"
              style={{ 
                y: astronautY,
                opacity 
              }}
            >
              <div className="relative">
                <motion.div 
                  initial={{ opacity: 0, x: -80, y: 80 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ 
                    duration: 1.2, 
                    delay: 0.6,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  className="absolute bottom-0 left-0 md:left-12 w-32 md:w-48 lg:w-64"
                >
                  <AstronautOtter 
                    src={astronautGreen} 
                    alt="Green Astronaut Otter"
                    animationDelay="1s"
                  />
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: 80, y: 80 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ 
                    duration: 1.2, 
                    delay: 0.8,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  className="absolute bottom-0 right-0 md:right-12 w-32 md:w-48 lg:w-64"
                >
                  <AstronautOtter 
                    src={astronautBlue} 
                    alt="Blue Astronaut Otter"
                    animationDelay="2s"
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </motion.div>
  );
};

export default Hero;