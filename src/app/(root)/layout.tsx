import { TodosProvider } from "@/context/todos-context";
import Header from "@/components/header";
import { Toaster } from "sonner";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <TodosProvider>{children}</TodosProvider>
      <Toaster position="top-right" richColors />
    </>
  );
}
