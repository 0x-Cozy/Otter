const UseCases = () => {
  return (
    <section className="py-32 bg-cream relative overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-6xl md:text-8xl font-bold mb-20 text-center leading-none">
          ACTIVATE SMART ACCESS
          <br />
          CONTROL FOR EVERY USE CASE
        </h2>

        {/* Use Case Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Card 1 - Black */}
          <div className="bg-black text-cream rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-4 left-4 w-3 h-3 rounded-full bg-cream"></div>
            <h3 className="text-3xl font-bold mb-4 uppercase">
              Policy-Governed AI
            </h3>
            <p className="text-lg leading-relaxed opacity-90">
              Encrypt sensitive data and control what AI agents can access, when, 
              and under which conditions. Maintain user control while enabling agent autonomy.
            </p>
          </div>

          {/* Card 2 - Lavender */}
          <div className="bg-lavender text-black rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-4 left-4 w-3 h-3 rounded-full bg-black"></div>
            <h3 className="text-3xl font-bold mb-4 uppercase">
              Encrypted Messaging
            </h3>
            <p className="text-lg leading-relaxed">
              Build secure end-to-end chat in apps or trustless async communication 
              between app components, even on public networks.
            </p>
          </div>

          {/* Card 3 - Mint */}
          <div className="bg-mint text-black rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-4 left-4 w-3 h-3 rounded-full bg-black"></div>
            <h3 className="text-3xl font-bold mb-4 uppercase">
              Managed Data Access
            </h3>
            <p className="text-lg leading-relaxed">
              Share premium content, either fully or partially, with verified subscribers 
              who gain conditional access via NFTs, tokens, or recurring payments.
            </p>
          </div>

          {/* Card 4 - Yellow-green */}
          <div className="bg-yellow-green text-black rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-4 left-4 w-3 h-3 rounded-full bg-black"></div>
            <h3 className="text-3xl font-bold mb-4 uppercase">
              Time-Locked Transactions
            </h3>
            <p className="text-lg leading-relaxed">
              Grant access to data like in-game content, DAO outcomes, or auction bids 
              only after a fixed set time or when conditions are met.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UseCases;
