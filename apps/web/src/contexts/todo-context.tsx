"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import {
  createTodoAPI,
  updateTodoAPI,
  deleteTodoAPI,
  toggleTodoCompleteAPI,
} from "@/lib/api/client";

// Define local types for the web app
export interface Task {
  id: string;
  title: string;
  description?: string | null;
  isUrgent: boolean;
  isImportant: boolean;
  completed: boolean;
  dueDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  order: number;
  listId?: string | null;
  creatorId: string;
}

export interface Subtask {
  id: string;
  title: string;
  parentId: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Extended Task type with isCompleted field
export interface TodoItem extends Task {
  isCompleted: boolean;
  list?: {
    id: string;
    title: string;
    color?: string;
    description?: string;
  } | null;
  subtasks?: Array<Subtask & { isCompleted: boolean }>;
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

interface CreateTodoData {
  title: string;
  description?: string | null;
  dueDate?: string | null;
  isUrgent?: boolean;
  isImportant?: boolean;
  isCompleted?: boolean;
  listId?: string | null;
}

interface UpdateTodoData {
  title?: string;
  description?: string | null;
  dueDate?: string | null;
  isUrgent?: boolean;
  isImportant?: boolean;
  listId?: string | null;
  completed?: boolean;
  order?: number;
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
  createTodo: (data: CreateTodoData) => Promise<void>;
  updateTodo: (id: string, data: UpdateTodoData) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
  updateTodoSubtasks: (
    todoId: string,
    subtasks: Array<Subtask & { isCompleted: boolean }>
  ) => void;
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
  const refreshTodos = useCallback(
    async (options?: {
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
          options?.filterToday !== undefined
            ? options.filterToday
            : filterToday;

        // Update state if options are provided
        if (options?.sortBy) setSortBy(options.sortBy);
        if (options?.sortOrder) setSortOrder(options.sortOrder);
        if (options?.filterToday !== undefined)
          setFilterToday(options.filterToday);

        // Build query string
        const params = new URLSearchParams();
        if (searchTerm) params.append("search", searchTerm);
        if (sortByValue !== "order") params.append("sortBy", sortByValue);
        if (sortOrderValue !== "asc")
          params.append("sortOrder", sortOrderValue);
        if (filterTodayValue) params.append("filterToday", "true");
        const queryString = params.toString();
        const apiBaseUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
        const url = `${apiBaseUrl}/api/tasks${queryString ? `?${queryString}` : ""}`;
        const response = await fetch(url, {
          credentials: "include", // Include cookies for authentication
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          // API returns todos with quadrant and isCompleted fields
          setTodos(data.data as TodoItem[]);
        } else {
          throw new Error(data.error || "Failed to fetch todos");
        }
      } catch (err) {
        setError("Failed to fetch todos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [searchTerm, sortBy, sortOrder, filterToday]
  );

  useEffect(() => {
    if (initialTodos.length === 0) {
      refreshTodos();
    }
  }, [initialTodos.length, refreshTodos]);
  const createTodo = async (data: CreateTodoData) => {
    try {
      setError(null);
      const response = await createTodoAPI(data);
      if (response.success) {
        // API returns todo with quadrant and isCompleted fields
        setTodos((prev) => [...prev, response.data as TodoItem]);
      } else {
        throw new Error(response.error || "Failed to create todo");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create todo";
      setError(errorMessage);
      console.error(err);
      throw err;
    }
  };
  const updateTodo = async (id: string, data: UpdateTodoData) => {
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
        throw new Error(response.error || "Failed to update todo");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update todo";
      setError(errorMessage);
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
        throw new Error(response.error || "Failed to delete todo");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete todo";
      setError(errorMessage);
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
        throw new Error(response.error || "Failed to toggle todo completion");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to toggle todo completion";
      setError(errorMessage);
      console.error(err);
      throw err;
    }
  };
  // Update subtasks for a specific todo without refreshing entire context
  const updateTodoSubtasks = (
    todoId: string,
    subtasks: Array<Subtask & { isCompleted: boolean }>
  ) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === todoId
          ? {
              ...todo,
              subtasks: subtasks.map(
                (subtask: Subtask & { isCompleted: boolean }) => ({
                  ...subtask,
                  isCompleted:
                    subtask.completed || subtask.isCompleted || false,
                })
              ),
            }
          : todo
      )
    );
  };

  // Refresh todos when search term, sort options, or filter options change
  useEffect(() => {
    refreshTodos();
  }, [searchTerm, sortBy, sortOrder, filterToday, refreshTodos]);
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
    updateTodoSubtasks,
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
