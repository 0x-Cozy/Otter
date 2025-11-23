import * as React from "react";
import { Upload } from "lucide-react";
import { Button } from "./button";
import { cn } from "../../lib/utils";

interface FileInputButtonProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  disabled?: boolean;
  className?: string;
  selectedFile?: File | null;
}

const FileInputButton = React.forwardRef<HTMLInputElement, FileInputButtonProps>(
  ({ onFileSelect, accept = "image/*", disabled, className, selectedFile, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => inputRef.current!);

    const handleClick = () => {
      inputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onFileSelect(file);
      }
    };

    return (
      <div className={cn("space-y-2", className)}>
        <input
          type="file"
          ref={inputRef}
          onChange={handleFileChange}
          accept={accept}
          disabled={disabled}
          className="hidden"
          {...props}
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleClick}
          disabled={disabled}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          {selectedFile ? selectedFile.name : "Select Image"}
        </Button>
        {selectedFile && (
          <p className="text-xs text-muted-foreground">
            {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
          </p>
        )}
      </div>
    );
  }
);
FileInputButton.displayName = "FileInputButton";

export { FileInputButton };

