import { Starfield } from "../components/Starfield";
import { AstronautOtter } from "../components/AstronautOtter";
import astronautCream from "@/assets/astronaut-cream.png";
import astronautGreen from "@/assets/astronaut-green.png";
import astronautBlue from "@/assets/astronaut-blue.png";
import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

const Hero = () => {
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
              <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-pixel tracking-wider mb-8 text-foreground">
                <span className="block">
                  THE MISSING
                </span>
                <span className="block">
                  DATA BRIDGE
                </span>
              </h1>

              <p className="text-lg md:text-xl lg:text-2xl text-foreground/90 max-w-3xl mx-auto leading-relaxed font-light">
                Otter is a programmable data exchange layer powered by Sui, Walrus and Seal, connecting data providers and consumers through secure, access-controlled data transactions.
              </p>
            </motion.div>

            <motion.div 
              className="absolute bottom-8 left-0 right-0 parallax-medium"
              style={{ 
                y: astronautY,
                opacity 
              }}
            >
              <div className="relative">
                <div className="absolute bottom-0 left-0 md:left-12 w-32 md:w-48 lg:w-64">
                  <AstronautOtter 
                    src={astronautGreen} 
                    alt="Green Astronaut Otter"
                    animationDelay="1s"
                  />
                </div>

                <div className="absolute bottom-0 right-0 md:right-12 w-32 md:w-48 lg:w-64">
                  <AstronautOtter 
                    src={astronautBlue} 
                    alt="Blue Astronaut Otter"
                    animationDelay="2s"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </motion.div>
  );
};

export default Hero;