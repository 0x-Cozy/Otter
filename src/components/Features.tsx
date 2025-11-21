import { CheckCircle2 } from "lucide-react";

const Features = () => {
  return (
    <section className="py-32 bg-cream relative overflow-hidden">
      {/* Decorative dots */}
      <div className="absolute top-[10%] left-[5%] w-3 h-3 rounded-full bg-black"></div>
      <div className="absolute top-[10%] right-[5%] w-3 h-3 rounded-full bg-black"></div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            GO TO DOCS
          </h2>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Card 1 */}
          <div className="bg-lavender rounded-3xl p-8 md:p-12 relative overflow-hidden border-2 border-black">
            <div className="absolute top-4 right-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-3xl font-bold mb-4 uppercase">
              Discover Data
              <br />
              Automatically
            </h3>
            <p className="text-lg leading-relaxed">
              Standardized metadata protocol makes encrypted data on Walrus discoverable. 
              AI agents can find exactly what they need without manual configuration.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-mint rounded-3xl p-8 md:p-12 relative overflow-hidden border-2 border-black">
            <div className="absolute top-4 right-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-3xl font-bold mb-4 uppercase">
              Request Access
              <br />
              On-Chain
            </h3>
            <p className="text-lg leading-relaxed">
              Define who can access your data and when. OTTER's programmable 
              policies enforce themselves through smart contracts on Sui.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
