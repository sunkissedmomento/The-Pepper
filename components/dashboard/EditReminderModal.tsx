// components/dashboard/EditReminderModal.tsx
"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";

// simple local Modal component to avoid missing module import
function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose} />
      <div className="bg-white rounded p-6 z-10 max-w-lg w-full">{children}</div>
    </div>
  );
}

import { createClient } from "@/lib/supabase/client";
import { toast } from "react-hot-toast";

export function EditReminderModal({ reminder, open, onClose, onSaved }: any) {
  const supabase = createClient();
  const [title, setTitle] = useState(reminder.title);
  const [message, setMessage] = useState(reminder.message);

  const save = async () => {
    const { error } = await supabase
      .from("reminders")
      .update({ title, message })
      .eq("id", reminder.id);

    if (error) return toast.error("Failed to update reminder");
    toast.success("Reminder updated");
    onSaved();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">Edit Reminder</h2>

      <input
        className="w-full border p-2 rounded mb-3"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="w-full border p-2 rounded mb-3"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <Button onClick={save} className="w-full">
        Save Changes
      </Button>
    </Modal>
  );
}
