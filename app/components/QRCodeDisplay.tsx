import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Share2 } from 'lucide-react';
import { Button } from './ui/button';

interface QRCodeDisplayProps {
  qrData: string;
}

export function QRCodeDisplay({ qrData }: QRCodeDisplayProps) {
  const downloadQRCode = () => {
    const svg = document.getElementById('qr-code');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL('image/png');

        const downloadLink = document.createElement('a');
        downloadLink.download = 'greeting-card-qr.png';
        downloadLink.href = pngFile;
        downloadLink.click();
      };

      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  const shareQRCode = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Greeting Card',
          text: 'Scan this QR code to view my greeting card!',
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    }
  };

  return (
    <motion.div className="mt-6 bg-white rounded-3xl shadow-xl p-8" layout>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className="text-center"
      >
        <h2 className="text-green-600 mb-2">🎉 Card Created!</h2>
        <p className="text-slate-600 mb-6">
          Scan this QR code to access your greeting card
        </p>

        <div className="from-green-50 to-blue-50 rounded-2xl p-6 inline-block">
          <motion.div
            initial={{ rotate: -5 }}
            animate={{ rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <QRCodeSVG
              id="qr-code"
              value={qrData}
              size={240}
              level="H"
              includeMargin={true}
              className="mx-auto"
            />
          </motion.div>
        </div>

        <div className="flex gap-3 justify-center mt-6">
          <Button
            onClick={downloadQRCode}
            variant="outline"
            className="rounded-xl border-2 border-purple-300 hover:bg-purple-50 text-purple-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>

          {typeof navigator !== 'undefined' &&
            typeof navigator.share === 'function' && (
              <Button
                onClick={shareQRCode}
                variant="outline"
                className="rounded-xl border-2 border-blue-300 hover:bg-blue-50 text-blue-700"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            )}
        </div>

        <p className="text-slate-500 text-sm mt-6">
          Anyone with this QR code can view your greeting card
        </p>
      </motion.div>
    </motion.div>
  );
}
