"use client";

import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useState } from "react";
import { toast } from "sonner";
import { useTodos } from "@/contexts/todo-context";

export default function DeleteDialog({
  id,
  todo,
  category,
  completed,
}: {
  id: string;
  todo: string;
  category: string;
  completed: boolean;
}) {
  const [open, setOpen] = useState(false);
  const { deleteTodo, createTodo } = useTodos();
  const handleClick = async () => {
    // Parse category to get isUrgent and isImportant values
    const isUrgent = category === "1" || category === "3";
    const isImportant = category === "1" || category === "2";

    const deletedTodo = {
      id,
      title: todo,
      completed: completed,
      isUrgent,
      isImportant,
    };

    try {
      await deleteTodo(id);
      setOpen(false);
      toast("Deleted successfully", {
        action: {
          label: "Undo",
          onClick: async () => {
            try {
              await createTodo({
                title: deletedTodo.title,
                isUrgent: deletedTodo.isUrgent,
                isImportant: deletedTodo.isImportant,
                isCompleted: deletedTodo.completed,
              });
              toast.success("Todo restored");
            } catch (error) {
              toast.error("Failed to restore todo");
            }
          },
        },
      });
    } catch (error) {
      toast.error("Failed to delete todo");
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"destructive"} size={"icon"}>
          <XIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Todo: {todo}</DialogTitle>
          <DialogDescription>Are you sure?</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"outline"}>Cancel</Button>
          </DialogClose>
          <Button onClick={handleClick} variant={"destructive"}>
            Yes, Delete it!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
