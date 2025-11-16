'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Music, Play, Pause, X } from 'lucide-react';
import { Button } from './ui/button';

interface AudioUploadProps {
  audioData: string;
  setAudioData: (data: string) => void;
}

export function AudioUpload({ audioData, setAudioData }: AudioUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAudioData(reader.result as string);
        setFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAudio = () => {
    setAudioData('');
    setFileName('');
    setIsPlaying(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleEnded = () => setIsPlaying(false);
      audio.addEventListener('ended', handleEnded);
      return () => audio.removeEventListener('ended', handleEnded);
    }
  }, [audioData]);

  return (
    <div>
      <label className="block text-slate-700 mb-3">
        <span className="flex items-center gap-2">
          <Music className="w-5 h-5 text-purple-500" />
          Add Audio
        </span>
      </label>

      {!audioData ? (
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <label className="block cursor-pointer">
            <div className="border-2 border-dashed border-pink-200 rounded-2xl p-8 text-center bg-pink-50/50 hover:bg-pink-100/50 transition-colors">
              <Music className="w-12 h-12 text-pink-400 mx-auto mb-2" />
              <p className="text-pink-600">Tap to upload audio</p>
              <p className="text-pink-400 text-sm mt-1">MP3, WAV, or OGG</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleAudioUpload}
              className="hidden"
            />
          </label>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-5"
        >
          <audio ref={audioRef} src={audioData} />
          <div className="flex items-center gap-4">
            <Button
              onClick={togglePlayPause}
              className="rounded-full w-12 h-12 p-0 bg-white text-purple-600 hover:bg-purple-50 shadow-md"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </Button>
            <div className="flex-1 min-w-0">
              <p className="text-purple-900 truncate">{fileName}</p>
              <p className="text-purple-600 text-sm">Audio ready to include</p>
            </div>
            <Button
              onClick={removeAudio}
              variant="ghost"
              size="sm"
              className="rounded-full w-8 h-8 p-0 text-purple-600 hover:bg-purple-200"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
