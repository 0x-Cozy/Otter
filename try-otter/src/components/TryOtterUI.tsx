import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Button } from "./ui/button";
import { RotateCcw } from "lucide-react";
import OtterCard from "./OtterCard";
import otterHero from "../assets/otter-hero.png";
import { AllowlistCard } from '../provider/components/AllowlistCard';
import { SubscriptionCard } from '../provider/components/SubscriptionCard';
import { ChunkConstantCard } from '../provider/components/ChunkConstantCard';
import { ChunkDynamicCard } from '../provider/components/ChunkDynamicCard';

interface TryOtterUIProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const TryOtterUI = ({ activeTab, onTabChange }: TryOtterUIProps = {}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayImage, setDisplayImage] = useState<string>(otterHero);
  const [isDecryptedImage, setIsDecryptedImage] = useState(false);
  const [decryptedImageUrl, setDecryptedImageUrl] = useState<string | null>(null);
  const [internalTab, setInternalTab] = useState<string>('consumer');
  
  const currentTab = activeTab !== undefined ? activeTab : internalTab;
  
  const handleTabChange = (value: string) => {
    if (activeTab === undefined) {
      setInternalTab(value);
    }
    onTabChange?.(value);
  };

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 100 };
  const mouseXSpring = useSpring(x, springConfig);
  const mouseYSpring = useSpring(y, springConfig);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  useEffect(() => {
    return () => {
      if (decryptedImageUrl && decryptedImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(decryptedImageUrl);
      }
    };
  }, [decryptedImageUrl]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleDecrypted = (url: string) => {
    if (decryptedImageUrl && decryptedImageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(decryptedImageUrl);
    }
    setDecryptedImageUrl(url);
    setDisplayImage(url);
    setIsDecryptedImage(true);
  };

  const handleResetImage = () => {
    if (decryptedImageUrl && decryptedImageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(decryptedImageUrl);
    }
    setDecryptedImageUrl(null);
    setDisplayImage(otterHero);
    setIsDecryptedImage(false);
  };

  return (
    <div className="px-8 pt-8 pb-12 [perspective:2000px]" data-tutorial="intro">
      <div className="max-w-7xl mx-auto w-full">
        <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-2 h-11 bg-muted/50 p-1" data-tutorial="tabs">
              <TabsTrigger 
                value="consumer" 
                className="text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Consumer (Search & Decrypt)
              </TabsTrigger>
              <TabsTrigger 
                value="provider"
                className="text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm"
                data-tutorial="provider-tabs"
              >
                Provider (Publish & Encrypt)
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="consumer" className="mt-0">
            <div
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative flex items-start justify-center gap-8 flex-wrap lg:flex-nowrap p-4"
            >
              <div className="flex-shrink-0 w-full max-w-lg shadow-[0_20px_50px_rgba(8,_112,_184,_0.15)] rounded-xl relative z-10 bg-background" data-tutorial="consumer-card">
                <OtterCard onDecrypted={handleDecrypted} />
              </div>

              <div className="hidden lg:flex flex-col gap-4 flex-shrink-0 shadow-lg rounded-full bg-background/50 backdrop-blur-sm p-2">
                <div className="w-6 h-[250px] bg-[#2c4a4a] rounded-full"></div>
                <div className="w-6 h-[250px] bg-[#a8c5c5] rounded-full"></div>
              </div>

              <motion.div
                style={{
                  rotateX,
                  rotateY,
                  transformStyle: "preserve-3d",
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex-shrink-0 relative group shadow-2xl rounded-2xl"
                data-tutorial="consumer-image"
              >
                <div className="absolute -inset-4 bg-gradient-to-tr from-purple-500/20 to-cyan-500/20 rounded-3xl blur-2xl -z-10 transition-opacity opacity-0 group-hover:opacity-100" />
                
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <img
                  src={displayImage}
                  alt={isDecryptedImage ? "Decrypted image" : "Otter skateboarding"}
                  className="relative w-full max-w-lg h-[520px] object-cover rounded-2xl bg-background"
                />
                {isDecryptedImage && (
                  <div className="absolute top-4 right-4 z-20">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleResetImage}
                      className="bg-background/90 backdrop-blur-sm hover:bg-background"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                )}
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="provider" className="mt-0">
            <div className="w-full">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2 text-foreground">
                  Upload Images - Easy Testing
                </h2>
                <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
                  Upload an image, get a blob ID, and paste it on the consumer side to decrypt
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                <div className="bg-card border border-border rounded-xl p-1 shadow-sm" data-tutorial="allowlist-card">
                  <AllowlistCard />
                </div>
                <div className="bg-card border border-border rounded-xl p-1 shadow-sm" data-tutorial="subscription-card">
                  <SubscriptionCard />
                </div>
                <div className="bg-card border border-border rounded-xl p-1 shadow-sm" data-tutorial="chunk-constant-card">
                  <ChunkConstantCard />
                </div>
                <div className="bg-card border border-border rounded-xl p-1 shadow-sm" data-tutorial="chunk-dynamic-card">
                  <ChunkDynamicCard />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TryOtterUI;
