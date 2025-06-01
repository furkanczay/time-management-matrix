import { GripVertical } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import DeleteDialog from "./delete-dialog";
import { cn } from "@/lib/utils";
import EditDialog from "./edit-dialog";
import { useTodos } from "@/hooks/use-todos";
import { Card } from "@/components/ui/card";
import TodoDetail from "./todo-detail";

export default function SingleTodo({
  id,
  draggedTodoId,
  setDraggedTodoId,
}: {
  id: string;
  draggedTodoId?: string | null;
  setDraggedTodoId?: (id?: string | null) => void;
}) {
  const { setCompleteTodo, todos } = useTodos();
  const todoItem = todos.find((t) => t.id === id);
  const handleChangeChecked = (id: string, value: boolean) => {
    setCompleteTodo(id, value);
  };
  if (!todoItem) return null;
  const { title, completed, quadrant } = todoItem;
  return (
    <Card
      className={cn(
        "flex flex-row items-center justify-between gap-4 p-3 shadow-sm border transition-all",
        draggedTodoId === id
          ? "opacity-50 border-dashed border-2 border-primary"
          : "hover:shadow-md"
      )}
    >
      <div className="flex items-center gap-2 w-full">
        <div
          draggable
          onDragStart={() => setDraggedTodoId && setDraggedTodoId(id)}
          onDragEnd={() => setDraggedTodoId && setDraggedTodoId(null)}
          className="cursor-grab text-muted-foreground p-1"
          title="Drag to move"
        >
          <GripVertical />
        </div>
        <Checkbox
          checked={completed}
          onCheckedChange={(value) => handleChangeChecked(id, !!value)}
          id={`checkbox-${id}`}
        />
        <TodoDetail
          id={id}
          triggerClassname={cn(
            "text-sm font-medium leading-none hover:underline cursor-pointer",
            completed ? "line-through text-muted-foreground" : ""
          )}
        />
      </div>
      <div className="flex items-center gap-2">
        <EditDialog id={id} todo={title} />
        <DeleteDialog
          id={id}
          todo={title}
          category={quadrant}
          completed={completed}
        />
      </div>
    </Card>
  );
}
