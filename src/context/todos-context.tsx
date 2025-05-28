import { createContext, useEffect, useState } from "react";

type Todo = {
  id: string;
  todo: string;
  category: string;
  completed: boolean;
};

type TodoInput = {
  id?: string;
  todo: string;
  category: string;
  completed?: boolean;
};

type TodosContextType = {
  todos: Todo[];
  saveOrUpdate: (data: TodoInput) => void;
  deleteStorage: (id: string) => void;
  setCompleteTodo: (id: string, checked: boolean) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  moveTodo: (id: string, newCategory: string) => void;
};

export const TodosContext = createContext<TodosContextType | undefined>(
  undefined
);

export function TodosProvider({ children }: { children: React.ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("todos");
    if (stored) {
      setTodos(JSON.parse(stored));
    }
  }, []);

  const saveOrUpdate = (data: TodoInput) => {
    let updatedTodos: Todo[];

    if (data.id) {
      // update
      updatedTodos = todos.map((t) =>
        t.id === data.id
          ? {
              ...t,
              todo: data.todo,
              category: data.category,
              completed: data.completed ?? false,
            }
          : t
      );
    } else {
      // new
      const newTodo: Todo = {
        id: crypto.randomUUID(),
        todo: data.todo,
        category: data.category,
        completed: data.completed ?? false,
      };
      updatedTodos = [...todos, newTodo];
    }

    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  const deleteStorage = (id: string) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  const setCompleteTodo = (id: string, checked: boolean) => {
    const updatedTodos = todos.map((t) =>
      t.id === id
        ? {
            ...t,
            completed: checked,
          }
        : t
    );

    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  const moveTodo = (id: string, newCategory: string) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, category: newCategory } : todo
    );
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  return (
    <TodosContext.Provider
      value={{
        todos,
        saveOrUpdate,
        setTodos,
        deleteStorage,
        setCompleteTodo,
        moveTodo,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
}
