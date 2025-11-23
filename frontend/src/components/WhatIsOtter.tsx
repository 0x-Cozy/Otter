import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, Layers } from 'lucide-react';
import magnifyingGlass from '@/assets/Magnifying-glass.png';
import security from '@/assets/security.png';
import transaction from '@/assets/transaction.png';
import coin from '@/assets/coin.png';
import track from '@/assets/track.png';

interface CardData {
  id: number;
  title: string;
  description: string;
  tag: string;
  iconImage: string;
  iconAlt: string;
}

const cards: CardData[] = [
  {
    id: 1,
    title: "DISCOVER & ACCESS",
    description: "Use Otter's universal metadata protocol to standardize discovery, enabling automatic location by AI agents and humans alike.",
    tag: "PROTOCOL",
    iconImage: magnifyingGlass,
    iconAlt: "Discover Data"
  },
  {
    id: 2,
    title: "SECURE WITH SEAL",
    description: "Decentralized verification of permissions and decryption requests through Seal, ensuring secure and private access control.",
    tag: "SECURITY",
    iconImage: security,
    iconAlt: "Security Verification"
  },
  {
    id: 3,
    title: "DATA TRANSACTIONS",
    description: "Engage in subscription-based or allow-list-based data transactions with standardized access interfaces.",
    tag: "COMMERCE",
    iconImage: transaction,
    iconAlt: "Data Transactions"
  },
  {
    id: 4,
    title: "MONETIZE STREAMS",
    description: "Automated subscription models and royalty streams for encrypted datasets. Create sustainable data economies.",
    tag: "ECONOMY",
    iconImage: coin,
    iconAlt: "Monetize Data"
  },
  {
    id: 5,
    title: "AUDIT & TRACK",
    description: "Full transparency with on-chain logs of every access request, decryption event, and permission change.",
    tag: "TRANSPARENCY",
    iconImage: track,
    iconAlt: "Track Access"
  },
];

interface ProfessionalCardProps {
  data: CardData;
  index: number;
}

const ProfessionalCard: React.FC<ProfessionalCardProps> = ({ data, index }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 40, rotateY: -15 }}
      whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
      viewport={{ once: false, amount: 0.4 }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.12,
        ease: [0.16, 1, 0.3, 1]
      }}
      className="group relative w-[360px] md:w-[400px] flex-shrink-0 h-[500px] cursor-default select-none perspective-1000"
    >
      
      <div className="absolute inset-0 bg-black rounded-[2rem] translate-x-2 translate-y-2 transition-all duration-300 group-hover:translate-x-4 group-hover:translate-y-4 group-hover:bg-teal-900/20"></div>
      
      <div className="absolute inset-0 bg-white border-[3px] border-black rounded-[2rem] p-8 flex flex-col justify-between transition-transform duration-300 group-hover:-translate-y-1 group-hover:-translate-x-1 overflow-hidden">
        
        <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-black/10 bg-gray-50">
                <div className="w-2 h-2 rounded-full bg-black animate-pulse"></div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest">{data.tag}</span>
            </div>
            <span className="font-mono text-4xl font-bold text-black/5 opacity-20">0{data.id}</span>
        </div>

        <div className="flex-1 flex items-center justify-center relative">
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 rounded-full border border-dashed border-black/10 group-hover:border-black/20 transition-colors duration-500"></div>
                <div className="absolute w-32 h-32 rounded-full bg-[#e9f5db] mix-blend-multiply opacity-50"></div>
             </div>
             
             <img 
                src={data.iconImage} 
                alt={data.iconAlt}
                className="w-36 h-36 object-contain relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
             />
        </div>

        <div className="mt-6 space-y-4 relative z-10">
            <div className="flex justify-between items-end">
                <h3 className="text-2xl font-black uppercase leading-[0.9] tracking-tight max-w-[80%]">
                    {data.title}
                </h3>
                <ArrowUpRight className="opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
            </div>
            
            <div className="h-px w-full bg-black/10 group-hover:bg-black/100 transition-colors duration-500 origin-left"></div>
            
            <p className="text-sm font-medium text-black/60 leading-relaxed font-sans">
                {data.description}
            </p>
        </div>

           <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
           </div>
      </div>
    </motion.div>
  );
};

const WhatIsOtter: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 2); 
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const { current } = containerRef;
      const scrollAmount = 400 + 32; 
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
      setTimeout(checkScroll, 400);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      checkScroll(); 
    }
    return () => container?.removeEventListener('scroll', checkScroll);
  }, []);

  return (
    <section className="min-h-screen w-full bg-[#e9f5db] text-black py-24 relative overflow-hidden font-sans border-t-[3px] border-black">
      
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
           style={{ 
             backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', 
             backgroundSize: '24px 24px' 
           }}>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: false, amount: 0.3 }}
          className="mb-16 md:mb-20 flex flex-col md:flex-row justify-between items-end gap-8 border-b-[3px] border-black pb-8"
        >
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: false, amount: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-4">
                <Layers size={20} />
                <span className="font-mono text-xs font-bold uppercase tracking-widest">Infrastructure Overview</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold leading-[0.9] tracking-tighter font-pixel">
              DEFINE YOUR
              <br />
              <span className="text-teal-600">DATA FLOW</span>
            </h2>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: false, amount: 0.3 }}
            className="max-w-md mb-2"
          >
            <p className="text-lg font-medium leading-relaxed font-mono">
                OTTER handles the complex infrastructure you focus on building the future of autonomous agents.
            </p>
          </motion.div>
        </motion.div>

        <div className="relative w-full">
            
            <div 
              ref={containerRef}
              className="flex gap-8 overflow-x-auto pb-12 px-4 snap-x snap-mandatory no-scrollbar"
              style={{ scrollBehavior: 'smooth' }}
            >
              {cards.map((card, index) => (
                <div key={card.id} className="snap-center flex-shrink-0">
                    <ProfessionalCard data={card} index={index} />
                </div>
              ))}
              <div className="w-8 flex-shrink-0"></div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: false, amount: 0.8 }}
              className="flex justify-between items-center mt-4 px-2"
            >
                
                <div className="flex gap-1">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    <div className="w-2 h-2 bg-black/20 rounded-full"></div>
                    <div className="w-2 h-2 bg-black/20 rounded-full"></div>
                </div>

                <div className="flex gap-4">
                    <button 
                        onClick={() => scroll('left')}
                        disabled={!canScrollLeft}
                        className="group w-14 h-14 rounded-full border-[3px] border-black flex items-center justify-center hover:bg-black hover:text-white disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-black transition-all duration-200"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    </button>

                    <button 
                        onClick={() => scroll('right')}
                        disabled={!canScrollRight}
                        className="group w-14 h-14 rounded-full border-[3px] border-black flex items-center justify-center hover:bg-black hover:text-white disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-black transition-all duration-200"
                    >
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </motion.div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </section>
  );
};

export default WhatIsOtter;