"use client";
import { useTodos } from "@/hooks/use-todos";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import categories from "@/data/categories.json";

import { useState } from "react";
import NewDialog from "./todo/new-dialog";
import SingleTodo from "@/components/todo/single-todo";
import { cn } from "@/lib/utils";

export default function Categories({ show }: { show: string }) {
  const { todos, moveTodo } = useTodos();
  const [draggedTodoId, setDraggedTodoId] = useState<string | null>(null);

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
    <div
      className={cn(
        "grid gap-4",
        show === "matrix" ? "grid-cols-2" : "grid-cols-1"
      )}
    >
      {categories.map((cat) => {
        const filteredTodos = todos.filter(
          (x) => x.quadrant === String(cat.id)
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
                <div className="space-y-3">
                  {filteredTodos.map((item) => (
                    <SingleTodo
                      key={item.id}
                      id={item.id}
                      draggedTodoId={draggedTodoId}
                      setDraggedTodoId={(id) => setDraggedTodoId(id ?? null)}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
