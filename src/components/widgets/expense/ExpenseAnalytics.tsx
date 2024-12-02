import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState } from "react";
import { ExpenseCategory, Expense } from "@/types/widget";
import ExpenseAnalyticsPanes from "./analytics/ExpenseAnalyticsPanes";

interface ExpenseAnalyticsProps {
  categories: ExpenseCategory[];
  expenses: Expense[];
  onClose: () => void;
}

export default function ExpenseAnalytics({ categories, expenses, onClose }: ExpenseAnalyticsProps) {
  const [currentPane, setCurrentPane] = useState(0);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'left' && currentPane < 2) {
      setCurrentPane(currentPane + 1);
    } else if (direction === 'right' && currentPane > 0) {
      setCurrentPane(currentPane - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="fixed inset-0 bg-background overflow-auto animate-in fade-in-0">
        <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b p-4 mb-4">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold">Expense Analytics</h2>
            <Button variant="ghost" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        <div className="max-w-2xl mx-auto p-4 space-y-6">
          <div 
            className="touch-pan-y"
            onTouchStart={(e) => {
              const touch = e.touches[0];
              const startX = touch.clientX;
              
              const handleTouchEnd = (e: TouchEvent) => {
                const touch = e.changedTouches[0];
                const endX = touch.clientX;
                const diff = startX - endX;
                
                if (Math.abs(diff) > 50) {
                  handleSwipe(diff > 0 ? 'left' : 'right');
                }
              };
              
              document.addEventListener('touchend', handleTouchEnd, { once: true });
            }}
          >
            <ExpenseAnalyticsPanes
              categories={categories}
              expenses={expenses}
              currentPane={currentPane}
            />
          </div>

          <div className="flex justify-center gap-2">
            {[0, 1, 2].map((paneIndex) => (
              <button
                key={paneIndex}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentPane === paneIndex ? 'bg-primary' : 'bg-muted'
                }`}
                onClick={() => setCurrentPane(paneIndex)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}