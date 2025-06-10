"use client";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import TodoForm from "./todo-form";
import { useState, ReactNode } from "react";

interface NewDialogProps {
  catId?: string;
  children?: ReactNode;
  triggerClassName?: string;
  showTrigger?: boolean;
}

export default function NewDialog({
  catId,
  children,
  triggerClassName = "p-0 border border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 group flex-shrink-0",
  showTrigger = true,
}: NewDialogProps) {
  const [open, setOpen] = useState<boolean>(false);

  // Get category title for display
  const getCategoryTitle = (id: string) => {
    const categories = {
      "1": "Important & Urgent",
      "2": "Important & Not Urgent",
      "3": "Not Important & Urgent",
      "4": "Not Important & Not Urgent",
    };
    return categories[id as keyof typeof categories] || "Unknown Category";
  };

  const defaultTrigger = (
    <Button variant="ghost" className={triggerClassName}>
      <Plus className="h-3 w-3 text-gray-400 group-hover:text-gray-600" />
      Add Task
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (showTrigger ? defaultTrigger : null)}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            {catId
              ? `Add a new task to ${getCategoryTitle(catId)} category`
              : "Add a new task to your matrix"}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <TodoForm initCategory={catId} onSuccess={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
