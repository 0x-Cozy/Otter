import React, { useRef } from 'react';
import UseOtterHero from '../components/useotter/UseOtterHero';
import UseOtterUI from '../components/useotter/UseOtterUI';
import { motion, useScroll, useTransform } from 'framer-motion';

const UseOtterPage = () => {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.3], ["0%", "20%"]);

  const uiOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);
  const uiY = useTransform(scrollYProgress, [0.1, 0.5], ["150px", "0px"]);

  return (
    <div ref={containerRef} className="relative">
      <motion.section 
        style={{ opacity: heroOpacity, y: heroY }}
        className="relative h-screen sticky top-0 z-0 bg-black"
      >
        <UseOtterHero />
        <div className="absolute bottom-10 w-full flex justify-center animate-bounce opacity-50">
           <svg className="w-6 h-6 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
        </div>
      </motion.section>

      <section className="relative z-10 bg-transparent overflow-hidden">
        <div className="h-[20vh] bg-transparent"></div> 

        <div className="relative min-h-screen">
            <motion.div
              style={{ opacity: uiOpacity, y: uiY }}
              className="relative z-10 min-h-screen flex items-center justify-center pb-20 pt-20"
            >
              <UseOtterUI />
            </motion.div>
        </div>
      </section>
    </div>
  );
};

export default UseOtterPage;