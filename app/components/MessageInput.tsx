import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { Textarea } from './ui/textarea';

interface MessageInputProps {
  message: string;
  setMessage: (message: string) => void;
}

export function MessageInput({ message, setMessage }: MessageInputProps) {
  return (
    <div>
      <label className="block text-slate-700 mb-3">
        <span className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-500" />
          Your Message
        </span>
      </label>

      <motion.div whileFocus={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your greeting message here..."
          className="min-h-32 resize-none rounded-2xl border-2 border-blue-200 focus:border-blue-400 bg-blue-50/30 focus:bg-white transition-colors p-4"
        />
      </motion.div>

      <div className="flex justify-between items-center mt-2 px-2">
        <p className="text-blue-400 text-sm">Share your heartfelt wishes</p>
        <p className="text-blue-400 text-sm">{message.length} characters</p>
      </div>
    </div>
  );
}
