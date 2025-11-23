import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Search } from 'lucide-react';
import { isValidSuiAddress } from '@mysten/sui/utils';
import { getPolicyObjectIdFromBlob } from '../consumer/utils/blobHeader';
import PolicyObjectListView from './PolicyObjectListView';
import InlineDecryptionView from './InlineDecryptionView';

interface OtterCardProps {
  onSearchResult?: (policyObjectId: string | null, blobId: string | null) => void;
  onDecrypted?: (url: string) => void;
}

const OtterCard = ({ onSearchResult, onDecrypted }: OtterCardProps) => {
  const [searchInput, setSearchInput] = useState('');
  const [searchPolicyObjectId, setSearchPolicyObjectId] = useState<string | null>(null);
  const [searchBlobId, setSearchBlobId] = useState<string | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = async () => {
    const input = searchInput.trim();
    if (!input) {
      setSearchError('Please enter a policy object ID or blob ID');
      return;
    }

    setSearchLoading(true);
    setSearchError(null);

    try {
      let policyObjectId: string;
      let blobId: string | null = null;

      if (input.startsWith('0x')) {
        if (!isValidSuiAddress(input)) {
          throw new Error('Invalid policy object ID format');
        }
        policyObjectId = input;
        setSearchBlobId(null);
      } else {
        blobId = input;
        policyObjectId = await getPolicyObjectIdFromBlob(input);
        setSearchBlobId(blobId);
      }

      setSearchPolicyObjectId(policyObjectId);
      onSearchResult?.(policyObjectId, blobId);
    } catch (err) {
      console.error('Search error:', err);
      setSearchError(err instanceof Error ? err.message : 'Failed to search');
      setSearchPolicyObjectId(null);
      setSearchBlobId(null);
      onSearchResult?.(null, null);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !searchLoading) {
      handleSearch();
    }
  };

  const handleDecrypted = (url: string) => {
    onDecrypted?.(url);
  };

  const handleBlobSelect = (blobId: string) => {
    setSearchBlobId(blobId);
    onSearchResult?.(searchPolicyObjectId, blobId);
  };

  return (
    <Card className="w-full max-w-lg h-[520px] shadow-sm border-border/60 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border/40">
        <h2 className="text-lg font-semibold text-foreground tracking-tight">Data Viewer</h2>
      </div>

      <div className="px-6 pt-6 pb-4 space-y-3">
        <div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Search by Policy Object ID or Blob ID
          </p>
        </div>
        <div className="flex gap-2" data-tutorial="consumer-search">
          <Input
            placeholder="Enter policy object ID (e.g. 0x...) or blob ID..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 h-9 text-sm bg-background"
            disabled={searchLoading}
          />
          <Button 
            size="sm"
            onClick={handleSearch}
            disabled={!searchInput.trim() || searchLoading}
            className="gap-1.5 px-4 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Search className="h-3.5 w-3.5" />
            {searchLoading ? '...' : 'Search'}
          </Button>
        </div>
        {searchError && (
          <p className="text-xs text-destructive">
            {searchError}
          </p>
        )}
      </div>

      <div className="mx-6 mb-6 flex-1 bg-muted/30 rounded-lg border border-border/40 overflow-auto">
        {searchBlobId && searchPolicyObjectId ? (
          <InlineDecryptionView
            blobId={searchBlobId}
            policyObjectId={searchPolicyObjectId}
            onDecrypted={handleDecrypted}
          />
        ) : searchPolicyObjectId && !searchBlobId ? (
          <PolicyObjectListView
            policyObjectId={searchPolicyObjectId}
            onBlobSelect={handleBlobSelect}
          />
        ) : null}
      </div>
    </Card>
  );
};

export default OtterCard;
