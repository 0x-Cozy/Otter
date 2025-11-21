import { Database, Lock, Layers } from "lucide-react";

const WhatIsOtter = () => {
  return (
    <section className="py-32 bg-black text-cream relative overflow-hidden">
      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-6xl md:text-8xl font-bold mb-20 text-center leading-none">
          DEFINE YOUR DATA.
          <br />
          OTTER HANDLES THE REST.
        </h2>

        {/* Three Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 - Blue */}
          <div className="bg-lavender text-black rounded-3xl p-8 md:p-12 relative overflow-hidden border-2 border-white/20">
            <div className="mb-8">
              <Database className="w-16 h-16 stroke-[1.5]" />
            </div>
            <h3 className="text-3xl font-bold mb-4 uppercase">
              Store Data
              <br />
              Anywhere
            </h3>
            <p className="text-lg leading-relaxed">
              OTTER works with Walrus and other storage solutions. 
              Metadata is tied to the data itself, not its location.
            </p>
          </div>

          {/* Card 2 - Mint */}
          <div className="bg-mint text-black rounded-3xl p-8 md:p-12 relative overflow-hidden border-2 border-white/20">
            <div className="mb-8">
              <Layers className="w-16 h-16 stroke-[1.5]" />
            </div>
            <h3 className="text-3xl font-bold mb-4 uppercase">
              Set Policies That
              <br />
              Enforce Themselves
            </h3>
            <p className="text-lg leading-relaxed">
              Define onchain access permissions using Move smart contracts on Sui.
              Self-executing policies, no middleman required.
            </p>
          </div>

          {/* Card 3 - Yellow-green */}
          <div className="bg-yellow-green text-black rounded-3xl p-8 md:p-12 relative overflow-hidden border-2 border-white/20">
            <div className="mb-8">
              <Lock className="w-16 h-16 stroke-[1.5]" />
            </div>
            <h3 className="text-3xl font-bold mb-4 uppercase">
              Encrypt at
              <br />
              The Source
            </h3>
            <p className="text-lg leading-relaxed">
              Use identity-based encryption with ZK-SEAL to protect content 
              before it leaves the user's environment.
            </p>
          </div>
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center items-center gap-4 mt-16">
          <button className="w-12 h-12 rounded-full border-2 border-cream flex items-center justify-center hover:bg-cream hover:text-black transition-colors">
            ←
          </button>
          <span className="font-mono text-xl">01</span>
          <button className="w-12 h-12 rounded-full border-2 border-cream flex items-center justify-center hover:bg-cream hover:text-black transition-colors">
            →
          </button>
        </div>
      </div>
    </section>
  );
};

export default WhatIsOtter;
