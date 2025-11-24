import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Menu, X, Terminal, Wallet } from "lucide-react";
import otterLogo from "@/assets/Arthur.png";

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isTryOtterPage = location.pathname === '/try-otter';
  
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const navItems = [
    { name: 'Discover', href: '#what-is-otter', id: '01' },
    { name: 'Build', href: '#use-cases', id: '02' },
    { name: 'Try', href: '#protocol', id: '03' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b-4 transition-all duration-300 ${
        isTryOtterPage 
          ? 'bg-black/90 border-white/10' 
          : 'bg-background/40 border-black/10 hero-dark-theme'
      }`}>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20 md:h-24">
            
            <Link to="/" className="flex items-center group z-50">
              <div className="relative">
                  <img 
                    src={otterLogo} 
                    alt="OTTER" 
                    className="h-10 w-auto md:h-14 object-contain transition-transform group-hover:scale-110 duration-300" 
                  />
              </div>
              <span className={`text-xl md:text-2xl font-pixel mt-2 ml-[-5px] tracking-tighter transition-colors ${isTryOtterPage ? 'text-white' : 'text-foreground/90 group-hover:text-[#22d3ee]'}`}>
                OTTER
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-10">
              {navItems.map((item) => (
                <button 
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className="relative text-sm font-mono uppercase tracking-widest font-bold text-foreground/60 hover:text-[#22d3ee] transition-colors group"
                >
                  <span className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#22d3ee] opacity-0 group-hover:opacity-100 transition-opacity border border-black"></span>
                  {item.name}
                </button>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-6">
              {isTryOtterPage ? (
                <button className="group relative px-6 py-3 font-bold font-mono text-xs uppercase tracking-wider text-white transition-all duration-200 hover:-translate-y-1 active:translate-y-0">
                  <div className="absolute inset-0 border-2 border-white group-hover:border-[#bef264] transition-colors"></div>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-white/50 group-hover:text-[#bef264] transition-all" />
                    <span>Connect Wallet</span>
                  </div>
                </button>
              ) : (
                <>
                  <button className="group relative px-6 py-3 font-bold font-mono text-xs uppercase tracking-wider text-white transition-all duration-200 hover:-translate-y-1 active:translate-y-0">
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
                </>
              )}
            </div>

          <button 
            onClick={toggleMobileMenu}
            className="md:hidden relative z-60 w-10 h-10 flex items-center justify-center text-white hover:text-[#22d3ee] transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />} 
          </button>
        </div>
      </nav>

      <div className={`
        md:hidden fixed inset-0 z-40 bg-black transition-transform duration-500 cubic-bezier(0.7, 0, 0.3, 1) flex flex-col
        ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}
      `}>
        
        <div className="absolute inset-0 pointer-events-none opacity-20" 
             style={{ 
               backgroundImage: 'linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)', 
               backgroundSize: '40px 40px' 
             }}>
        </div>

        <div className="container mx-auto px-6 pt-32 pb-10 flex flex-col h-full relative z-10">
          
          <div className="flex items-center gap-2 text-[#22d3ee] mb-12 opacity-70">
            <Terminal size={16} />
            <span className="font-mono text-xs tracking-widest uppercase">System_Nav_Active</span>
          </div>

          <div className="flex-1 flex flex-col gap-6">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className="group flex items-center justify-between w-full text-left border-b border-white/10 pb-4 hover:border-[#22d3ee] transition-colors"
              >
                <span className="text-4xl font-black uppercase text-white group-hover:text-[#22d3ee] transition-colors font-pixel tracking-wide">
                  {item.name}
                </span>
                <div className="flex items-center gap-4">
                    <span className="font-mono text-sm text-white/40 group-hover:text-[#22d3ee]">{item.id}</span>
                    <ArrowUpRight className="text-white/20 group-hover:text-[#22d3ee] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" size={24} />
                </div>
              </button>
            ))}
          </div>

          <div className="mt-auto space-y-6">
            <button className="w-full py-4 border-2 border-white/20 text-white font-mono font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                Documentation
            </button>
            
            <Link 
                to="/try-otter"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full"
            >
                <div className="relative w-full group">
                    <div className="absolute inset-0 bg-[#bef264] translate-x-2 translate-y-2"></div>
                    <div className="relative w-full py-4 bg-[#22d3ee] border-2 border-black flex items-center justify-center gap-3 text-black font-black font-mono uppercase tracking-widest hover:translate-x-1 hover:translate-y-1 active:translate-x-2 active:translate-y-2 transition-transform">
                        <span>Launch App</span>
                        <ArrowUpRight size={20} />
                    </div>
                </div>
            </Link>
          </div>

          <div className="mt-8 flex justify-between text-[10px] font-mono text-white/30 uppercase tracking-widest">
            <span>Otter Protocol V.1.0</span>
            <span>Secure • Decoupled • Native</span>
          </div>

        </div>
      </div>
    </>
  );
};

export default Navbar;