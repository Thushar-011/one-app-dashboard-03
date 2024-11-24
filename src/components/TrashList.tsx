import { Trash2, RotateCcw } from "lucide-react";
import { useWidgets } from "@/hooks/useWidgets";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TrashListProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TrashList({ isOpen, onClose }: TrashListProps) {
  const { trashedWidgets, restoreWidget, clearTrash } = useWidgets();

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md mx-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Trash</AlertDialogTitle>
          <AlertDialogDescription>
            Restore or permanently delete widgets
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4">
          {trashedWidgets.length === 0 ? (
            <p className="text-center text-gray-500">No items in trash</p>
          ) : (
            <div className="space-y-2">
              {trashedWidgets.map((widget) => (
                <div
                  key={widget.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="capitalize">{widget.type}</span>
                  <button
                    onClick={() => {
                      restoreWidget(widget.id);
                      onClose();
                    }}
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
          {trashedWidgets.length > 0 && (
            <AlertDialogAction
              onClick={clearTrash}
              className="bg-red-500 hover:bg-red-600"
            >
              Clear All
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}