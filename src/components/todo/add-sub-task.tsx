"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Plus, CheckCircle2, Circle, ListTodo, X, Trash2 } from "lucide-react";
import { useTodos } from "@/contexts/todo-context";
import { Subtask } from "@/generated/prisma";

export default function AddSubTask({
  id,
  subtasks,
}: {
  id: string;
  subtasks: Array<Subtask & { isCompleted: boolean }>;
}) {
  const [isAdd, setIsAdd] = useState(false);
  const [tempInput, setTempInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { updateTodoSubtasks } = useTodos();

  const handleAddSubtask = () => {
    setIsAdd(true);
  };

  const handleCancel = () => {
    setTempInput("");
    setIsAdd(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleBlur();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };
  const handleBlur = async () => {
    const trimmed = tempInput.trim();
    if (trimmed !== "") {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/subtasks`, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            title: trimmed,
            completed: false,
            parentId: id,
          }),
          credentials: "include",
        });
        if (response.ok) {
          const result = await response.json();
          // Update subtasks locally without full context refresh
          const newSubtask = {
            ...result,
            isCompleted: result.completed || false,
          }; // API returns subtask directly, not wrapped in data
          updateTodoSubtasks(id, [...subtasks, newSubtask]);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    }
    setTempInput("");
    setIsAdd(false);
  };
  const handleCheckToggle = async (subtaskId: string, value: boolean) => {
    try {
      const response = await fetch(`/api/subtasks/${subtaskId}`, {
        credentials: "include",
        method: "PUT",
        body: JSON.stringify({
          completed: value,
        }),
        headers: {
          "Content-type": "application/json",
        },
      });
      if (response.ok) {
        // Update subtasks locally without full context refresh
        const updatedSubtasks = subtasks.map((subtask) =>
          subtask.id === subtaskId
            ? { ...subtask, completed: value, isCompleted: value }
            : subtask
        );
        updateTodoSubtasks(id, updatedSubtasks);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const handleDeleteSubtask = async (subtaskId: string) => {
    try {
      const response = await fetch(`/api/subtasks/${subtaskId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        // Update subtasks locally without full context refresh
        const updatedSubtasks = subtasks.filter(
          (subtask) => subtask.id !== subtaskId
        );
        updateTodoSubtasks(id, updatedSubtasks);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const total = subtasks.length;
  const completed = subtasks?.filter((x) => x.completed).length;
  const progressValue = total > 0 ? (completed / total) * 100 : 0;
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
          <ListTodo className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Subtasks
        </h3>
        {total > 0 && (
          <Badge variant="secondary" className="ml-auto">
            {completed}/{total} completed
          </Badge>
        )}
      </div>
      {/* Progress Section */}
      {total > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Progress</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {Math.round(progressValue)}%
            </span>
          </div>
          <Progress value={progressValue} className="h-2" />
        </div>
      )}
      {/* Add Subtask Section */}
      <div className="space-y-4">
        {isAdd ? (
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Input
                type="text"
                value={tempInput}
                onChange={(e) => setTempInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter subtask title..."
                disabled={isLoading}
                autoFocus
                className="flex-1"
              />
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={handleBlur}
                  disabled={isLoading || !tempInput.trim()}
                  className="px-3"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="px-3"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Press Enter to save, Escape to cancel
            </div>
          </div>
        ) : (
          <Button
            onClick={handleAddSubtask}
            variant="outline"
            className="w-full justify-center gap-2 h-11 border-dashed border-2 hover:border-solid hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Subtask
          </Button>
        )}
      </div>{" "}
      {/* Subtasks List */}
      {subtasks.length > 0 && (
        <div className="space-y-3">
          {subtasks.map((item) => (
            <div
              key={item.id}
              className={cn(
                "group flex items-center gap-3 p-4 rounded-xl border transition-all hover:shadow-sm",
                item.completed
                  ? "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800"
                  : "bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              )}
            >
              <Checkbox
                checked={item.completed}
                onCheckedChange={(value) => handleCheckToggle(item.id, !!value)}
                className="mt-0.5"
              />
              <div className="flex-1 flex items-center gap-3">
                {item.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                )}
                <span
                  className={cn(
                    "flex-1 text-sm font-medium transition-all",
                    item.completed
                      ? "line-through text-gray-500 dark:text-gray-400"
                      : "text-gray-900 dark:text-white"
                  )}
                >
                  {item.title}
                </span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDeleteSubtask(item.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 h-auto hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}{" "}
      {/* Empty State */}
      {subtasks.length === 0 && !isAdd && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <ListTodo className="w-8 h-8 mx-auto mb-3 opacity-50" />
          <p className="text-sm">
            No subtasks yet. Add one to break down this task.
          </p>
        </div>
      )}
    </div>
  );
}
