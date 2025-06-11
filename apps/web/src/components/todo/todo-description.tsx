"use client";
import { Textarea } from "@/components/ui/textarea";
import { useState, useRef, useEffect } from "react";
import { useTodos } from "@/contexts/todo-context";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";

export default function TodoDescription({
  id,
  description,
}: {
  id: string;
  description?: string | null;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentDescription, setCurrentDescription] = useState(
    description || ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { updateTodo } = useTodos();

  // Focus textarea when editing starts
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      // Set cursor to end of text
      const len = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(len, len);
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (currentDescription === description) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    try {
      await updateTodo(id, { description: currentDescription });
      toast.success("Description updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update description:", error);
      toast.error("Failed to update description");
      // Reset to original value on error
      setCurrentDescription(description || "");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setCurrentDescription(description || "");
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleCancel();
    } else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleSave();
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-2">
        <Textarea
          ref={textareaRef}
          value={currentDescription}
          onChange={(e) => setCurrentDescription(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          placeholder="Add a description..."
          className="min-h-[100px] resize-none"
          disabled={isLoading}
        />
        <div className="text-xs text-gray-500">
          Press{" "}
          <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">
            Ctrl+Enter
          </kbd>{" "}
          to save,
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
        "group relative min-h-[60px] p-3 rounded-md border border-transparent hover:border-gray-200 cursor-pointer transition-all duration-200",
        !description && "text-gray-400 italic"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 whitespace-pre-wrap break-words">
          {description || "Click to add a description..."}
        </div>
        <Pencil className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2 flex-shrink-0" />
      </div>
    </div>
  );
}
