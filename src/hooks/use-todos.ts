import { TodosContext } from "@/context/todos-context";
import { useContext } from "react";

export function useTodos() {
  const context = useContext(TodosContext);
  if (!context) {
    throw new Error("useTodos must be used within a TodosProvider");
  }
  return context;
}
