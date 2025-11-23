import { ConnectButton } from '@mysten/dapp-kit';
import { HelpCircle, Link } from 'lucide-react';
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
        <div className="flex items-center justify-between h-20">
          <Link to="https://otter-protocol.vercel.app" className="flex items-center">
            <img 
              src={otterLogo} 
              alt="OTTER" 
              className="h-12 w-auto md:h-16 object-contain" 
            />
            <span className="text-2xl font-pixel mt-2 ml-[-15px] tracking-tighter text-primary/90">OTTER</span>
          </Link>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleHelpClick}
              className="gap-2"
              data-tutorial="help-button"
            >
              <HelpCircle className="h-4 w-4" />
              Help
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
