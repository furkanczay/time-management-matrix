const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const API_BASE = `${API_BASE_URL}/api/tasks`;

export async function fetchTodos(params?: Record<string, string>) {
  const url = new URL("/api/tasks", API_BASE_URL);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  const response = await fetch(url.toString(), {
    credentials: "include", // Include cookies for authentication
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function createTodoAPI(data: {
  title: string;
  description?: string | null;
  dueDate?: string | null;
  isUrgent?: boolean;
  isImportant?: boolean;
  isCompleted?: boolean;
  listId?: string | null;
}) {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      ...data,
      isUrgent: data.isUrgent ?? false,
      isImportant: data.isImportant ?? false,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function updateTodoAPI(
  id: string,
  data: {
    title?: string;
    description?: string | null;
    dueDate?: string | null;
    isUrgent?: boolean;
    isImportant?: boolean;
    completed?: boolean;
    order?: number;
    listId?: string | null;
  }
) {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function deleteTodoAPI(id: string) {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function toggleTodoCompleteAPI(id: string) {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PATCH",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
