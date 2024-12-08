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

interface ConfirmationDialogProps {
  transcription: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationDialog({ 
  transcription, 
  onConfirm, 
  onCancel 
}: ConfirmationDialogProps) {
  return (
    <AlertDialog open={transcription !== null}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Voice Command</AlertDialogTitle>
          <AlertDialogDescription>
            Did you mean: &quot;{transcription}&quot;?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>OK</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}