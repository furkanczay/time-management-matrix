import Header from "@/components/header";
import { TodoProvider } from "@/contexts/todo-context";
import { DragDropProvider } from "@/contexts/drag-drop-context";
import { ListProvider } from "@/contexts/list-context";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ListProvider>
      <TodoProvider>
        <DragDropProvider>
          <Header />
          {children}
        </DragDropProvider>
      </TodoProvider>
    </ListProvider>
  );
}
