import { Input } from "../components/ui/input";
import { Search } from "lucide-react";
import otterLogo from "@/assets/otter-logo.png";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/40 backdrop-blur-md border-b border-primary/20 hero-dark-theme">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <img src={otterLogo} alt="OTTER" className="w-10 h-10 md:w-12 md:h-12" />
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a 
              href="#discover" 
              className="text-foreground/80 hover:text-primary transition-colors font-mono text-sm uppercase tracking-wider hover:drop-shadow-[0_0_8px_rgba(93,212,212,0.6)]"
            >
              Discover
            </a>
            <a 
              href="#build" 
              className="text-foreground/80 hover:text-primary transition-colors font-mono text-sm uppercase tracking-wider hover:drop-shadow-[0_0_8px_rgba(93,212,212,0.6)]"
            >
              Build
            </a>
            <a 
              href="#use" 
              className="text-foreground/80 hover:text-primary transition-colors font-mono text-sm uppercase tracking-wider hover:drop-shadow-[0_0_8px_rgba(93,212,212,0.6)]"
            >
              Use
            </a>
            <a 
              href="#join" 
              className="text-foreground/80 hover:text-primary transition-colors font-mono text-sm uppercase tracking-wider hover:drop-shadow-[0_0_8px_rgba(93,212,212,0.6)]"
            >
              Join
            </a>
          </div>

          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50 w-4 h-4" />
            <Input
              placeholder="Paste blob set ID here..."
              className="pl-10 pr-4 bg-background/60 border-primary/30 focus:border-primary focus:ring-primary/20 font-mono text-sm placeholder:text-foreground/50"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;