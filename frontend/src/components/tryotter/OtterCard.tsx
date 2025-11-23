import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card } from "../../components/ui/card";
import { Search, Wallet } from "lucide-react";

const OtterCard = () => {
  return (
    <Card className="w-full max-w-lg h-[520px] shadow-sm border-border/60 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border/40">
        <h2 className="text-lg font-semibold text-foreground tracking-tight">Otter UI</h2>
        <Button 
          variant="outline" 
          size="sm"
          className="gap-2 text-sm font-medium"
        >
          <Wallet className="h-4 w-4" />
          Connect Wallet
        </Button>
      </div>

      <div className="px-6 pt-6 pb-4 space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1">
            Policy Object Viewer
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Policy Object ID or Bob ID
          </p>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Enter policy object ID (e.g. ipt bob-ID..."
            className="flex-1 h-9 text-sm bg-background"
          />
          <Button 
            size="sm"
            className="gap-1.5 px-4 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Search className="h-3.5 w-3.5" />
            Search
          </Button>
        </div>
      </div>

      <div className="mx-6 mb-6 flex-1 bg-muted/30 rounded-lg border border-border/40"></div>
    </Card>
  );
};

export default OtterCard;
