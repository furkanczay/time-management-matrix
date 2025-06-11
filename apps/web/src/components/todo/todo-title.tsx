"use client";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect } from "react";
import { useTodos } from "@/contexts/todo-context";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";

export default function TodoTitle({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(title || "");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { updateTodo } = useTodos();

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      // Select all text
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = async () => {
    const trimmedTitle = currentTitle.trim();

    if (!trimmedTitle) {
      toast.error("Title cannot be empty");
      setCurrentTitle(title);
      setIsEditing(false);
      return;
    }

    if (trimmedTitle === title) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    try {
      await updateTodo(id, { title: trimmedTitle });
      toast.success("Title updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update title:", error);
      toast.error("Failed to update title");
      // Reset to original value on error
      setCurrentTitle(title);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setCurrentTitle(title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleCancel();
    } else if (e.key === "Enter") {
      handleSave();
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-2">
        <Input
          ref={inputRef}
          value={currentTitle}
          onChange={(e) => setCurrentTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="text-3xl font-bold h-auto py-2 border-2 border-blue-300 focus:border-blue-500"
          disabled={isLoading}
          maxLength={100}
        />
        <div className="text-xs text-gray-500">
          Press{" "}
          <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Enter</kbd>{" "}
          to save,{" "}
          <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs ml-1">
            Esc
          </kbd>{" "}
          to cancel
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className={cn(
        "group relative cursor-pointer transition-all duration-200 rounded-md p-2 -m-2 hover:bg-gray-50 dark:hover:bg-gray-800/50",
        "text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent leading-tight"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="flex-1">{title}</span>
        <Pencil className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2 flex-shrink-0" />
      </div>
    </div>
  );
}
