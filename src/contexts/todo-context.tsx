"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Task } from "@/generated/prisma";
import {
  createTodoAPI,
  updateTodoAPI,
  deleteTodoAPI,
  toggleTodoCompleteAPI,
} from "@/lib/api/client";

// Extended Task type with isCompleted field
export interface TodoItem extends Task {
  isCompleted: boolean;
}

// Helper function to calculate quadrant from isUrgent and isImportant
export function calculateQuadrant(
  isUrgent: boolean,
  isImportant: boolean
): string {
  if (isUrgent && isImportant) {
    return "1"; // Urgent & Important
  }
  if (!isUrgent && isImportant) {
    return "2"; // Important & Not Urgent
  }
  if (isUrgent && !isImportant) {
    return "3"; // Urgent & Not Important
  }
  return "4"; // Neither Urgent nor Important
}

interface TodoContextType {
  todos: TodoItem[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: "order" | "dueDate" | "createdAt";
  sortOrder: "asc" | "desc";
  filterToday: boolean;
  setSortBy: (value: "order" | "dueDate" | "createdAt") => void;
  setSortOrder: (value: "asc" | "desc") => void;
  setFilterToday: (value: boolean) => void;
  refreshTodos: (options?: {
    sortBy?: "order" | "dueDate" | "createdAt";
    sortOrder?: "asc" | "desc";
    filterToday?: boolean;
  }) => Promise<void>;
  createTodo: (data: any) => Promise<void>;
  updateTodo: (id: string, data: any) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export function TodoProvider({
  children,
  initialTodos = [],
}: {
  children: ReactNode;
  initialTodos?: TodoItem[];
}) {
  const [todos, setTodos] = useState<TodoItem[]>(initialTodos);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"order" | "dueDate" | "createdAt">(
    "order"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterToday, setFilterToday] = useState(false);

  // Initial data loading
  useEffect(() => {
    if (initialTodos.length === 0) {
      refreshTodos();
    }
  }, []);

  const refreshTodos = async (options?: {
    sortBy?: "order" | "dueDate" | "createdAt";
    sortOrder?: "asc" | "desc";
    filterToday?: boolean;
  }) => {
    try {
      setLoading(true);
      setError(null);

      // Use provided options or fall back to state values
      const sortByValue = options?.sortBy || sortBy;
      const sortOrderValue = options?.sortOrder || sortOrder;
      const filterTodayValue =
        options?.filterToday !== undefined ? options.filterToday : filterToday;

      // Update state if options are provided
      if (options?.sortBy) setSortBy(options.sortBy);
      if (options?.sortOrder) setSortOrder(options.sortOrder);
      if (options?.filterToday !== undefined)
        setFilterToday(options.filterToday);

      // Build query string
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (sortByValue !== "order") params.append("sortBy", sortByValue);
      if (sortOrderValue !== "asc") params.append("sortOrder", sortOrderValue);
      if (filterTodayValue) params.append("filterToday", "true");

      const queryString = params.toString();
      const url = `/api/tasks${queryString ? `?${queryString}` : ""}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        // API returns todos with quadrant and isCompleted fields
        setTodos(data.data as TodoItem[]);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setError("Failed to fetch todos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const createTodo = async (data: any) => {
    try {
      setError(null);
      const response = await createTodoAPI(data);
      if (response.success) {
        // API returns todo with quadrant and isCompleted fields
        setTodos((prev) => [...prev, response.data as TodoItem]);
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      setError("Failed to create todo");
      console.error(err);
      throw err;
    }
  };
  const updateTodo = async (id: string, data: any) => {
    try {
      setError(null);
      const response = await updateTodoAPI(id, data);
      if (response.success) {
        // API returns updated todo with quadrant and isCompleted fields
        setTodos((prev) =>
          prev.map((todo) =>
            todo.id === id ? ({ ...todo, ...response.data } as TodoItem) : todo
          )
        );
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      setError("Failed to update todo");
      console.error(err);
      throw err;
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      setError(null);
      const response = await deleteTodoAPI(id);
      if (response.success) {
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      setError("Failed to delete todo");
      console.error(err);
      throw err;
    }
  };
  const toggleComplete = async (id: string) => {
    try {
      setError(null);
      const response = await toggleTodoCompleteAPI(id);
      if (response.success) {
        // API returns updated todo with quadrant and isCompleted fields
        setTodos((prev) =>
          prev.map((todo) =>
            todo.id === id
              ? {
                  ...todo,
                  isCompleted: response.data.isCompleted,
                  completed: response.data.completed,
                }
              : todo
          )
        );
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      setError("Failed to toggle todo completion");
      console.error(err);
      throw err;
    }
  };
  // Refresh todos when search term, sort options, or filter options change
  useEffect(() => {
    refreshTodos();
  }, [searchTerm, sortBy, sortOrder, filterToday]);
  const value: TodoContextType = {
    todos,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    sortBy,
    sortOrder,
    filterToday,
    setSortBy,
    setSortOrder,
    setFilterToday,
    refreshTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

export function useTodos() {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error("useTodos must be used within a TodoProvider");
  }
  return context;
}
