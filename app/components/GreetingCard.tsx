import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, ImageIcon } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

type CardEntry = {
  id: string;
  name?: string | null;
  message?: string | null;
  image?: string | null;
  audio?: string | null;
  timestamp?: string;
};

interface GreetingCardProps {
  state: number;
  onTap: () => void;
  card?: CardEntry;
}

export function GreetingCard({ state, onTap, card }: GreetingCardProps) {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [message, setMessage] = useState(
    card?.message ??
      'Wishing you a wonderful day filled with joy and happiness!'
  );
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleAudioToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAudioPlaying((p) => !p);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isAudioPlaying) {
      audio.play().catch(() => {
        /* ignore play error */
      });
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [isAudioPlaying]);

  useEffect(() => {
    // if card message changes (rare), update local message
    setMessage(card?.message ?? message);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card?.message]);

  return (
    <div
      className="relative w-full h-full flex items-center justify-center cursor-pointer"
      onClick={onTap}
    >
      {/* State 0: Closed Envelope */}
      {state === 0 && (
        <motion.div
          initial={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="relative w-[320px] h-[220px]"
        >
          {/* Envelope Body */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-2xl border border-blue-200 overflow-hidden"
            animate={{
              boxShadow: [
                '0 25px 50px rgba(0,0,0,0.15)',
                '0 25px 50px rgba(59,130,246,0.2)',
                '0 25px 50px rgba(0,0,0,0.15)',
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {/* Subtle shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{
                x: [-200, 400],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
                repeatDelay: 2,
              }}
              style={{ width: '200px' }}
            />

            {/* Decorative air mail stripes */}
            <div className="absolute top-4 left-4 right-4 flex gap-1.5 z-10">
              <div className="flex-1 h-1.5 bg-blue-400/40 rounded-full" />
              <div className="flex-1 h-1.5 bg-red-400/40 rounded-full" />
              <div className="flex-1 h-1.5 bg-blue-400/40 rounded-full" />
            </div>

            {/* Center seal decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <motion.div
                className="w-20 h-20 bg-yellow-200/50 rounded-full flex items-center justify-center backdrop-blur-sm"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <div className="w-16 h-16 bg-yellow-300/60 rounded-full flex items-center justify-center shadow-lg">
                  <motion.span
                    className="text-3xl"
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: 0.5,
                    }}
                  >
                    💌
                  </motion.span>
                </div>
              </motion.div>
            </div>

            {/* Bottom shadow effect */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-blue-300/20 to-transparent" />
          </motion.div>

          {/* Envelope Flap (closed) */}
          <div
            className="absolute left-0 top-0 w-full h-[110px] bg-gradient-to-br from-blue-200 to-blue-300 shadow-lg"
            style={{
              clipPath: 'polygon(0% 0%, 50% 65%, 100% 0%)',
            }}
          >
            <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-10 h-10 bg-white/20 rounded-full" />
          </div>

          {/* Tap instruction */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-center text-white/80 whitespace-nowrap"
          >
            Click to see the wishes
          </motion.div>
        </motion.div>
      )}

      {/* State 1: Envelope Opening with Partial Card */}
      {state === 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="relative w-[320px] h-[400px]"
        >
          {/* Envelope Body (stays visible) */}
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: 40 }}
            transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
            className="absolute left-0 bottom-0 w-full h-[220px]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-2xl border border-blue-200 overflow-hidden">
              {/* Decorative stripes */}
              <div className="absolute top-4 left-4 right-4 flex gap-1.5">
                <div className="flex-1 h-1.5 bg-blue-400/40 rounded-full" />
                <div className="flex-1 h-1.5 bg-red-400/40 rounded-full" />
                <div className="flex-1 h-1.5 bg-blue-400/40 rounded-full" />
              </div>

              {/* Bottom shadow */}
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-blue-300/20 to-transparent" />
            </div>
          </motion.div>

          {/* Envelope Flap (opening naturally with realistic motion) */}
          <motion.div
            initial={{ rotateX: 0 }}
            animate={{ rotateX: -180 }}
            transition={{
              duration: 1,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.2,
            }}
            className="absolute left-0 bottom-[220px] w-full h-[110px]"
            style={{
              transformStyle: 'preserve-3d',
              transformOrigin: 'bottom center',
              perspective: '1000px',
            }}
          >
            {/* Front of flap */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-blue-200 to-blue-300 shadow-lg"
              style={{
                clipPath: 'polygon(0% 100%, 50% 35%, 100% 100%)',
                backfaceVisibility: 'hidden',
              }}
              animate={{
                boxShadow: [
                  '0 10px 30px rgba(0,0,0,0.2)',
                  '0 20px 50px rgba(0,0,0,0.15)',
                  '0 2px 10px rgba(0,0,0,0.1)',
                ],
              }}
              transition={{
                duration: 1,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div className="absolute bottom-[30%] left-1/2 -translate-x-1/2 w-10 h-10 bg-white/20 rounded-full" />

              {/* Flap texture/pattern */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-400/10 to-transparent opacity-50" />
            </motion.div>

            {/* Back of flap */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200"
              style={{
                clipPath: 'polygon(0% 100%, 50% 35%, 100% 100%)',
                backfaceVisibility: 'hidden',
                transform: 'rotateX(180deg)',
                boxShadow: 'inset 0 -2px 5px rgba(0,0,0,0.1)',
              }}
            >
              {/* Inner flap pattern */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-60" />
            </div>
          </motion.div>

          {/* Letter peeking out (partial) - Card style with decorative border */}
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{
              duration: 1,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.6,
            }}
            className="absolute left-1/2 -translate-x-1/2 bottom-[80px] w-[280px] h-[200px] bg-white rounded-t-2xl shadow-xl overflow-hidden"
          >
            <div className="w-full h-full bg-gradient-to-br from-pink-50/70 via-white to-blue-50/70 p-6 flex flex-col items-center relative">
              {/* Decorative top edge pattern */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 opacity-50" />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 1.1,
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="text-center relative"
              >
                <div className="mb-3 relative">
                  <span className="text-4xl">👨</span>
                  <motion.div
                    className="absolute -top-1 -right-3 text-lg"
                    animate={{
                      rotate: [0, 15, -15, 0],
                      scale: [1, 1.2, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: 1.5,
                    }}
                  >
                    ✨
                  </motion.div>
                </div>
                <h1 className="text-blue-600 mb-2 relative">
                  Happy International Men’s Day from Cluster Validation Team!
                  <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-60" />
                </h1>
                <div className="text-blue-500 relative">
                  <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                    19/11
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, duration: 0.5 }}
                className="text-center text-xs text-gray-400 mt-4 flex items-center gap-2"
              >
                <motion.span
                  animate={{ y: [0, -3, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  👆
                </motion.span>
                Click to see the wishes
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* State 2: Full Card Display */}
      {state === 2 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="relative w-full h-full flex items-center justify-center px-4"
        >
          {/* Special Sparkle Effect - Appears when card opens */}
          <AnimatePresence>
            {/* Radial glow burst */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 2.5, opacity: [0, 0.6, 0] }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 pointer-events-none z-10"
            >
              <div className="w-full h-full bg-gradient-radial from-yellow-200/40 via-pink-200/20 to-transparent rounded-full blur-3xl" />
            </motion.div>

            {/* Sparkle particles burst */}
            {[...Array(12)].map((_, i) => {
              const angle = i * 30 * (Math.PI / 180);
              const distance = 150 + (i % 3) * 30;
              const x = Math.cos(angle) * distance;
              const y = Math.sin(angle) * distance;

              return (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                  animate={{
                    x: [0, x, x * 1.2],
                    y: [0, y, y * 1.2],
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1 + (i % 3) * 0.2,
                    ease: [0.34, 1.56, 0.64, 1],
                    delay: i * 0.03,
                  }}
                  className="absolute left-1/2 top-1/2 pointer-events-none z-20"
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      i % 4 === 0
                        ? 'bg-yellow-400'
                        : i % 4 === 1
                        ? 'bg-pink-400'
                        : i % 4 === 2
                        ? 'bg-blue-400'
                        : 'bg-purple-400'
                    } shadow-lg`}
                  />
                </motion.div>
              );
            })}

            {/* Rotating sparkle stars */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={`star-${i}`}
                initial={{ scale: 0, rotate: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1.5, 0],
                  rotate: [0, 180, 360],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.4,
                  ease: 'easeOut',
                  delay: i * 0.1,
                }}
                className="absolute pointer-events-none z-15"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 2) * 40}%`,
                }}
              >
                <span className="text-2xl">✨</span>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Full Letter Card - Greeting Card Style */}
          <motion.div
            initial={{ y: 50, scale: 0.9 }}
            animate={{ y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
            className="w-full max-w-[360px] mx-auto bg-white rounded-3xl overflow-hidden relative"
            style={{
              boxShadow:
                '0 30px 60px rgba(0,0,0,0.2), 0 0 40px rgba(236,72,153,0.1)',
            }}
          >
            {/* Decorative corner flourishes */}
            <div className="absolute top-0 left-0 w-20 h-20 opacity-20 pointer-events-none">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full text-blue-400"
              >
                <path
                  d="M0,0 Q30,0 50,20 T100,0 L100,100 Q70,100 50,80 T0,100 Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div className="absolute top-0 right-0 w-20 h-20 opacity-20 pointer-events-none rotate-90">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full text-pink-400"
              >
                <path
                  d="M0,0 Q30,0 50,20 T100,0 L100,100 Q70,100 50,80 T0,100 Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div className="absolute bottom-0 left-0 w-20 h-20 opacity-20 pointer-events-none -rotate-90">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full text-purple-400"
              >
                <path
                  d="M0,0 Q30,0 50,20 T100,0 L100,100 Q70,100 50,80 T0,100 Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div className="absolute bottom-0 right-0 w-20 h-20 opacity-20 pointer-events-none rotate-180">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full text-yellow-400"
              >
                <path
                  d="M0,0 Q30,0 50,20 T100,0 L100,100 Q70,100 50,80 T0,100 Z"
                  fill="currentColor"
                />
              </svg>
            </div>

            <div className="w-full bg-gradient-to-br from-pink-50/80 via-white to-blue-50/80 p-6 max-h-[700px] overflow-y-auto relative">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-center mb-6 relative"
              >
                {/* Decorative top banner */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-32 h-12 bg-gradient-to-r from-pink-200/30 via-purple-200/30 to-blue-200/30 rounded-full blur-xl" />

                <div className="mb-3 relative">
                  <span className="text-5xl">👨</span>
                  <motion.div
                    className="absolute -top-2 -right-2 text-2xl"
                    animate={{
                      rotate: [0, 15, -15, 0],
                      scale: [1, 1.1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    ✨
                  </motion.div>
                </div>
                <h1 className="text-blue-600 mb-2 relative inline-block">
                  Happy International Men’s Day from Cluster Validation Team!
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
                </h1>
                <div className="text-blue-500 mb-4 relative">
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    19/11
                  </span>
                </div>

                {/* Decorative divider with ornamental design */}
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-pink-300" />
                  <div className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
                  <div className="w-12 h-1 bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 rounded-full" />
                  <div
                    className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"
                    style={{ animationDelay: '0.5s' }}
                  />
                  <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-blue-300" />
                </div>
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="space-y-5 relative"
              >
                {/* Image Placeholder - Greeting Card Photo Frame Style */}
                <div
                  className="relative w-full aspect-[4/3] bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl overflow-hidden shadow-xl border-4 border-white flex items-center justify-center"
                  style={{
                    boxShadow:
                      '0 10px 40px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)',
                  }}
                >
                  {/* Photo frame inner shadow */}
                  <div
                    className="absolute inset-0 rounded-xl shadow-inner opacity-20"
                    style={{ boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.15)' }}
                  />

                  {card?.image ? (
                    <img
                      src={card.image}
                      alt={card?.name ?? 'photo'}
                      className="w-full h-full object-cover absolute inset-0"
                    />
                  ) : (
                    <ImageIcon className="w-14 h-14 text-blue-300 relative z-10" />
                  )}

                  {/* Corner decorations */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-pink-300/50 rounded-tl-lg" />
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-blue-300/50 rounded-tr-lg" />
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-purple-300/50 rounded-bl-lg" />
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-yellow-300/50 rounded-br-lg" />

                  {/* Sparkle decoration on image */}
                  <motion.div
                    className="absolute top-5 right-5 w-3 h-3 bg-yellow-300 rounded-full shadow-lg"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.6, 1, 0.6],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                  <motion.div
                    className="absolute top-5 left-5 w-2 h-2 bg-blue-300 rounded-full shadow-lg"
                    animate={{
                      scale: [1, 1.4, 1],
                      opacity: [0.5, 0.9, 0.5],
                    }}
                    transition={{
                      duration: 2.3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: 0.5,
                    }}
                  />
                </div>

                {/* Editable Message - Card Style */}
                <div className="space-y-2 relative">
                  <div className="flex items-center gap-2 pl-1">
                    <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent" />
                  </div>
                  <div className="relative mx-2">
                    <div
                      className="w-full h-32 max-h-48 overflow-y-auto bg-white/90 backdrop-blur-sm border-2 border-blue-100 rounded-xl text-gray-700 shadow-sm relative z-10"
                      style={{
                        lineHeight: '1.6',
                        whiteSpace: 'pre-wrap',
                        padding: '5px 8px',
                      }}
                    >
                      {message || 'Your message will appear here'}
                    </div>

                    {/* Decorative quote marks */}
                    <div className="absolute top-2 left-2 text-2xl text-pink-200 opacity-40 pointer-events-none">
                      "
                    </div>
                    <div className="absolute bottom-2 right-2 text-2xl text-blue-200 opacity-40 pointer-events-none">
                      "
                    </div>
                  </div>
                </div>

                {/* Audio Button - Modern Circular Style */}
                <div className="flex justify-center pt-2">
                  <motion.button
                    onClick={handleAudioToggle}
                    className="relative w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 flex items-center justify-center shadow-xl cursor-pointer overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      boxShadow: isAudioPlaying
                        ? [
                            '0 0 16px rgba(236, 72, 153, 0.6)',
                            '0 0 32px rgba(236, 72, 153, 0.8)',
                            '0 0 16px rgba(236, 72, 153, 0.6)',
                          ]
                        : '0 8px 24px rgba(0, 0, 0, 0.18)',
                    }}
                    transition={{
                      boxShadow: {
                        duration: 1.2,
                        repeat: isAudioPlaying ? Infinity : 0,
                        ease: 'easeInOut',
                      },
                    }}
                  >
                    {/* Ripple effect when playing */}
                    {isAudioPlaying && (
                      <>
                        <motion.div
                          className="absolute inset-0 rounded-full border-3 border-pink-400"
                          initial={{ scale: 1, opacity: 0.8 }}
                          animate={{ scale: 1.4, opacity: 0 }}
                          transition={{
                            duration: 1.4,
                            repeat: Infinity,
                            ease: 'easeOut',
                          }}
                        />
                        <motion.div
                          className="absolute inset-0 rounded-full border-3 border-purple-400"
                          initial={{ scale: 1, opacity: 0.8 }}
                          animate={{ scale: 1.4, opacity: 0 }}
                          transition={{
                            duration: 1.4,
                            repeat: Infinity,
                            ease: 'easeOut',
                            delay: 0.45,
                          }}
                        />
                      </>
                    )}

                    {/* Icon */}
                    <motion.div
                      animate={{ rotate: isAudioPlaying ? [0, 5, -5, 0] : 0 }}
                      transition={{
                        duration: 0.45,
                        repeat: isAudioPlaying ? Infinity : 0,
                        ease: 'easeInOut',
                      }}
                    >
                      {isAudioPlaying ? (
                        <Volume2 className="w-5 h-5 text-white relative z-10" />
                      ) : (
                        <VolumeX className="w-5 h-5 text-white relative z-10" />
                      )}
                    </motion.div>

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </motion.button>
                </div>

                {/* Hidden audio element (plays when user toggles) */}
                {card?.audio && (
                  <audio ref={audioRef} src={card.audio} preload="auto" />
                )}
              </motion.div>

              {/* Decorative sparkles and floating elements */}
              <motion.div
                className="absolute bottom-8 left-6 w-2.5 h-2.5 bg-yellow-300 rounded-full"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.3,
                }}
              />
              <motion.div
                className="absolute top-32 right-6 w-2 h-2 bg-blue-400 rounded-full"
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.7,
                }}
              />
              <motion.div
                className="absolute top-24 left-4 text-xl opacity-60"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                🎈
              </motion.div>
              <motion.div
                className="absolute bottom-20 right-5 text-lg opacity-50"
                animate={{
                  y: [0, -8, 0],
                  rotate: [0, -8, 0],
                }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.5,
                }}
              >
                🎉
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
