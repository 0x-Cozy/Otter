import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import WhatIsOtter from "../components/WhatIsOtter";
import UseCases from "../components/UseCases";
import HowItWorks from "../components/HowItWorks";
import BuildingWithOtter from "../components/BuildingWithOtter";
import Footer from "../components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <WhatIsOtter />
      <UseCases />
      <HowItWorks />
      <BuildingWithOtter />
      <Footer />
    </div>
  );
};

export default Index;
