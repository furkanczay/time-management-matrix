import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import TodoDescription from "./todo-description";
import AddSubTask from "./add-sub-task";
import { Check, XIcon } from "lucide-react";
import categories from "@/data/categories.json";
import { useEffect, useState } from "react";
import { useTodos } from "@/hooks/use-todos";

export default function TodoDetail({
  id,
  triggerClassname,
}: {
  id: string;
  triggerClassname?: string;
}) {
  const { todos } = useTodos();

  const data = todos.find((todo) => todo.id === id);
  const [subtasks, setSubtasks] = useState<
    {
      id: string;
      title: string;
      completed: boolean;
      parentId: string;
    }[]
  >([]);

  useEffect(() => {
    async function getSubtasks() {
      const response = await fetch(`/api/tasks/${id}/subtasks`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .catch((e) => console.log(e));
      console.log(response);

      setSubtasks(response);
    }
    getSubtasks();
  }, [id]);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="link" className={cn("", triggerClassname)}>
          {data?.title}
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-5xl">
        <SheetHeader>
          <SheetTitle>{data?.title}</SheetTitle>
          <SheetDescription>
            <TodoDescription id={id} description={data?.description} />
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 p-4">
          <div className="inline-flex items-center gap-2">
            Category:{" "}
            {categories.find((cat) => String(cat.id) === data?.quadrant)?.title}
          </div>
          <div className="inline-flex items-center gap-2">
            Completed: {data?.completed ? <Check /> : <XIcon />}
          </div>
          <AddSubTask id={id} subtasks={subtasks ?? []} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
