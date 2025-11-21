import { Button } from "../components/ui/button";
import Arthur from "@/assets/Arthur.png";

const CTASection = () => {
  return (
    <section className="py-32 bg-mint relative overflow-hidden">
      {/* Decorative pixel blocks */}
      <div className="absolute top-0 left-0 w-full h-32 overflow-hidden">
        <div className="flex gap-2 animate-pulse">
          <div className="w-16 h-16 bg-teal"></div>
          <div className="w-16 h-16 bg-black"></div>
          <div className="w-16 h-16 bg-teal"></div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl">
          <h2 className="text-6xl md:text-8xl font-bold mb-8 leading-none">
            START BUILDING
          </h2>
          
          <p className="text-xl md:text-2xl mb-8 max-w-2xl">
            Review and select any combination of verified independent key server providers. 
            Providers set their own pricing and rate limits.
          </p>

          <Button size="lg" className="rounded-full text-lg px-8 py-6 bg-black hover:bg-black/90 text-cream mb-12">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cream"></span>
              GO TO PROVIDER LIST
            </span>
          </Button>
        </div>

        {/* Character illustration */}
        <div className="absolute bottom-0 right-8 md:right-32">
          <img 
            src={Arthur} 
            alt="OTTER Mascot" 
            className="w-64 md:w-96 h-auto drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
};

export default CTASection;
