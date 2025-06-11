"use client";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useTodos, TodoItem, calculateQuadrant } from "@/contexts/todo-context";
import { ListSelector } from "@/components/list-selector";
import { toast } from "sonner";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

// Quadrant options for the form
const QUADRANT_OPTIONS = [
  { id: "1", title: "Important & Urgent" },
  { id: "2", title: "Important & Not Urgent" },
  { id: "3", title: "Not Important & Urgent" },
  { id: "4", title: "Not Important & Not Urgent" },
];

const formSchema = z.object({
  todo: z
    .string()
    .min(1, {
      message: "Todo field is required",
    })
    .max(50),
  category: z.string().min(1, {
    message: "Category field is required",
  }),
  dueDate: z.date().optional(),
  completed: z.boolean().optional(),
  listId: z.string().nullable().optional(),
});
export default function TodoForm({
  todo,
  onSuccess,
  initCategory,
}: {
  todo?: TodoItem;
  initCategory?: string;
  onSuccess?: () => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      todo: todo?.title ? todo.title : "",
      completed: todo?.isCompleted ? todo.isCompleted : false,
      category: initCategory
        ? initCategory
        : todo
          ? calculateQuadrant(todo.isUrgent, todo.isImportant)
          : "",
      dueDate: todo?.dueDate ? new Date(todo.dueDate) : undefined,
      listId: todo?.listId || null,
    },
  });
  const { createTodo, updateTodo } = useTodos();
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Parse category to get isUrgent and isImportant values
      const isUrgent = values.category === "1" || values.category === "3";
      const isImportant = values.category === "1" || values.category === "2";
      if (todo?.id) {
        await updateTodo(todo.id, {
          title: values.todo,
          description: null,
          isUrgent,
          isImportant,
          dueDate: values.dueDate ? values.dueDate.toISOString() : null,
          listId: values.listId || null,
        });
        toast.success("Todo updated successfully!");
      } else {
        await createTodo({
          title: values.todo,
          description: null,
          isUrgent,
          isImportant,
          isCompleted: false,
          dueDate: values.dueDate ? values.dueDate.toISOString() : null,
          listId: values.listId || null,
        });
        toast.success("Todo created successfully!");
      }

      form.reset({
        todo: "",
        category: initCategory || "",
        dueDate: undefined,
        listId: null,
      });

      if (onSuccess) onSuccess();
    } catch (_error) {
      toast.error("An error occurred. Please try again.");
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Todo Input */}
        <FormField
          control={form.control}
          name="todo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter your task..." {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        {/* Category and Due Date in row for new todos, column for edit */}
        <div
          className={cn(
            "grid gap-4",
            todo?.id ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
          )}
        >
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  disabled={!!initCategory}
                  key={field.value}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {QUADRANT_OPTIONS.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />{" "}
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date (Optional)</FormLabel>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "flex-1 pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a due date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {field.value && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => field.onChange(undefined)}
                      className="px-3"
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* List Selector */}
        <FormField
          control={form.control}
          name="listId"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ListSelector value={field.value} onChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" className="w-full md:w-auto">
            {todo?.id ? "Update Task" : "Create Task"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
