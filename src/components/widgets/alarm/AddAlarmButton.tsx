import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface AddAlarmButtonProps {
  onClick: () => void;
}

export default function AddAlarmButton({ onClick }: AddAlarmButtonProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 transform"
    >
      <Button
        variant="outline"
        onClick={onClick}
        className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/90 to-primary hover:from-primary hover:to-primary/90 border-none shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-xl"
      >
        <span className="text-white text-3xl font-light select-none">+</span>
      </Button>
    </motion.div>
  );
}