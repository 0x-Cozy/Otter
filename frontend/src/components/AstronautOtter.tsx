import { HTMLAttributes } from "react";
import { cn } from "../lib/utils";

interface AstronautOtterProps extends HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
  animationDelay?: string;
}

export const AstronautOtter = ({ 
  src, 
  alt, 
  className,
  animationDelay = "0s",
  ...props 
}: AstronautOtterProps) => {
  return (
    <div
      className={cn(
        "relative transition-all duration-500 ease-out",
        "hover:scale-110 hover:-translate-y-4 hover:rotate-6",
        "cursor-pointer",
        className
      )}
      style={{ animationDelay }}
      {...props}
    >
      <img 
        src={src} 
        alt={alt}
        className="relative w-full h-full object-contain drop-shadow-2xl animate-float"
      />
    </div>
  );
};
