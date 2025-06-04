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
import { useState } from "react";

export default function NewDialog({ catId }: { catId: string }) {
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-full h-10 border border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 group"
        >
          <Plus className="h-4 w-4 text-gray-400 group-hover:text-gray-600 mr-2" />
          <span className="text-sm text-gray-500 group-hover:text-gray-700 font-medium">
            Add Task
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Add a new task to {getCategoryTitle(catId)} category
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <TodoForm initCategory={catId} onSuccess={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
