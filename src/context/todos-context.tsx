"use client";
import { createContext, useEffect, useState } from "react";

type Todo = {
  id: string;
  title: string;
  quadrant: string;
  completed: boolean;
  description?: string | null;
  subtasks?: {
    id?: string;
    todo?: string;
    completed?: boolean;
  }[];
};

type TodoInput = {
  title: string;
  quadrant: string;
  completed?: boolean | null;
};

type TodosContextType = {
  todos: Todo[];
  saveTodo: (data: TodoInput) => void;
  deleteStorage: (id: string) => void;
  setCompleteTodo: (id: string, checked: boolean) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  moveTodo: (id: string, newCategory: string) => void;
  updateTodo: (id: string, data: TodoInput) => void;
};

export const TodosContext = createContext<TodosContextType | undefined>(
  undefined
);

export function TodosProvider({ children }: { children: React.ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    async function getData() {
      const response = await fetch("/api/tasks", {
        credentials: "include",
      })
        .then((res) => res.json())
        .catch((e) => console.log(e));
      setTodos(response);
    }
    getData();
  }, []);

  const saveTodo = async (data: {
    id?: string | null;
    title: string;
    quadrant: string;
    completed?: boolean | null;
  }) => {
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        id: data.id ?? undefined,
        title: data.title,
        quadrant: data.quadrant,
        completed: data.completed ?? false,
      }),
    })
      .then((res) => res.json())
      .catch((e) => console.log(e));

    setTodos((prev) => [...prev, response]);
  };

  const updateTodo = async (
    id: string,
    data: { title: string; quadrant: string; description?: string | null }
  ) => {
    const response = await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .catch((e) => console.log(e));

    console.log(response);

    const updatedTodos = todos.map((todo) =>
      todo.id === id
        ? {
            ...todo,
            ...response,
          }
        : todo
    );

    setTodos(updatedTodos);
  };

  const deleteStorage = async (id: string) => {
    await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => res.json())
      .catch((e) => console.log(e));
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  };

  const setCompleteTodo = async (id: string, checked: boolean) => {
    await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        completed: checked,
      }),
      credentials: "include",
    })
      .then((res) => res.json())
      .catch((e) => console.log(e));
    const updatedTodos = todos.map((t) =>
      t.id === id
        ? {
            ...t,
            completed: checked,
          }
        : t
    );

    setTodos(updatedTodos);
  };

  const moveTodo = async (id: string, newCategory: string) => {
    await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        quadrant: newCategory,
      }),
      credentials: "include",
    })
      .then((res) => res.json())
      .catch((e) => console.log(e));

    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, quadrant: newCategory } : todo
    );
    setTodos(updatedTodos);
  };

  return (
    <TodosContext.Provider
      value={{
        todos,
        saveTodo,
        setTodos,
        deleteStorage,
        setCompleteTodo,
        moveTodo,
        updateTodo,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
}
