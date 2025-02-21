import * as React from "react"
import { Button, Label } from "@/components/ui"
import { Upload, X, File } from "lucide-react"
import { DocumentType } from "@/types/verification"

interface DocumentUploadProps {
  type: DocumentType;
  onUpload: (file: File) => Promise<void>;
}

export function DocumentUpload({ type, onUpload }: DocumentUploadProps) {
  const [file, setFile] = React.useState<File | null>(null);
  const [loading, setLoading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      await onUpload(file);
      setFile(null);
    } catch (error) {
      console.error('Upload failed:', error);
    }
    setLoading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) setFile(droppedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-4">
      <Label htmlFor={`upload-${type}`} className="text-sm font-medium">
        Upload {type.charAt(0).toUpperCase() + type.slice(1)} Document
      </Label>
      <div 
        className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
          file ? 'bg-muted/50' : 'hover:bg-muted/50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {file ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <File className="h-5 w-5 text-primary" />
              <span className="text-sm">{file.name}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFile(null)}
              className="hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="text-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <input
              ref={fileInputRef}
              id={`upload-${type}`}
              type="file"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <p className="text-sm text-muted-foreground">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PDF, JPG, or PNG up to 10MB
            </p>
          </div>
        )}
      </div>
      {file && (
        <Button
          onClick={handleUpload}
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Upload className="mr-2 h-4 w-4 animate-bounce" />
              Uploading...
            </>
          ) : (
            'Upload Document'
          )}
        </Button>
      )}
    </div>
  );
}
