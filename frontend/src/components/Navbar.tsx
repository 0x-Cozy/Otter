import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Wallet } from "lucide-react";
import { Button } from "./ui/button";
import otterLogo from "@/assets/Arthur.png";

const Navbar = () => {
  const location = useLocation();
  
  const isTryOtterPage = location.pathname === '/try-otter';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b ${
      isTryOtterPage 
        ? 'bg-background/40 border-border/40' 
        : 'bg-background/40 border-primary/20 hero-dark-theme'
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center">
            <img 
              src={otterLogo} 
              alt="OTTER" 
              className="h-12 w-auto md:h-16 object-contain" 
            />
            <span className={`text-2xl font-pixel mt-2 ml-[-15px] tracking-tighter ${isTryOtterPage ? 'text-primary/90' : 'text-foreground/80'}`}>OTTER</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {['Discover', 'Build', 'Try'].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase()}`} 
                className="text-foreground/80 hover:text-sky-400 transition-colors font-mono text-sm uppercase tracking-wider"
              >
                {item}
              </a>
            ))}
          </div>

          {isTryOtterPage ? (
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm"
                className="gap-2 text-sm font-medium"
              >
                <Wallet className="h-4 w-4" />
                Connect Wallet
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <button 
                className="group flex items-center gap-2 px-4 py-2 bg-transparent text-sky-400 border border-sky-400 font-bold font-mono text-sm uppercase tracking-wide rounded-md hover:bg-lime-400 hover:border-lime-400 hover:text-black transition-all duration-300"
              >
                Docs
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              <Link 
                to="/try-otter"
                className="group flex items-center gap-2 px-4 py-2 bg-sky-400 text-black font-bold font-mono text-sm uppercase tracking-wide rounded-md hover:bg-lime-400 transition-all duration-300"
              >
                Try Otter
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;