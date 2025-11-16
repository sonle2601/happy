import { useState } from 'react';
import { ImageUpload } from '../components/ImageUpload';
import { AudioUpload } from '../components/AudioUpload';
import { MessageInput } from '../components/MessageInput';
import { QRCodeDisplay } from '../components/QRCodeDisplay';
import { Button } from '../components/ui/button';
import { Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [imageData, setImageData] = useState<string>('');
  const [audioData, setAudioData] = useState<string>('');
  const [message, setMessage] = useState('');
  const [qrCodeData, setQrCodeData] = useState<string>('');
  const [showQR, setShowQR] = useState(false);

  const handleCreateCard = () => {
    // Create greeting card configuration
    const cardConfig = {
      image: imageData ? 'image-included' : 'no-image',
      audio: audioData ? 'audio-included' : 'no-audio',
      message: message || 'no-message',
      timestamp: new Date().toISOString(),
    };

    // In a real app, this would be a URL to the card
    // For demo purposes, we're encoding the config as JSON
    const qrData = JSON.stringify(cardConfig);
    setQrCodeData(qrData);
    setShowQR(true);
  };

  const hasContent = imageData || audioData || message;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
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
          <ImageUpload imageData={imageData} setImageData={setImageData} />

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
