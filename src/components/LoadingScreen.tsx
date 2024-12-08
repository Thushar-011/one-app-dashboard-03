import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function LoadingScreen({ onLoadingComplete }: { onLoadingComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onLoadingComplete, 500); // Allow exit animation to complete
    }, 5000);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center"
    >
      <div className="relative w-48 h-48">
        {/* Logo image */}
        <img 
          src="/lovable-uploads/e12237ee-3f46-41e6-b992-94b99c1fbb9a.png" 
          alt="OneApp Logo" 
          className="w-full h-full"
        />
        
        {/* Rotating ball */}
        <motion.div
          className="absolute w-3 h-3 bg-black rounded-full"
          initial={{ scale: 0 }}
          animate={{ 
            scale: 1,
            rotate: 360,
          }}
          transition={{
            rotate: {
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            },
            scale: {
              duration: 0.5,
              delay: 0.8
            }
          }}
          style={{
            top: "0%",
            left: "50%",
            translateX: "-50%",
            transformOrigin: "50% 150%"
          }}
        />
      </div>

      <motion.p
        className="mt-8 text-xl font-display text-black/80"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        style={{ fontFamily: 'Satoshi, sans-serif' }}
      >
        Your all-in-one productivity app
      </motion.p>
    </motion.div>
  );
}