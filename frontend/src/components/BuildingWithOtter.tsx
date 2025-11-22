import { ExternalLink } from "lucide-react";

const BuildingWithOtter = () => {
  const projects = [
    {
      name: "DATAFLOW",
      category: "DATA INFRASTRUCTURE",
      description: "DataFlow uses OTTER for secure onchain access control over premium datasets stored in Walrus, enabling verified data exchange for Web3 applications.",
      bg: "bg-light-cream"
    },
    {
      name: "AGENTLAB",
      category: "AI AGENTS",
      description: "AgentLab is building autonomous AI agents using OTTER, Walrus, and Seal to enable confidential, automated, and enforceable data access for the agentic economy.",
      bg: "bg-light-cream"
    },
    {
      name: "VAULTCHAIN",
      category: "SECURE STORAGE",
      description: "VaultChain integrates OTTER to bring encrypted, trustless file storage mechanics to its platform, with Walrus ensuring secure storage for sensitive documents and assets.",
      bg: "bg-light-cream"
    },
    {
      name: "NEXUSAI",
      category: "AI PLATFORM",
      description: "NexusAI is building a semantic search layer on Walrus, using OTTER to enable secure, searchable AI interfaces for public and gated private content.",
      bg: "bg-light-cream"
    }
  ];

  return (
    <section className="py-32 bg-black text-cream relative overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-6xl md:text-8xl font-bold mb-20 leading-none">
          LOOK WHO'S
          <br />
          BUILDING WITH OTTER
        </h2>

        {/* Project Cards - Horizontal scroll on mobile */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((project, index) => (
            <div 
              key={index}
              className={`${project.bg} text-black rounded-3xl p-8 relative overflow-hidden border-2 border-white/10 hover:border-teal transition-all hover:scale-105 cursor-pointer`}
            >
              <div className="absolute top-4 left-4 w-3 h-3 rounded-full bg-black"></div>
              
              <div className="mb-4">
                <div className="text-xs uppercase tracking-wider text-black/60 mb-2">
                  {project.category}
                </div>
                <h3 className="text-2xl font-bold uppercase mb-3">
                  {project.name}
                </h3>
              </div>
              
              <p className="text-sm leading-relaxed mb-4">
                {project.description}
              </p>

              <div className="absolute bottom-4 right-4">
                <ExternalLink className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BuildingWithOtter;
