"use client";
import { GripVertical, Calendar } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import DeleteDialog from "./delete-dialog";
import { cn } from "@/lib/utils";
import EditDialog from "./edit-dialog";
import { Card } from "@/components/ui/card";
import TodoDetail from "./todo-detail";
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
    // Overdue - red background
    return {
      cardClass: "border-red-500 bg-red-50 dark:bg-red-950/20",
      dateClass: "text-red-600 dark:text-red-400 font-medium",
      prefix: "Overdue: ",
    };
  } else if (daysUntilDue === 0) {
    // Due today - red background
    return {
      cardClass: "border-red-500 bg-red-50 dark:bg-red-950/20",
      dateClass: "text-red-600 dark:text-red-400 font-medium",
      prefix: "Due today: ",
    };
  } else if (daysUntilDue === 1) {
    // Due tomorrow - red background
    return {
      cardClass: "border-red-500 bg-red-50 dark:bg-red-950/20",
      dateClass: "text-red-600 dark:text-red-400 font-medium",
      prefix: "Due tomorrow: ",
    };
  } else if (daysUntilDue <= 3) {
    // Due in 2-3 days - yellow background
    return {
      cardClass: "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20",
      dateClass: "text-yellow-600 dark:text-yellow-400 font-medium",
      prefix: `Due in ${daysUntilDue} days: `,
    };
  }

  return {
    cardClass: "",
    dateClass: "text-muted-foreground",
    prefix: "",
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
        "flex flex-row items-center justify-between gap-4 p-3 shadow-sm border transition-all",
        dueDateUrgency?.cardClass,
        isCompleted && "opacity-60",
        isDragging && "opacity-50 z-50"
      )}
    >
      <div className="flex items-center gap-2 w-full">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab text-muted-foreground p-1 hover:text-gray-600 active:cursor-grabbing"
          title="Drag to move"
        >
          <GripVertical />
        </div>{" "}
        <Checkbox
          checked={isCompleted}
          onCheckedChange={(value) => handleChangeChecked(todo.id, !!value)}
          id={`checkbox-${todo.id}`}
        />{" "}
        <div className="flex flex-col items-start gap-1 flex-1">
          <TodoDetail
            todo={todo}
            triggerClassname={cn(
              "text-sm font-medium leading-none hover:underline cursor-pointer",
              isCompleted ? "line-through text-muted-foreground" : ""
            )}
          />
        </div>{" "}
        <div className="flex items-center gap-2">
          {todo.subtasks && todo.subtasks.length > 0 && (
            <div
              className={cn(
                "text-xs px-2 py-1 rounded-full",
                todo.subtasks.filter((subtask) => subtask.isCompleted)
                  .length === todo.subtasks.length
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {todo.subtasks.filter((subtask) => subtask.isCompleted).length}/
              {todo.subtasks.length}
            </div>
          )}
          {todo.dueDate && (
            <div
              className={cn(
                "flex items-center gap-1 text-xs",
                dueDateUrgency?.dateClass || "text-muted-foreground"
              )}
            >
              <Calendar className="h-3 w-3" />
              <span>
                {dueDateUrgency?.prefix}
                {format(new Date(todo.dueDate), "MMM dd")}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <EditDialog id={todo.id} todo={todo} />
        <DeleteDialog
          id={todo.id}
          todo={title}
          category={quadrant}
          completed={isCompleted}
        />
      </div>
    </Card>
  );
}
