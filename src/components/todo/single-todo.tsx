"use client";
import { GripVertical, Calendar, MoreVertical } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import DeleteDialog from "./delete-dialog";
import { cn } from "@/lib/utils";
import EditDialog from "./edit-dialog";
import { Card } from "@/components/ui/card";
import TodoDetail from "./todo-detail";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTodos, TodoItem, calculateQuadrant } from "@/contexts/todo-context";
import { toast } from "sonner";
import { format, differenceInDays } from "date-fns";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Helper function to get due date urgency styling
const getDueDateUrgency = (dueDate: Date | null | string) => {
  if (!dueDate) return null;

  const today = new Date();
  const due = new Date(dueDate);
  const daysUntilDue = differenceInDays(due, today);
  if (daysUntilDue < 0) {
    // Overdue - red styling
    return {
      cardClass:
        "border-red-200 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/20 shadow-red-100 dark:shadow-red-900/20",
      dateClass: "text-red-600 dark:text-red-400 font-semibold",
      prefix: "🔴 Overdue: ",
    };
  } else if (daysUntilDue === 0) {
    // Due today - urgent styling
    return {
      cardClass:
        "border-orange-200 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/20 shadow-orange-100 dark:shadow-orange-900/20",
      dateClass: "text-orange-600 dark:text-orange-400 font-semibold",
      prefix: "⚡ Due today: ",
    };
  } else if (daysUntilDue === 1) {
    // Due tomorrow - warning styling
    return {
      cardClass:
        "border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/20 shadow-amber-100 dark:shadow-amber-900/20",
      dateClass: "text-amber-600 dark:text-amber-400 font-medium",
      prefix: "📅 Due tomorrow: ",
    };
  } else if (daysUntilDue <= 3) {
    // Due in 2-3 days - caution styling
    return {
      cardClass:
        "border-yellow-200 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-950/30 dark:to-yellow-900/20 shadow-yellow-100 dark:shadow-yellow-900/20",
      dateClass: "text-yellow-600 dark:text-yellow-400 font-medium",
      prefix: `⏰ Due in ${daysUntilDue} days: `,
    };
  }

  return {
    cardClass:
      "border-border/50 bg-gradient-to-r from-card to-card/95 hover:shadow-md",
    dateClass: "text-muted-foreground",
    prefix: "📅 ",
  };
};

export default function SingleTodo({ todo }: { todo: TodoItem }) {
  const { toggleComplete } = useTodos();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleChangeChecked = async (id: string, value: boolean) => {
    try {
      await toggleComplete(id);
      toast.success(value ? "Task completed!" : "Task marked as pending");
    } catch (_error) {
      toast.error("Failed to update task");
    }
  };

  const { title, isCompleted, isUrgent, isImportant } = todo;
  const quadrant = calculateQuadrant(isUrgent, isImportant);
  const dueDateUrgency = getDueDateUrgency(todo.dueDate);
  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative flex flex-row items-center justify-between gap-3 p-4 shadow-sm border-0 transition-all duration-200 hover-lift hover:shadow-lg rounded-xl backdrop-blur-sm",
        dueDateUrgency?.cardClass,
        isCompleted && "opacity-60 scale-95",
        isDragging && "opacity-30 z-50 rotate-2 scale-105 shadow-xl"
      )}
    >
      {/* Priority Indicator Bar */}
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-1 rounded-l-xl transition-all duration-200",
          quadrant === "1" && "bg-gradient-to-b from-red-500 to-red-600",
          quadrant === "2" && "bg-gradient-to-b from-amber-500 to-amber-600",
          quadrant === "3" && "bg-gradient-to-b from-blue-500 to-blue-600",
          quadrant === "4" && "bg-gradient-to-b from-gray-400 to-gray-500"
        )}
      />

      <div className="flex items-center gap-3 w-full pl-2">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab text-muted-foreground p-1.5 hover:text-foreground hover:bg-muted/50 rounded-lg transition-all duration-200 active:cursor-grabbing group-hover:scale-110"
          title="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </div>

        <Checkbox
          checked={isCompleted}
          onCheckedChange={(value) => handleChangeChecked(todo.id, !!value)}
          id={`checkbox-${todo.id}`}
          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary h-5 w-5 rounded-md transition-all duration-200"
        />
        <div className="flex flex-col items-start gap-1.5 flex-1 min-w-0">
          <TodoDetail
            todo={todo}
            triggerClassname={cn(
              "text-sm font-semibold leading-relaxed hover:text-primary cursor-pointer transition-colors duration-200 truncate",
              isCompleted
                ? "line-through text-muted-foreground"
                : "text-foreground"
            )}
          />

          {/* List indicator */}
          {todo.list && (
            <div className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-full ring-1 ring-white/20"
                style={{ backgroundColor: todo.list.color }}
              />
              <span className="text-xs text-muted-foreground font-medium truncate">
                {todo.list.title}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Subtask Progress */}
          {todo.subtasks && todo.subtasks.length > 0 && (
            <div
              className={cn(
                "flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all duration-200",
                todo.subtasks.filter((subtask) => subtask.isCompleted)
                  .length === todo.subtasks.length
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 ring-1 ring-green-200 dark:ring-green-800"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              )}
            >
              <div className="flex items-center gap-1">
                <span>
                  {
                    todo.subtasks.filter((subtask) => subtask.isCompleted)
                      .length
                  }
                </span>
                <span>/</span>
                <span>{todo.subtasks.length}</span>
              </div>
            </div>
          )}

          {/* Due Date */}
          {todo.dueDate && (
            <div
              className={cn(
                "flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all duration-200",
                dueDateUrgency?.dateClass || "text-muted-foreground",
                dueDateUrgency?.cardClass.includes("red") &&
                  "bg-red-50 dark:bg-red-950/20",
                dueDateUrgency?.cardClass.includes("orange") &&
                  "bg-orange-50 dark:bg-orange-950/20",
                dueDateUrgency?.cardClass.includes("amber") &&
                  "bg-amber-50 dark:bg-amber-950/20",
                dueDateUrgency?.cardClass.includes("yellow") &&
                  "bg-yellow-50 dark:bg-yellow-950/20",
                !dueDateUrgency?.cardClass.includes("red") &&
                  !dueDateUrgency?.cardClass.includes("orange") &&
                  !dueDateUrgency?.cardClass.includes("amber") &&
                  !dueDateUrgency?.cardClass.includes("yellow") &&
                  "bg-muted/30"
              )}
            >
              <Calendar className="h-3 w-3" />
              <span>{format(new Date(todo.dueDate), "MMM dd")}</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-2 hover:bg-muted/50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100">
            <MoreVertical className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-40 border border-border/50 shadow-lg"
        >
          <EditDialog id={todo.id} todo={todo} />
          <DeleteDialog
            id={todo.id}
            todo={title}
            category={quadrant}
            completed={isCompleted}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </Card>
  );
}
