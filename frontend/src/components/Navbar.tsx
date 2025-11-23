import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";
import otterLogo from "@/assets/Arthur.png";

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navItems = [
    { name: 'Discover', href: '#what-is-otter' },
    { name: 'Build', href: '#use-cases' },
    { name: 'Try', href: '#protocol' },
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
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-all duration-300 bg-background/40 border-white/10 hero-dark-theme">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-24">
          
          <Link to="/" className="flex items-center group z-60">
            <div className="relative">
                <img 
                  src={otterLogo} 
                  alt="OTTER" 
                  className="h-8 w-auto md:h-16 object-contain transition-transform group-hover:scale-110 duration-300" 
                />
            </div>
            <span className='text-xl md:text-2xl font-pixel mt-1 md:mt-2 ml-[-8px] md:ml-[-10px] tracking-tighter transition-colors text-foreground/90 group-hover:text-[#22d3ee]'>OTTER</span>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <button 
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className="relative text-sm font-mono uppercase tracking-widest font-bold text-white/60 hover:text-[#22d3ee] transition-colors group"
              >
                <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#22d3ee] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                {item.name}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-6">
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
              to="https://try-otter.vercel.app/"
              className="relative group"
            >
              <div className="absolute inset-0 bg-white translate-x-1.5 translate-y-1.5 transition-transform duration-200 group-hover:translate-x-3 group-hover:translate-y-3 group-active:translate-x-0 group-active:translate-y-0"></div>
              
              <div className="relative px-8 py-3 bg-[#22d3ee] border-2 border-black text-black font-black font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition-colors duration-200 group-hover:bg-[#bef264]">
                  <span>Try Otter</span>
                  <ArrowUpRight className="w-4 h-4 border border-black bg-white/20 rounded-full p-0.5 transition-transform group-hover:rotate-45" />
              </div>
            </Link>
          </div>

          <button 
            onClick={toggleMobileMenu}
            className="md:hidden relative z-60 w-10 h-10 flex items-center justify-center text-white hover:text-[#22d3ee] transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />} 
          </button>
        </div>

        <div className={`
          md:hidden fixed inset-0 z-50 bg-black/95 backdrop-blur-lg transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}
        `}>
          <div className="flex flex-col items-center justify-center min-h-screen space-y-12 px-6">
            
            <div className="flex flex-col items-center space-y-8">
              {navItems.map((item, index) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className="text-2xl font-mono uppercase tracking-widest font-bold text-white/80 hover:text-[#22d3ee] transition-all duration-300 transform hover:scale-110"
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  {item.name}
                </button>
              ))}
            </div>

            <div className="flex flex-col items-center space-y-6 w-full max-w-xs">
              <button 
                className="group relative w-full px-8 py-4 font-bold font-mono text-sm uppercase tracking-wider text-white transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 border-2 border-white group-hover:border-[#bef264] transition-colors rounded-lg"></div>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity rounded-lg"></div>
                
                <div className="flex items-center justify-center gap-3">
                    <span>Documentation</span>
                    <ArrowUpRight className="w-5 h-5 text-white/50 group-hover:text-[#bef264] transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </button>

              <Link 
                to="http://localhost:5173/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative group w-full"
              >
                <div className="absolute inset-0 bg-white translate-x-2 translate-y-2 transition-transform duration-300 group-hover:translate-x-3 group-hover:translate-y-3 group-active:translate-x-0 group-active:translate-y-0 rounded-lg"></div>
                
                <div className="relative w-full px-8 py-4 bg-[#22d3ee] border-2 border-black text-black font-black font-mono text-sm uppercase tracking-wider flex items-center justify-center gap-3 transition-colors duration-300 group-hover:bg-[#bef264] rounded-lg">
                    <span>Launch App</span>
                    <ArrowUpRight className="w-5 h-5 border border-black bg-white/20 rounded-full p-0.5 transition-transform group-hover:rotate-45" />
                </div>
              </Link>
            </div>

            <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 opacity-40">
              <div className="flex space-x-2">
                {[1, 2, 3].map((dot) => (
                  <div 
                    key={dot}
                    className="w-2 h-2 bg-[#22d3ee] rounded-full animate-pulse"
                    style={{ animationDelay: `${dot * 200}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;