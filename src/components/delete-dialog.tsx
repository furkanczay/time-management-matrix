import { XIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useTodos } from "@/hooks/use-todos";
import { useState } from "react";
import { toast } from "sonner";

export default function DeleteDialog({ id, todo }: { id: string; todo: string; }){
    const { deleteStorage } = useTodos();
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        deleteStorage(id);
        setOpen(false);
        toast.success("Deleted");
    }
    return(
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={"destructive"} size={"icon"}><XIcon /></Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Todo: {todo}</DialogTitle>
                    <DialogDescription>
                        Are you sure?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant={"outline"}>Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleClick} variant={"destructive"}>Yes, Delete it!</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}