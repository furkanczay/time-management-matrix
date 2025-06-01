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
import categories from "@/data/categories.json";
import { useTodos } from "@/hooks/use-todos";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
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
  completed: z.boolean().optional(),
});
export default function TodoForm({
  id,
  onSuccess,
  initCategory,
}: {
  id?: string;
  initCategory?: string;
  onSuccess?: () => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      todo: "",
      category: initCategory ? initCategory : "",
    },
  });
  useEffect(() => {
    if (id) {
      async function getData() {
        const data = await fetch(`/api/tasks/${id}`, {
          credentials: "include",
        })
          .then((res) => res.json())
          .catch((e) => console.log(e));
        form.setValue("todo", data.title);
        form.setValue("category", data.quadrant);
      }
      getData();
    }
  }, []);
  const { saveTodo, updateTodo } = useTodos();
  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (id) {
      updateTodo(id, {
        title: values.todo,
        quadrant: values.category,
      });
    } else {
      saveTodo({
        title: values.todo,
        quadrant: values.category,
      });
    }
    form.reset({
      todo: "",
      category: "",
    });
    form.setValue("category", "");
    if (onSuccess) onSuccess();
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div
          className={cn(
            "flex items-center gap-2",
            id ? "flex-col" : "flex-row"
          )}
        >
          <FormField
            control={form.control}
            name="todo"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Todo" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
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
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {cat.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <Button type="submit" variant={"outline"}>
            {id || initCategory ? "Save Changes" : "+"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
