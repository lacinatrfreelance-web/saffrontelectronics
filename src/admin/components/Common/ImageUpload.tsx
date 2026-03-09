import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Image } from 'lucide-react'

interface ImageUploadProps {
  onFilesChange: (files: File[]) => void
  maxFiles?: number
  existingImages?: string[]
  onRemoveExisting?: (index: number) => void
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onFilesChange,
  maxFiles = 5,
  existingImages = [],
  onRemoveExisting,
}) => {
  const [previews, setPreviews] = useState<string[]>([])
  const [files, setFiles] = useState<File[]>([])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = [...files, ...acceptedFiles].slice(0, maxFiles)
      setFiles(newFiles)
      onFilesChange(newFiles)

      const newPreviews = newFiles.map((file) => URL.createObjectURL(file))
      setPreviews(newPreviews)
    },
    [files, maxFiles, onFilesChange]
  )

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    const newPreviews = previews.filter((_, i) => i !== index)
    setFiles(newFiles)
    setPreviews(newPreviews)
    onFilesChange(newFiles)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: maxFiles - files.length - existingImages.length,
    maxSize: 5 * 1024 * 1024, // 5MB
  })

  const totalImages = existingImages.length + previews.length
  const canAddMore = totalImages < maxFiles

  return (
    <div className="flex flex-col gap-3">
      {/* Existing images */}
      {existingImages.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {existingImages.map((img, i) => (
            <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-secondary-200">
              <img src={img} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
              {onRemoveExisting && (
                <button
                  onClick={() => onRemoveExisting(i)}
                  type="button"
                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                >
                  <X size={10} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* New previews */}
      {previews.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {previews.map((preview, i) => (
            <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-primary-200">
              <img src={preview} alt={`Nouveau ${i + 1}`} className="w-full h-full object-cover" />
              <button
                onClick={() => removeFile(i)}
                type="button"
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      {canAddMore && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary-500 bg-primary-50'
              : 'border-secondary-200 hover:border-primary-300 hover:bg-secondary-50'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 bg-secondary-100 rounded-xl flex items-center justify-center">
              <Upload size={18} className="text-secondary-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-secondary-700">
                {isDragActive ? 'Deposez les images ici' : 'Glissez des images ou cliquez'}
              </p>
              <p className="text-xs text-secondary-400 mt-0.5">
                PNG, JPG, WebP jusqu'a 5MB ({maxFiles - totalImages} emplacement{maxFiles - totalImages > 1 ? 's' : ''} restant{maxFiles - totalImages > 1 ? 's' : ''})
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageUpload