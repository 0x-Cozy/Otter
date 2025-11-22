import OtterCard from "./OtterCard";
import otterHero from "@/assets/otter-hero.png";

const UseOtterUI = () => {
  return (
    <div className="min-h-screen bg-background px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-foreground mb-2">
            Use Otter UI
          </h1>
          <p className="text-lg text-muted-foreground">
            Valuable for many audiences
          </p>
        </div>

        <div className="flex items-start justify-center gap-8 flex-wrap lg:flex-nowrap">
          <div className="flex-shrink-0">
            <img
              src={otterHero}
              alt="Otter skateboarding"
              className="w-full max-w-md h-[520px] object-cover rounded-2xl shadow-md"
            />
          </div>

          <div className="hidden lg:flex flex-col gap-4 flex-shrink-0">
            <div className="w-6 h-[250px] bg-[#2c4a4a] rounded-full"></div>
            <div className="w-6 h-[250px] bg-[#a8c5c5] rounded-full"></div>
          </div>

          <div className="flex-shrink-0">
            <OtterCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UseOtterUI;