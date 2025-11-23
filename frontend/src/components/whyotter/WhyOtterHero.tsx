import { useEffect, useState } from "react";
import Navbar from "../Navbar"; 
import sunsetRoadBg from "@/assets/sunset-road-bg.png";
import otterCar from "@/assets/otter-car.png";

const UseOtterHero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen w-full overflow-hidden relative perspective-[1000px]">
      <Navbar /> {/* Add Navbar here */}
      
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-200 ease-out"
        style={{ 
          backgroundImage: `url(${sunsetRoadBg})`,
          transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px) scale(1.1)`
        }}
      />
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center">
        <img 
          src={otterCar} 
          alt="Otter in car" 
          className="w-auto max-w-2xl mt-32 transition-all duration-300 hover:scale-110 hover:-translate-y-8 hover:drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)] animate-float"
          style={{
            transform: `translate(${mousePosition.x * -1.5}px, ${mousePosition.y * -1.5}px) translateZ(50px)`,
            transition: "transform 0.2s ease-out"
          }}
        />
        <h1 
          className="absolute bottom-12 text-6xl md:text-8xl font-bold leading-none font-pixel tracking-wider drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] text-center"
          style={{
            transform: `translate(${mousePosition.x * -0.8}px, ${mousePosition.y * -0.8}px)`,
            transition: "transform 0.2s ease-out"
          }}
        >
          <span className="text-cream">USE </span>
          <span className="text-teal">OTTER</span>
        </h1>
      </div>
    </div>
  );
};

export default UseOtterHero;