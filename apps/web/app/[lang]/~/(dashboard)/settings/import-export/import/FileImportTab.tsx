import { useRef, useState } from 'react'
import { Button } from '@penx/ui/components/button'
import { FileUp, Loader2 } from 'lucide-react'

interface ImportTabProps {
  isImporting: boolean
  onFileSelect: (file: File) => void
  description: string
  acceptTypes: string
  fileType: string
}

export function FileImportTab({
  isImporting,
  onFileSelect,
  description,
  acceptTypes,
  fileType,
}: ImportTabProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      onFileSelect(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      onFileSelect(files[0])
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm">{description}</p>

      <div
        className={`rounded-lg border-2 border-dashed p-6 text-center ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/20'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept={acceptTypes}
          onChange={handleFileChange}
          disabled={isImporting}
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          <FileUp className="text-muted-foreground h-8 w-8" />
          <p className="text-sm font-medium">
            Drag and drop your {fileType} file here
          </p>
          <p className="text-muted-foreground text-xs">or</p>
          <Button
            variant="outline"
            onClick={handleButtonClick}
            disabled={isImporting}
          >
            {isImporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              'Select File'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
