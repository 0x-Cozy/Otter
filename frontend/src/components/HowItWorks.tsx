const HowItWorks = () => {
  return (
    <section className="py-32 bg-cream relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-12 items-start">
          {/* Left side - Title */}
          <div className="md:w-1/3">
            <h2 className="text-5xl md:text-7xl font-bold leading-none sticky top-32">
              HOW OTTER WORKS
            </h2>
            <p className="text-sm uppercase tracking-wider mt-4 text-muted-foreground">
              OTTER PROVIDES A UNIVERSAL METADATA
              <br />
              PROTOCOL AND ACCESS INTERFACE FOR
              <br />
              ENCRYPTED DATA ON SUI
            </p>
          </div>

          {/* Right side - Diagram */}
          <div className="md:w-2/3 bg-black rounded-3xl p-8 md:p-12 text-cream border-2 border-black">
            {/* Browser mockup */}
            <div className="bg-black border-2 border-cream/20 rounded-xl overflow-hidden mb-8">
              <div className="bg-cream/10 px-4 py-3 flex gap-2 border-b border-cream/20">
                <div className="w-3 h-3 rounded-full bg-mint"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-green"></div>
                <div className="w-3 h-3 rounded-full bg-lavender"></div>
                <div className="ml-auto text-xs font-mono text-cream/60">HOW OTTER WORKS</div>
              </div>
              
              {/* Flow diagram */}
              <div className="p-8">
                <div className="space-y-8">
                  {/* Wallet */}
                  <div className="flex items-start gap-4">
                    <div className="bg-lavender text-black rounded-2xl px-6 py-4 font-bold">
                      WALLET
                      <div className="text-xs font-normal mt-1">DAPP USERS</div>
                    </div>
                    <div className="flex-1 flex flex-col gap-2 pt-4">
                      <div className="text-sm">
                        <span className="font-mono text-mint">01</span> APPROVE DAPP REQUEST TO GET IDENTITY-BASED DECRYPTION KEY
                      </div>
                    </div>
                  </div>

                  {/* OTTER SDK */}
                  <div className="flex items-center gap-4">
                    <div className="bg-lavender text-black rounded-2xl px-6 py-4 font-bold min-w-[140px] text-center">
                      OTTER SDK
                      <div className="text-xs font-normal mt-1">DAPP</div>
                    </div>
                    <div className="text-sm">
                      <span className="font-mono text-mint">02</span> GET THE IDENTITY-BASED DECRYPTION KEY AFTER VALIDATING THE ACCESS POLICY ON SUI
                    </div>
                  </div>

                  {/* Walrus */}
                  <div className="flex items-center gap-4">
                    <div className="bg-mint text-black rounded-2xl px-6 py-4 font-bold min-w-[140px] text-center">
                      WALRUS
                      <div className="text-xs font-normal mt-1">STORAGE</div>
                    </div>
                    <div className="text-sm">
                      <span className="font-mono text-mint">05</span> AFTER SUCCESSFUL OUT-OF-N VALIDATION FROM OTTER BACKENDS, USE THE IDENTITY-BASED CONTENT ON WALRUS OR ANY OTHER STORAGE
                    </div>
                  </div>

                  {/* OTTER Keys */}
                  <div className="flex items-center gap-4">
                    <div className="border-2 border-dashed border-cream/40 rounded-2xl p-6 space-y-2">
                      <div className="bg-cream/20 rounded-lg px-4 py-2 text-sm font-mono">OTTER KEY</div>
                      <div className="bg-cream/20 rounded-lg px-4 py-2 text-sm font-mono">OTTER KEY</div>
                      <div className="bg-cream/20 rounded-lg px-4 py-2 text-sm font-mono">OTTER KEY</div>
                      <div className="bg-cream/20 rounded-lg px-4 py-2 text-sm font-mono">OTTER KEY</div>
                      <div className="text-xs text-center text-cream/60 mt-2">OTTER KEY STORE SERVICES</div>
                    </div>
                    <div className="flex-1 flex flex-col gap-4">
                      <div className="border-2 border-dashed border-cream/40 rounded-2xl p-4">
                        <div className="bg-lavender text-black rounded-lg px-4 py-2 text-sm font-mono mb-2">FULL NODE</div>
                        <div className="bg-cream/20 rounded-lg px-4 py-2 text-sm font-mono">OTTER ACCESS POLICY</div>
                        <div className="flex gap-2 mt-2">
                          <div className="w-6 h-6 rounded-full border border-cream/40 flex items-center justify-center text-xs">✓</div>
                          <div className="w-6 h-6 rounded-full border border-cream/40 flex items-center justify-center text-xs">?</div>
                          <div className="w-6 h-6 rounded-full border border-cream/40 flex items-center justify-center text-xs">✗</div>
                        </div>
                      </div>
                      <div className="text-sm">
                        <span className="font-mono text-mint">03</span> VALIDATE OTTER ACCESS POLICY FOR THE REQUEST
                      </div>
                    </div>
                  </div>

                  {/* Bottom arrow */}
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 text-mint">
                      <span className="font-mono">04</span>
                      <div className="w-8 h-8 rounded-full border-2 border-mint flex items-center justify-center">
                        🔑
                      </div>
                    </div>
                    <div className="text-xs mt-2 text-cream/60">DECRYPTION KEY RELEASED</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
