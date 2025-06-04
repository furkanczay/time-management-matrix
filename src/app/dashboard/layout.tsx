import Header from "@/components/header";
import { Toaster } from "sonner";
import { TodoProvider } from "@/contexts/todo-context";
import { DragDropProvider } from "@/contexts/drag-drop-context";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TodoProvider>
      <DragDropProvider>
        <Header />
        {children}
        <Toaster position="top-right" richColors />
      </DragDropProvider>
    </TodoProvider>
  );
}
