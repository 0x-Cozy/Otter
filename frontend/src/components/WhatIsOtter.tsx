import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import magnifyingGlass from '@/assets/Magnifying-glass.png';
import security from '@/assets/security.png';
import transaction from '@/assets/transaction.png';
import coin from '@/assets/coin.png';
import track from '@/assets/track.png';

interface CardData {
  id: number;
  title: string;
  description: string;
  bgColor: string;
  iconImage: string;
  iconAlt: string;
}

const cards: CardData[] = [
  {
    id: 1,
    title: "DISCOVER & ACCESS DATA",
    description: "Use Otter's universal metadata protocol to standardize discovery and access to encrypted data stored in Walrus, enabling automatic location by AI agents and smart contracts.",
    bgColor: "bg-[#a3a1e8]",
    iconImage: magnifyingGlass,
    iconAlt: "Discover Data"
  },
  {
    id: 2,
    title: "VERIFY WITH ZK-SEAL",
    description: "Decentralized verification of permissions and decryption requests through ZK-SEAL, ensuring secure and private access control.",
    bgColor: "bg-[#8cf2a3]",
    iconImage: security,
    iconAlt: "Security Verification"
  },
  {
    id: 3,
    title: "ENABLE DATA TRANSACTIONS",
    description: "Engage in subscription-based or allow-list-based data transactions with standardized access interfaces.",
    bgColor: "bg-[#eaf878]",
    iconImage: transaction,
    iconAlt: "Data Transactions"
  },
  {
    id: 4,
    title: "MONETIZE DATA STREAMS",
    description: "Automated subscription models and royalty streams for encrypted datasets. Create sustainable data economies.",
    bgColor: "bg-[#a3a1e8]",
    iconImage: coin,
    iconAlt: "Monetize Data"
  },
  {
    id: 5,
    title: "AUDIT & TRACK ACCESS",
    description: "Full transparency with on-chain logs of every access request, decryption event, and permission change.",
    bgColor: "bg-[#8cf2a3]",
    iconImage: track,
    iconAlt: "Track Access"
  },
];

const TiltCard = ({ 
  data, 
  delay = 0 
}: { 
  data: CardData; 
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
      whileHover={{ scale: 1.02 }}
      transition={{ 
        duration: 1, 
        ease: "easeOut",
        delay
      }}
      viewport={{ once: true }}
      className={`
        ${data.bgColor}
        rounded-3xl
        p-8
        flex flex-col justify-between
        relative
        overflow-hidden
        text-black
        cursor-default
        flex-shrink-0
        w-[460px] h-[550px]
        shadow-2xl
      `}
    >
      <motion.div 
        style={{ background: sheenGradient }}
        className="absolute inset-0 rounded-3xl opacity-50 pointer-events-none z-20"
      />
      
      <div style={{ transform: "translateZ(40px)" }} className="flex flex-col h-full">
        <div className="flex justify-end mb-8">
          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <img 
              src={data.iconImage} 
              alt={data.iconAlt}
              className="w-28 h-28 object-contain"
            />
          </motion.div>
        </div>

        <div className="flex-1 flex flex-col justify-end">
          <h3 className="text-3xl font-bold mb-6 uppercase leading-[0.95] tracking-tight">
            {data.title}
          </h3>
          <p className="text-lg leading-relaxed opacity-80">
            {data.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const WhatIsOtter = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(1);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    
    const cardsElements = Array.from(container.children) as HTMLElement[];
    let closestIndex = 1;
    let minDistance = Infinity;

    cardsElements.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const containerCenter = container.scrollLeft + container.clientWidth / 2;
      
      const distance = Math.abs(containerCenter - cardCenter);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index + 1;
      }
    });

    setActiveIndex(closestIndex);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const { current } = containerRef;
      const firstCard = current.children[0] as HTMLElement;
      const scrollAmount = firstCard.clientWidth + 32;

      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      handleScroll(); 
    }
  }, []);

  return (
    <section className="min-h-screen w-full bg-black text-cream py-20 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-24"
        >
          <h2 className="text-6xl md:text-8xl font-bold mb-6 leading-none font-pixel">
            DEFINE YOUR
            <br />
            <span className="text-teal">DATA FLOW</span>
          </h2>
          <p className="text-xl md:text-2xl text-cream/70 max-w-2xl mx-auto">
            OTTER handles the complex infrastructure—you focus on building
          </p>
        </motion.div>

        <div 
          ref={containerRef}
          onScroll={handleScroll}
          className="flex gap-8 overflow-x-auto pb-12 snap-x snap-mandatory no-scrollbar w-full px-4"
        >
          {cards.map((card, index) => (
            <TiltCard 
              key={card.id} 
              data={card} 
              delay={index * 0.1}
            />
          ))}
          <div className="min-w-[1px] h-full opacity-0 flex-shrink-0" />
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="flex justify-center items-center gap-6 mt-12"
        >
          <button 
            onClick={() => scroll('left')}
            className="w-14 h-14 rounded-full border-2 border-cream/30 flex items-center justify-center hover:bg-cream hover:text-black transition-all duration-300 hover:scale-110"
            disabled={activeIndex === 1}
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex items-center gap-4">
            <span className="font-mono text-2xl font-bold text-teal">
              {activeIndex.toString().padStart(2, '0')}
            </span>
            <div className="w-px h-6 bg-cream/30"></div>
            <span className="font-mono text-lg text-cream/60">
              0{cards.length}
            </span>
          </div>
          
          <button 
            onClick={() => scroll('right')}
            className="w-14 h-14 rounded-full border-2 border-cream/30 flex items-center justify-center hover:bg-cream hover:text-black transition-all duration-300 hover:scale-110"
            disabled={activeIndex === cards.length}
          >
            <ArrowRight size={20} />
          </button>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-8 opacity-20">
        <div className="w-5 h-5">
          <div className="w-full h-px bg-cream absolute top-1/2 -translate-y-1/2"></div>
          <div className="h-full w-px bg-cream absolute left-1/2 -translate-x-1/2"></div>
        </div>
      </div>
      <div className="absolute top-8 right-8 opacity-20">
        <div className="w-5 h-5">
          <div className="w-full h-px bg-cream absolute top-1/2 -translate-y-1/2"></div>
          <div className="h-full w-px bg-cream absolute left-1/2 -translate-x-1/2"></div>
        </div>
      </div>
    </section>
  );
};

export default WhatIsOtter;