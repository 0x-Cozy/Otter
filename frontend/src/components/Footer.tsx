import { ExternalLink } from "lucide-react";
import otterHero from "@/assets/Arthur.png";

const Footer = () => {
  return (
    <footer className="bg-black text-cream py-20 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <h2 className="text-[20rem] font-bold opacity-10 leading-none select-none">
          OTTER
        </h2>
        <div className="absolute top-0 right-0 w-12 h-12 rounded-full border-2 border-cream flex items-center justify-center text-2xl">
          ®
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-4 gap-12 mb-20">
          {/* Column 1 - Discover */}
          <div>
            <h3 className="text-xs uppercase tracking-wider mb-6 text-cream/60">DISCOVER</h3>
            <ul className="space-y-4">
              <li><a href="#" className="hover:text-teal transition-colors">OTTER Protocol</a></li>
              <li><a href="#" className="hover:text-teal transition-colors">OTR Token</a></li>
              <li><a href="#" className="hover:text-teal transition-colors">Network Status</a></li>
              <li><a href="#" className="hover:text-teal transition-colors">News</a></li>
              <li><a href="#" className="hover:text-teal transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-teal transition-colors">Research</a></li>
            </ul>
          </div>

          {/* Column 2 - Build */}
          <div>
            <h3 className="text-xs uppercase tracking-wider mb-6 text-cream/60">BUILD</h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="hover:text-teal transition-colors flex items-center gap-2">
                  Get Started
                  <ExternalLink className="w-4 h-4" />
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-teal transition-colors flex items-center gap-2">
                  Request for Proposals
                  <ExternalLink className="w-4 h-4" />
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-teal transition-colors flex items-center gap-2">
                  Docs
                  <ExternalLink className="w-4 h-4" />
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-teal transition-colors flex items-center gap-2">
                  GitHub
                  <ExternalLink className="w-4 h-4" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 - Use */}
          <div>
            <h3 className="text-xs uppercase tracking-wider mb-6 text-cream/60">USE</h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="hover:text-teal transition-colors flex items-center gap-2">
                  Stake OTR
                  <ExternalLink className="w-4 h-4" />
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-teal transition-colors flex items-center gap-2">
                  Apps & Services
                  <ExternalLink className="w-4 h-4" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4 - Join/About */}
          <div>
            <h3 className="text-xs uppercase tracking-wider mb-6 text-cream/60">JOIN</h3>
            <ul className="space-y-4 mb-8">
              <li><a href="#" className="hover:text-teal transition-colors">Community</a></li>
              <li>
                <a href="#" className="hover:text-teal transition-colors flex items-center gap-2">
                  X
                  <ExternalLink className="w-4 h-4" />
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-teal transition-colors flex items-center gap-2">
                  Discord
                  <ExternalLink className="w-4 h-4" />
                </a>
              </li>
            </ul>

            <h3 className="text-xs uppercase tracking-wider mb-6 text-cream/60">ABOUT</h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="hover:text-teal transition-colors flex items-center gap-2">
                  Whitepaper
                  <ExternalLink className="w-4 h-4" />
                </a>
              </li>
              <li><a href="#" className="hover:text-teal transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-teal transition-colors">Media Kit</a></li>
              <li><a href="#" className="hover:text-teal transition-colors">Bug Bounty Program</a></li>
              <li><a href="#" className="hover:text-teal transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-cream/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <img src={otterHero} alt="OTTER" className="w-8 h-8" />
            <span className="text-sm">© 2025 OTTER LABS</span>
          </div>
          
          <div className="flex gap-8 text-sm">
            <a href="#" className="hover:text-teal transition-colors flex items-center gap-1">
              OTTER LABS
              <ExternalLink className="w-3 h-3" />
            </a>
            <a href="#" className="hover:text-teal transition-colors flex items-center gap-1">
              TERMS OF SERVICE
              <ExternalLink className="w-3 h-3" />
            </a>
            <a href="#" className="hover:text-teal transition-colors flex items-center gap-1">
              PRIVACY CONDITIONS
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
