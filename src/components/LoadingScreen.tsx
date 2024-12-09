import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function LoadingScreen({ onLoadingComplete }: { onLoadingComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onLoadingComplete, 500);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center"
    >
      <motion.div 
        className="relative w-48 h-48"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: 0.5,
          ease: [0.16, 1, 0.3, 1]
        }}
      >
        <img 
          src="/lovable-uploads/df90b244-875b-4c4b-972f-7cf015dcf0fb.png" 
          alt="OneApp Logo" 
          className="w-full h-full"
        />
      </motion.div>

      <motion.p
        className="mt-4 text-xl font-display text-black/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ 
          duration: 0.5, 
          delay: 1.2 // Increased delay for the tagline to appear after the logo
        }}
        style={{ 
          fontFamily: 'Satoshi, sans-serif',
          letterSpacing: '-0.075em'
        }}
      >
        Your all-in-one productivity solution
      </motion.p>
    </motion.div>
  );
}