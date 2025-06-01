import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import TodoForm from "./todo-form";
import { useState } from "react";

export default function NewDialog({ catId }: { catId: string }) {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"link"}
          className="border border-dotted opacity-50 w-full"
        >
          <Plus /> Add New Item
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Todo</DialogTitle>
        </DialogHeader>
        <div>
          <TodoForm initCategory={catId} onSuccess={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
