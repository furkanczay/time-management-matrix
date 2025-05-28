import { useTodos } from "@/hooks/use-todos";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import categories from "@/data/categories.json";
import { Checkbox } from "./ui/checkbox";
import DeleteDialog from "./delete-dialog";
import { cn } from "@/lib/utils";
import EditDialog from "./edit-dialog";
import { toast } from "sonner";

export default function Categories(){
    const { todos, setCompleteTodo } = useTodos();
    const handleChangeChecked = (id: string, value: boolean) => {
        setCompleteTodo(id, value)
        toast.success(value ? "Todo marked as complete" : "Todo marked as uncomplete")
    }
    return(
        <div className="grid grid-cols-2 gap-4">
            {categories.map((cat) => {
                const filteredTodos = todos.filter(x => x.category === String(cat.id));
                return (
                    <Card key={cat.id}>
                        <CardHeader>
                            <CardTitle>{cat.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {filteredTodos.length === 0 ? (
                                <div className="text-sm text-gray-500">No items found.</div>
                            ) : (
                                <ul className="space-y-3">
                                    {filteredTodos.map((item) => (
                                        <li className="flex justify-between items-center" key={item.id}>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    checked={item.completed}
                                                    onCheckedChange={(value) => handleChangeChecked(item.id, !!value)}
                                                    id={`checkbox-${item.id}`}
                                                />
                                                <label
                                                    htmlFor={`checkbox-${item.id}`}
                                                    className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", item.completed ? "line-through" : "")}
                                                >
                                                    {item.todo}
                                                </label>
                                            </div>
                                            <div className="inline-flex items-center gap-2">
                                                <EditDialog id={item.id} todo={item.todo} />
                                                <DeleteDialog id={item.id} todo={item.todo} />
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
    )
}