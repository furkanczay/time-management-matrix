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
import { useTodos } from "@/hooks/use-todos";
import { useState } from "react";
import { toast } from "sonner";

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
  const { deleteStorage, saveTodo } = useTodos();
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    const deletedTodo = {
      id,
      title: todo,
      completed: completed,
      quadrant: category,
    };
    deleteStorage(id);
    setOpen(false);
    toast("Deleted successfully", {
      action: {
        label: "Undo",
        onClick: () => {
          saveTodo(deletedTodo);
          toast.success("Todo restored");
        },
      },
    });
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
