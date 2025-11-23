import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Wallet, Terminal } from "lucide-react";
import { Button } from "./ui/button";
import otterLogo from "@/assets/Arthur.png";

const Navbar: React.FC = () => {
  const location = useLocation();
  
  const isTryOtterPage = location.pathname === '/try-otter';
  const navItems: string[] = ['Discover', 'Build', 'Try'];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-all duration-300 ${
      isTryOtterPage 
        ? 'bg-black/80 border-white/10' 
        : 'bg-background/40 border-white/10 hero-dark-theme'
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-24">
          
          <Link to="/" className="flex items-center group">
            <div className="relative">
                <img 
                  src={otterLogo} 
                  alt="OTTER" 
                  className="h-12 w-auto md:h-16 object-contain transition-transform group-hover:scale-110 duration-300" 
                />
            </div>
            <span className={`text-2xl font-pixel mt-2 ml-[-10px] tracking-tighter transition-colors ${isTryOtterPage ? 'text-white' : 'text-foreground/90 group-hover:text-[#22d3ee]'}`}>OTTER</span>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase()}`} 
                className="relative text-sm font-mono uppercase tracking-widest font-bold text-white/60 hover:text-[#22d3ee] transition-colors group"
              >
                <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#22d3ee] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                {item}
              </a>
            ))}
          </div>

          {isTryOtterPage ? (
            <div className="flex items-center gap-4">
              <button 
                className="group relative px-6 py-3 bg-black border border-white/20 text-white font-mono text-xs uppercase tracking-widest hover:border-[#22d3ee] hover:text-[#22d3ee] transition-all duration-300"
              >
                <div className="absolute inset-0 bg-[#22d3ee]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex items-center gap-3 relative z-10">
                   <Wallet className="h-4 w-4 group-hover:animate-pulse" />
                   <span>Connect Wallet</span>
                </div>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              
              <button 
                className="group relative px-6 py-3 font-bold font-mono text-xs uppercase tracking-wider text-white transition-all duration-200 hover:-translate-y-1 active:translate-y-0"
              >
                <div className="absolute inset-0 border-2 border-white group-hover:border-[#bef264] transition-colors"></div>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                
                <div className="flex items-center gap-2">
                    <span>Docs</span>
                    <ArrowUpRight className="w-4 h-4 text-white/50 group-hover:text-[#bef264] transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </button>

              <Link 
                to="/try-otter"
                className="relative group"
              >
                <div className="absolute inset-0 bg-white translate-x-1.5 translate-y-1.5 transition-transform duration-200 group-hover:translate-x-3 group-hover:translate-y-3 group-active:translate-x-0 group-active:translate-y-0"></div>
                
                <div className="relative px-8 py-3 bg-[#22d3ee] border-2 border-black text-black font-black font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition-colors duration-200 group-hover:bg-[#bef264]">
                    <span>Try Otter</span>
                    <ArrowUpRight className="w-4 h-4 border border-black bg-white/20 rounded-full p-0.5 transition-transform group-hover:rotate-45" />
                </div>
              </Link>

            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;