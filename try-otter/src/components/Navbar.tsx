import { ConnectButton } from '@mysten/dapp-kit';
import { HelpCircle } from 'lucide-react';
import { Button } from './ui/button';
import { startTutorial } from './TutorialGuide';
import otterLogo from '../assets/Arthur.png';

interface NavbarProps {
  activeTab?: string;
}

const Navbar = ({ activeTab }: NavbarProps = {}) => {
  const handleHelpClick = () => {
    startTutorial(activeTab);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b bg-background/40 border-border/40">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <a href="https://otter-protocol.vercel.app" className="flex items-center group">
            <img 
              src={otterLogo} 
              alt="OTTER" 
              className="h-8 sm:h-10 md:h-12 lg:h-16 w-auto object-contain transition-transform group-hover:scale-110 duration-300" 
            />
            <span className="hidden sm:inline text-xl md:text-2xl font-pixel mt-2 ml-[-15px] tracking-tighter text-foreground">OTTER</span>
          </a>

          <div className="flex items-center gap-2 md:gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleHelpClick}
              className="gap-2"
              data-tutorial="help-button"
            >
              <HelpCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Help</span>
            </Button>
            <div data-tutorial="connect-wallet">
              <ConnectButton />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

