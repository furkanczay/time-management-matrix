import { Grid, List, Loader2 } from "lucide-react";
import Categories from "./components/categories";
import TodoForm from "./components/todo-form";
import { Toaster } from "./components/ui/sonner";
import { TodosProvider } from "./context/todos-context";
import { authClient } from "./lib/auth-client";
import AuthWrapper from "./components/auth-wrapper";
import Header from "./components/header";
import { useState } from "react";
import { Button } from "./components/ui/button";

function App() {
  const { data: session, isPending } = authClient.useSession();
  const [show, setShow] = useState<"matrix" | "list">("matrix");
  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="animate-spin w-4 h-4" />
      </div>
    );
  }
  return (
    <>
      {session ? (
        <TodosProvider>
          <div className="container mx-auto space-y-4">
            <Header name={session?.user.name} isAuth={!!session} />
            <h1 className="text-2xl font-bold">Todo with Quadrant</h1>
            <div className="flex items-center justify-between">
              <TodoForm />
              <div>
                <Button
                  onClick={() => setShow("matrix")}
                  variant={show === "matrix" ? "default" : "ghost"}
                >
                  <Grid />
                </Button>
                <Button
                  onClick={() => setShow("list")}
                  variant={show === "list" ? "default" : "ghost"}
                >
                  <List />
                </Button>
              </div>
            </div>
            <Categories show={show} />
          </div>
        </TodosProvider>
      ) : (
        <AuthWrapper />
      )}
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;
