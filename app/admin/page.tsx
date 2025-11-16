'use client';

import { useState } from 'react';
import { ImageUpload } from '../components/ImageUpload';
import { AudioUpload } from '../components/AudioUpload';
import { MessageInput } from '../components/MessageInput';
import { QRCodeDisplay } from '../components/QRCodeDisplay';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function App() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioData, setAudioData] = useState<string>('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [qrCodeData, setQrCodeData] = useState<string>('');
  const [showQR, setShowQR] = useState(false);

  const handleCreateCard = async () => {
    // Create greeting card configuration
    const cardConfig = {
      image: imageFile ? 'image-included' : 'no-image',
      audio: audioData ? 'audio-included' : 'no-audio',
      message: message || 'no-message',
      timestamp: new Date().toISOString(),
    };

    try {
      // Upload media to Cloudinary first to avoid large JSON payloads.
      // This uses an unsigned upload preset which must be set in the Cloudinary
      // dashboard and exposed via NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.
      const cloudName = 'dtxkcvzg4';
      const uploadPreset = 'n1bn55kx';

      async function dataURLToBlob(dataurl: string) {
        const arr = dataurl.split(',');
        const mimeMatch = arr[0].match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) u8arr[n] = bstr.charCodeAt(n);
        return new Blob([u8arr], { type: mime });
      }

      async function uploadFileToCloudinary(
        file: File | Blob,
        folder: string,
        resourceType: 'image' | 'video'
      ) {
        if (!uploadPreset) {
          // No preset configured: signal caller to fallback to old behavior
          throw new Error('MISSING_CLOUDINARY_UPLOAD_PRESET');
        }

        const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
        const form = new FormData();
        // If caller passed a Blob, wrap into a File to give it a name
        const fileToUpload =
          file instanceof File
            ? file
            : new File([file], 'upload', { type: (file as Blob).type });
        form.append('file', fileToUpload as File);
        form.append('upload_preset', uploadPreset);
        form.append('folder', folder);

        const r = await fetch(url, { method: 'POST', body: form });
        if (!r.ok) {
          const txt = await r.text();
          throw new Error(`Cloudinary upload failed: ${r.status} ${txt}`);
        }
        const json = await r.json();
        return json.secure_url as string;
      }

      // Try to upload image and audio to Cloudinary. If upload preset is not configured
      // or upload fails, fall back to the original behavior (sending base64) so the app
      // remains functional.
      let imageUrl: string | undefined = undefined;
      let audioUrl: string | undefined = undefined;

      try {
        if (imageFile) {
          imageUrl = await uploadFileToCloudinary(
            imageFile,
            'cards/images',
            'image'
          );
        }

        if (audioData) {
          // audioData is stored as a data URL in state; convert to Blob then upload
          const blob = await dataURLToBlob(audioData);
          audioUrl = await uploadFileToCloudinary(blob, 'cards/audio', 'video');
        }
      } catch (uploadErr) {
        if (
          (uploadErr as Error).message === 'MISSING_CLOUDINARY_UPLOAD_PRESET'
        ) {
          // No preset configured; fall back to previous flow (send base64 to API)
          console.warn(
            'NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET not set; falling back to sending base64'
          );
        } else {
          console.error('Cloudinary upload error', uploadErr);
          // If upload fails for other reason, continue and let server try to accept base64
        }
      }

      // If we have no imageUrl but we do have an imageFile, convert to base64 as before
      let imageDataUrl: string | undefined = undefined;
      if (!imageUrl && imageFile) {
        imageDataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (err) => reject(err);
          reader.readAsDataURL(imageFile);
        });
      }

      // If we have no audioUrl but audioData exists, keep audioData (it's already a data URL)

      const res = await fetch('/api/saveCard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: imageUrl ?? undefined,
          imageData: imageDataUrl ?? undefined,
          audioUrl: audioUrl ?? undefined,
          audioData: !audioUrl && audioData ? audioData : undefined,
          message: message || undefined,
          name: name || undefined,
        }),
      });
      const data = await res.json();
      if (data?.ok) {
        if (name) {
          const slug = slugify(name);
          const url = `${window.location.origin}/${slug}`;
          setQrCodeData(url);
          setShowQR(true);
        } else {
          // include server id in qr payload when no name
          const qrData = JSON.stringify({ id: data.entry.id, ...cardConfig });
          setQrCodeData(qrData);
          setShowQR(true);
        }
        setName('');
        setImageFile(null);
        setAudioData('');
        setMessage('');
        toast.success('Card saved');
      } else {
        // fallback to local QR data if server failed
        if (name) {
          const slug = slugify(name);
          const url = `${window.location.origin}/${slug}`;
          setQrCodeData(url);
          setShowQR(true);
        } else {
          const qrData = JSON.stringify(cardConfig);
          setQrCodeData(qrData);
          setShowQR(true);
        }
        console.error('Failed to save card', data);
        toast.error('Failed to save card');
      }
    } catch (err) {
      if (name) {
        const slug = slugify(name);
        const url = `${window.location.origin}/${slug}`;
        setQrCodeData(url);
        setShowQR(true);
      } else {
        const qrData = JSON.stringify(cardConfig);
        setQrCodeData(qrData);
        setShowQR(true);
      }
      console.error('save error', err);
      toast.error('Save error');
    }
  };

  function slugify(input: string) {
    return (
      input
        .normalize('NFD')
        // remove diacritic combining marks
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
    );
  }
  const hasContent =
    Boolean(imageFile) ||
    Boolean(audioData) ||
    Boolean(message) ||
    Boolean(name);

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-8 h-8 text-purple-500" />
            <h1 className="text-pink-600">Create Your Greeting Card</h1>
          </div>
          <p className="text-slate-600">
            Add an image, audio, and message to create a special card
          </p>
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-lg p-6 mb-6 space-y-6"
        >
          <div>
            <label className="block text-slate-700 mb-3">
              <span className="flex items-center gap-2">Name</span>
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter a name to use in the card URL"
              className="mb-4"
            />
          </div>

          <ImageUpload file={imageFile} setFile={setImageFile} />

          <div className="border-t border-slate-100 pt-6">
            <AudioUpload audioData={audioData} setAudioData={setAudioData} />
          </div>

          <div className="border-t border-slate-100 pt-6">
            <MessageInput message={message} setMessage={setMessage} />
          </div>
        </motion.div>

        {/* Create Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={handleCreateCard}
            disabled={!hasContent}
            className="w-full h-14 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-2xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Create Greeting Card
          </Button>
        </motion.div>

        {/* QR Code Display */}
        <AnimatePresence>
          {showQR && qrCodeData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
            >
              <QRCodeDisplay qrData={qrCodeData} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
