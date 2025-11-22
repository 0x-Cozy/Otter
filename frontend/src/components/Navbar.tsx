import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import otterLogo from "@/assets/otter-logo.png";

const Navbar = () => {
  const location = useLocation();
  
  const isUseOtterPage = location.pathname === '/use-otter';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/40 backdrop-blur-md border-b border-primary/20 hero-dark-theme">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3">
            <img 
              src={otterLogo} 
              alt="OTTER" 
              className="h-16 w-auto md:h-20 object-contain" 
            />
          </Link>

          {/* NAV LINKS - Only show on homepage */}
          {!isUseOtterPage && (
            <div className="hidden md:flex items-center gap-8">
              {['Discover', 'Build', 'Use', 'Join'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase()}`} 
                  className="text-foreground/80 hover:text-sky-400 transition-colors font-mono text-sm uppercase tracking-wider"
                >
                  {item}
                </a>
              ))}
            </div>
          )}

          {/* BUTTONS - Only show on homepage */}
          {!isUseOtterPage && (
            <div className="flex items-center gap-4">
              <button 
                className="group flex items-center gap-2 px-4 py-2 bg-transparent text-sky-400 border border-sky-400 font-bold font-mono text-sm uppercase tracking-wide rounded-md hover:bg-lime-400 hover:border-lime-400 hover:text-black transition-all duration-300"
              >
                Docs
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              <Link 
                to="/use-otter"
                className="group flex items-center gap-2 px-4 py-2 bg-sky-400 text-black font-bold font-mono text-sm uppercase tracking-wide rounded-md hover:bg-lime-400 transition-all duration-300"
              >
                Use Otter
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          )}

          {/* On Use Otter page, show centered logo */}
          {isUseOtterPage && <div className="flex-1"></div>}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;