import { Trash2Icon } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// জব ডিলিট কনফার্ম ডায়লগ — shadcn (Base UI) AlertDialog দিয়ে তৈরি।
// কন্ট্রোলড কম্পোনেন্ট: open/onOpenChange পেজ থেকে আসে,
// ট্রিগার হলো টেবিল রো-র delete (Trash2) আইকন।
type DeleteJobDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobTitle?: string;
  onConfirm: () => void;
};

export function DeleteJobDialog({
  open,
  onOpenChange,
  jobTitle,
  onConfirm,
}: DeleteJobDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete job post?</AlertDialogTitle>
          <AlertDialogDescription>
            {jobTitle
              ? `“${jobTitle}” will be permanently deleted. This action cannot be undone.`
              : 'This job post will be permanently deleted. This action cannot be undone.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
