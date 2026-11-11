import { CheckCircle2Icon } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// ডিলিট সফল হলে দেখানো সাকসেস ডায়লগ — Done চাপলে পেজ refetch করে
type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
};

export function DeleteSuccessDialog({ open, onOpenChange, onClose }: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-green-500/10 text-green-600">
            <CheckCircle2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Deleted successfully!</AlertDialogTitle>
          <AlertDialogDescription>
            Job post ta successfully delete hoye gese.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogAction onClick={onClose}>Done</AlertDialogAction>
      </AlertDialogContent>
    </AlertDialog>
  );
}
