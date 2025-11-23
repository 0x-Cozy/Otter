import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, XCircle, CheckCircle, Activity, AlertTriangle, Zap, LucideIcon } from 'lucide-react';
import beforeOtter from '@/assets/before-otter.jpg';
import withOtter from '@/assets/with-otter.jpg';

interface SystemCardProps {
  state: 'before' | 'after';
  image: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  accentColor: string;
  status: string;
}

const HowItWorks: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 md:py-32 bg-white relative overflow-hidden border-t-4 border-black font-mono">
      
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
            backgroundImage: `
                linear-gradient(to right, #000 1px, transparent 1px),
                linear-gradient(to bottom, #000 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
        }}>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 sm:mb-20 md:mb-24 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-black bg-[#bef264] mb-4 sm:mb-6 shadow-[4px_4px_0px_0px_#000]">
            <Activity size={14} className="sm:w-4 sm:h-4 text-black" />
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest">System Architecture</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase leading-none mb-3 sm:mb-4 px-4" style={{ fontFamily: '"Press Start 2P", cursive' }}>
            The Otter<br/>Transformation
          </h2>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-0 max-w-6xl mx-auto relative">
          
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ type: "spring", stiffness: 50, damping: 20, delay: 0.1 }}
            className="w-full max-w-[500px] z-10"
          >
            <SystemCard 
              state="before"
              image={beforeOtter}
              title="Legacy Integration"
              subtitle="Fragmented • High Friction"
              icon={AlertTriangle}
              accentColor="#fbbf24" 
              status="INEFFICIENT"
            />
          </motion.div>

          <motion.div 
            initial={{ scale: 0, rotate: 90 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ type: "spring", stiffness: 60, damping: 15, delay: 0.3 }}
            className="relative z-20 flex-shrink-0 -my-4 lg:my-0 lg:-mx-4 lg:rotate-0 rotate-90"
          >
             <div className="relative bg-black text-white p-3 sm:p-4 border-2 sm:border-4 border-black flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]">
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                    <ArrowRight size={24} strokeWidth={3} className="sm:w-8 sm:h-8" />
                </motion.div>
                
                <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 w-1 h-3 sm:h-4 bg-black"></div>
                <div className="absolute -bottom-3 sm:-bottom-4 left-1/2 -translate-x-1/2 w-1 h-3 sm:h-4 bg-black"></div>
             </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ type: "spring", stiffness: 50, damping: 20, delay: 0.5 }}
            className="w-full max-w-[500px] z-10"
          >
            <SystemCard 
              state="after"
              image={withOtter}
              title="Otter Protocol"
              subtitle="Unified • Zero-UI"
              icon={Zap}
              accentColor="#22d3ee"
              status="OPTIMIZED"
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
};

const SystemCard: React.FC<SystemCardProps> = ({ state, image, title, subtitle, icon: Icon, accentColor, status }) => {
  const isBefore = state === 'before';
  
  return (
    <motion.div 
      className="relative group w-full"
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div 
        className="absolute inset-0 bg-black translate-x-3 translate-y-3 sm:translate-x-4 sm:translate-y-4 transition-transform duration-200 group-hover:translate-x-4 group-hover:translate-y-4 sm:group-hover:translate-x-6 sm:group-hover:translate-y-6"
        style={{ borderRadius: '0px' }}
      ></div>

      <div className="relative bg-white border-2 sm:border-4 border-black p-0 flex flex-col h-full min-h-[450px] sm:min-h-[500px]">
        
        <div className="h-10 sm:h-12 border-b-2 sm:border-b-4 border-black flex items-center justify-between px-3 sm:px-4 bg-gray-50">
            <div className="flex gap-1.5 sm:gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full border-2 border-black bg-white"></div>
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full border-2 border-black bg-white"></div>
            </div>
            <div className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest opacity-50">
                FIG_0{isBefore ? '1' : '2'}.0
            </div>
        </div>

        <div className="flex-1 p-4 sm:p-6 md:p-8 flex items-center justify-center bg-white relative overflow-hidden">
             <div className="absolute inset-0 opacity-10 pointer-events-none" 
                  style={{ 
                    backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', 
                    backgroundSize: '16px 16px' 
                  }}>
             </div>

             <div className="relative w-full aspect-square border-2 border-dashed border-black/20 p-3 sm:p-4 group-hover:border-black/50 transition-colors">
                 <div className="absolute top-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-l-2 border-t-2 sm:border-l-4 sm:border-t-4 border-black"></div>
                 <div className="absolute top-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-r-2 border-t-2 sm:border-r-4 sm:border-t-4 border-black"></div>
                 <div className="absolute bottom-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-l-2 border-b-2 sm:border-l-4 sm:border-b-4 border-black"></div>
                 <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-r-2 border-b-2 sm:border-r-4 sm:border-b-4 border-black"></div>

                 <img 
                    src={image} 
                    alt={title} 
                    className={`w-full h-full object-contain relative z-10 transition-all duration-500 ${isBefore ? 'grayscale group-hover:grayscale-0' : ''}`}
                 />
                 
                 {isBefore && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black text-white text-[10px] sm:text-xs font-bold px-2 py-1 rotate-12 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                        UNSTRUCTURED
                    </div>
                 )}
             </div>
        </div>

        <div className="border-t-2 sm:border-t-4 border-black p-4 sm:p-5 md:p-6 bg-white relative overflow-hidden">
            <div className="absolute top-0 left-0 bottom-0 w-1.5 sm:w-2" style={{ backgroundColor: accentColor }}></div>

            <div className="pl-3 sm:pl-4">
                <div className="flex justify-between items-start mb-2 gap-2">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-black uppercase leading-none">{title}</h3>
                    <Icon size={20} strokeWidth={3} className="sm:w-6 sm:h-6 flex-shrink-0" style={{ color: accentColor }} />
                </div>
                
                <p className="font-mono text-xs sm:text-sm font-bold text-gray-500 mb-3 sm:mb-4 uppercase tracking-tight">
                    {subtitle}
                </p>

                <div className="flex items-center gap-2 sm:gap-3 pt-3 sm:pt-4 border-t-2 border-black/10">
                    <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full border-2 border-black ${isBefore ? 'bg-gray-300' : 'bg-[#22d3ee] animate-pulse'}`}></div>
                    <span className="font-mono text-[10px] sm:text-xs font-black uppercase tracking-widest">
                        STATUS: <span style={{ color: isBefore ? '#000' : accentColor }}>{status}</span>
                    </span>
                    
                    <div className="ml-auto">
                        {isBefore ? <XCircle size={16} className="sm:w-5 sm:h-5" /> : <CheckCircle size={16} className="sm:w-5 sm:h-5" style={{ color: accentColor }} />}
                    </div>
                </div>
            </div>
        </div>

      </div>
    </motion.div>
  );
};

export default HowItWorks;