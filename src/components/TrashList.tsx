import { Trash2, RotateCcw } from "lucide-react";
import { useWidgets } from "@/hooks/useWidgets";
import { toast } from "sonner";
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
import { Button } from "@/components/ui/button";

interface TrashListProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TrashList({ isOpen, onClose }: TrashListProps) {
  const { widgets, trashedWidgets, restoreWidget, clearTrash, restoreAllWidgets } = useWidgets();

  const handleRestore = (widgetId: string) => {
    const widgetToRestore = trashedWidgets.find(w => w.id === widgetId);
    if (widgetToRestore && widgets.some(w => w.type === widgetToRestore.type)) {
      toast.error(`Cannot restore ${widgetToRestore.type} widget as one already exists. Delete the existing widget first.`, {
        duration: 2000,
      });
      return;
    }
    restoreWidget(widgetId);
    onClose();
    toast.success("Widget restored successfully", { duration: 1000 });
  };

  const handleRestoreAll = () => {
    const canRestoreAll = trashedWidgets.every(
      trashedWidget => !widgets.some(w => w.type === trashedWidget.type)
    );

    if (!canRestoreAll) {
      toast.error("Cannot restore all widgets. Some widget types already exist on the dashboard.", {
        duration: 2000,
      });
      return;
    }

    restoreAllWidgets();
    onClose();
    toast.success("All widgets restored successfully", { duration: 1000 });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md mx-auto bg-background">
        <AlertDialogHeader>
          <AlertDialogTitle>Trash</AlertDialogTitle>
          <AlertDialogDescription>
            Restore or permanently delete widgets
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4">
          {trashedWidgets.length === 0 ? (
            <p className="text-center text-muted-foreground">No items in trash</p>
          ) : (
            <div className="space-y-2">
              {trashedWidgets.map((widget) => (
                <div
                  key={widget.id}
                  className="flex items-center justify-between p-3 bg-card rounded-lg border border-border"
                >
                  <span className="capitalize text-foreground">{widget.type}</span>
                  <button
                    onClick={() => handleRestore(widget.id)}
                    className="p-2 hover:bg-muted rounded-full transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel>Close</AlertDialogCancel>
          {trashedWidgets.length > 0 && (
            <>
              <Button
                onClick={handleRestoreAll}
                variant="outline"
                className="w-full sm:w-auto"
              >
                Restore All
              </Button>
              <AlertDialogAction
                onClick={() => {
                  clearTrash();
                  toast.success("Trash cleared successfully", { duration: 1000 });
                }}
                className="bg-destructive hover:bg-destructive/90 w-full sm:w-auto"
              >
                Clear All
              </AlertDialogAction>
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}