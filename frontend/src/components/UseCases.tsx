import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Shield, MessageSquare, Key, Clock, Activity, Zap, Lock, Binary, LucideIcon } from 'lucide-react';

interface CardData {
  id: string;
  code: string;
  title: string;
  description: string;
  bg: string;
  text: string;
  icon: LucideIcon;
}

const colors = {
  black: '#111111',
  zinc: '#18181b',
  lavender: '#d8b4fe',
  mint: '#22d3ee', 
  lime: '#bef264',
  cream: '#fffdd0',
  white: '#ffffff'
};

const cards: CardData[] = [
  {
    id: "01",
    code: "AI_GOV_BLOB",
    title: "Policy-Governed AI",
    description: "Encrypt sensitive data and control what AI agents can access. Maintain user control while enabling full agent autonomy.",
    bg: colors.black,
    text: colors.cream,
    icon: Shield,
  },
  {
    id: "02",
    code: "E2E_CHAT_BLOB",
    title: "Encrypted Messaging",
    description: "Build secure end-to-end chat in apps or trustless async communication between app components, even on public networks.",
    bg: colors.lavender,
    text: colors.black,
    icon: MessageSquare,
  },
  {
    id: "03",
    code: "NFT_GATE_BLOB",
    title: "Managed Data Access",
    description: "Share premium content with verified subscribers who gain conditional access via NFTs, tokens, or recurring payments.",
    bg: colors.mint,
    text: colors.black,
    icon: Key,
  },
  {
    id: "04",
    code: "TIME_LOCK_BLOB",
    title: "Time-Locked Txns",
    description: "Grant access to data like in-game content, DAO outcomes, or auction bids only after a fixed set time or conditions met.",
    bg: colors.lime,
    text: colors.black,
    icon: Clock,
  }
];

const UseCases: React.FC = () => {
  return (
    <section className="py-32 bg-[#09090b] relative overflow-hidden font-mono">
      
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.05]" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        style={{
            backgroundImage: `
                linear-gradient(to right, #888 1px, transparent 1px),
                linear-gradient(to bottom, #888 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
        }}>
      </div>

      <div className="absolute top-20 -left-20 z-0 opacity-[0.05] -rotate-6 pointer-events-none select-none whitespace-nowrap">
        <h1 className="text-[10rem] font-black text-white leading-none tracking-tighter" style={{ fontFamily: '"Press Start 2P"' }}>
            SYSTEM // ACTIVE
        </h1>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        <div className="mb-24 text-center relative max-w-5xl mx-auto">
          <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: false, amount: 0.5 }}
             transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
             className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 bg-white/5 mb-8 backdrop-blur-sm"
          >
            <Activity size={16} className="text-white" />
            <span className="font-mono font-bold text-xs uppercase tracking-wider text-white">System Capabilities</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl md:text-5xl font-bold mb-6 leading-snug md:leading-tight text-white"
            style={{ fontFamily: '"Press Start 2P", cursive' }}
          >
            ACTIVATE SMART<br/>
            <span className="text-[#22d3ee]">ACCESS CONTROL</span>
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-7xl mx-auto perspective-1000">
          {cards.map((card, i) => (
            <Card key={card.id} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

interface CardProps {
    card: CardData;
    index: number;
}

const Card: React.FC<CardProps> = ({ card, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;
    const xPct = mouseXPos / width - 0.5;
    const yPct = mouseYPos / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, rotateX: 20 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ 
        duration: 0.9, 
        delay: index * 0.15, 
        ease: [0.16, 1, 0.3, 1],
        opacity: { duration: 0.6 }
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative min-h-[450px] group cursor-default"
    >
      <div 
        className="absolute inset-0 border-4 border-white/20 bg-[#222] translate-x-4 translate-y-4 transition-transform duration-300"
        style={{ 
            transform: hovered ? 'translate(24px, 24px)' : 'translate(12px, 12px)',
            borderRadius: '0px' 
        }}
      ></div>

      <div 
        className="absolute inset-0 border-4 border-black p-10 flex flex-col justify-between overflow-hidden transition-all duration-300"
        style={{ 
            backgroundColor: card.bg, 
            color: card.text,
            borderRadius: '0px' 
        }}
      >
           <div className="absolute top-0 right-0 bottom-0 w-1/2 overflow-hidden opacity-10 pointer-events-none mix-blend-hard-light mask-image-linear-to-l">
             <ByteStream code={card.code} trigger={hovered} />
        </div>
        
        <div className="absolute -top-6 -right-6 text-[8rem] font-black leading-none opacity-[0.07] select-none" style={{ fontFamily: '"Space Grotesk"' }}>
            {card.id}
        </div>

        <div className="relative z-10 flex justify-between items-start">
            <div className={`p-4 border-2 border-current inline-flex items-center justify-center bg-white/10 backdrop-blur-sm ${hovered ? 'animate-bounce' : ''}`}>
                <card.icon size={32} />
            </div>
            <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className={`w-2 h-2 border border-current ${i === 0 ? 'bg-current' : ''}`}></div>
                ))}
            </div>
        </div>

        <div className="relative z-10 mt-auto">
             <div className="mb-6 overflow-hidden h-20 flex items-center">
                 <ScrambleText text={card.title} trigger={hovered} className="text-3xl font-bold uppercase tracking-tighter leading-[0.9]" />
             </div>
             
             <p className="text-lg font-medium leading-relaxed opacity-90" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                {card.description}
             </p>

             <div className="mt-8 pt-6 border-t-2 border-current opacity-60 flex justify-between items-center font-mono text-xs uppercase tracking-widest">
                <span>// BLOB_ID_{card.id}</span>
                <span className="flex items-center gap-2 font-bold">
                    {hovered ? <Lock size={14} /> : <Zap size={14} />} 
                    {hovered ? 'ENCRYPTED' : 'ONLINE'}
                </span>
             </div>
        </div>
      </div>
    </motion.div>
  );
};

interface ScrambleTextProps {
    text: string;
    trigger: boolean;
    className?: string;
}

const ScrambleText: React.FC<ScrambleTextProps> = ({ text, trigger, className }) => {
    const [display, setDisplay] = useState(text);
    const chars = "█▓▒░<>/[]{}!@#";
  
    useEffect(() => {
      if (!trigger) {
          setDisplay(text);
          return;
      }
      let iterations = 0;
      const interval = setInterval(() => {
        setDisplay(
          text.split("").map((letter, index) => {
            if (index < iterations) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          }).join("")
        );
        if (iterations >= text.length) clearInterval(interval);
        iterations += 1 / 2; 
      }, 30);
      return () => clearInterval(interval);
    }, [trigger, text]);
  
    return <h3 className={className} style={{ fontFamily: '"Space Mono", monospace' }}>{display}</h3>;
};

interface ByteStreamProps {
    code: string;
    trigger: boolean;
}

const ByteStream: React.FC<ByteStreamProps> = ({ code, trigger }) => {
    const rows = 12;
    const [grid, setGrid] = useState<string[]>(Array(rows).fill(code));

    useEffect(() => {
        if (!trigger) {
             setGrid(Array(rows).fill(code));
             return;
        }

        const chars = "01010101XYZ";
        const interval = setInterval(() => {
            setGrid(prev => prev.map(() => 
                Array(10).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join(" ")
            ));
        }, 100);

        return () => clearInterval(interval);
    }, [trigger, code]);

    return (
        <div className="flex flex-col gap-2 text-xs font-bold text-right opacity-50" style={{ fontFamily: '"Space Mono", monospace' }}>
            {grid.map((line, i) => (
                <div key={i} className="whitespace-nowrap tracking-widest">
                    {line}
                </div>
            ))}
            <div className="mt-4 opacity-30">
                <Binary size={48} className="ml-auto" />
            </div>
        </div>
    );
};

export default UseCases;