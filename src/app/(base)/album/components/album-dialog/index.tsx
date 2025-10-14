"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BookingTimeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BookingTimeFormDialog({
  open,
  onOpenChange,
}: BookingTimeFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-y-auto max-w-md">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-lg font-medium">
            Create album
          </DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
