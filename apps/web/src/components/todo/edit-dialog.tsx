"use client";
import { Pen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import TodoForm from "./todo-form";
import { useState } from "react";
import { TodoItem } from "@/contexts/todo-context";

export default function EditDialog({
  id: _id,
  todo,
}: {
  id: string;
  todo: TodoItem;
}) {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Pen className="h-4 w-4 mr-2" />
          Edit
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Make changes to &ldquo;{todo.title}&rdquo;
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <TodoForm todo={todo} onSuccess={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
