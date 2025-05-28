import { useTodos } from "@/hooks/use-todos";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import categories from "@/data/categories.json";
import { Checkbox } from "./ui/checkbox";
import DeleteDialog from "./delete-dialog";
import { cn } from "@/lib/utils";
import EditDialog from "./edit-dialog";
import { toast } from "sonner";
import { useState } from "react";
import { Move, Plus } from "lucide-react";
import { Button } from "./ui/button";
import NewDialog from "./new-dialog";

export default function Categories() {
  const { todos, setCompleteTodo, moveTodo } = useTodos();
  const [draggedTodoId, setDraggedTodoId] = useState<string | null>(null);
  const handleChangeChecked = (id: string, value: boolean) => {
    setCompleteTodo(id, value);
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    categoryId: string
  ) => {
    e.preventDefault();
    if (draggedTodoId) {
      moveTodo(draggedTodoId, categoryId);
      setDraggedTodoId(null);
    }
  };
  return (
    <div className="grid grid-cols-2 gap-4">
      {categories.map((cat) => {
        const filteredTodos = todos.filter(
          (x) => x.category === String(cat.id)
        );
        return (
          <Card
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, String(cat.id))}
            key={cat.id}
          >
            <CardHeader>
              <CardTitle>{cat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredTodos.length === 0 ? (
                <NewDialog catId={String(cat.id)} />
              ) : (
                <ul className="space-y-3">
                  {filteredTodos.map((item) => (
                    <li
                      className={cn(
                        "flex justify-between items-center cursor-grab",
                        draggedTodoId === item.id ? "opacity-50" : ""
                      )}
                      draggable
                      onDragStart={() => setDraggedTodoId(item.id)}
                      onDragEnd={() => setDraggedTodoId(null)}
                      title="Hold on move"
                      key={item.id}
                    >
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={item.completed}
                          onCheckedChange={(value) =>
                            handleChangeChecked(item.id, !!value)
                          }
                          id={`checkbox-${item.id}`}
                        />
                        <label
                          htmlFor={`checkbox-${item.id}`}
                          className={cn(
                            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                            item.completed ? "line-through" : ""
                          )}
                        >
                          {item.todo}
                        </label>
                      </div>
                      <div className="inline-flex items-center gap-2">
                        <EditDialog id={item.id} todo={item.todo} />
                        <DeleteDialog
                          id={item.id}
                          todo={item.todo}
                          category={item.category}
                          completed={item.completed}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
