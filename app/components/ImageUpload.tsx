/* eslint-disable @next/next/no-img-element */
'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ImagePlus, X } from 'lucide-react';
import { Button } from './ui/button';

interface ImageUploadProps {
  file: File | null;
  setFile: (file: File | null) => void;
}

export function ImageUpload({ file, setFile }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
    }
  };

  const removeImage = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <label className="block text-slate-700 mb-3">
        <span className="flex items-center gap-2">
          <ImagePlus className="w-5 h-5 text-pink-500" />
          Add Image
        </span>
      </label>

      {!file ? (
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <label className="block cursor-pointer">
            <div className="border-2 border-dashed border-purple-200 rounded-2xl p-8 text-center bg-purple-50/50 hover:bg-purple-100/50 transition-colors">
              <ImagePlus className="w-12 h-12 text-purple-400 mx-auto mb-2" />
              <p className="text-purple-600">Tap to upload an image</p>
              <p className="text-purple-400 text-sm mt-1">JPG, PNG, or GIF</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-2xl overflow-hidden"
        >
          <img
            src={URL.createObjectURL(file)}
            alt="Uploaded"
            className="w-full h-64 object-cover rounded-2xl"
          />
          <Button
            onClick={removeImage}
            variant="destructive"
            size="sm"
            className="absolute top-3 right-3 rounded-full w-8 h-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}
