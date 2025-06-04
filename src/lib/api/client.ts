const API_BASE = "/api/tasks";

export async function fetchTodos(params?: Record<string, string>) {
  const url = new URL(API_BASE, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  const response = await fetch(url.toString());
  return response.json();
}

export async function createTodoAPI(data: {
  title: string;
  description?: string | null;
  dueDate?: string | null;
  isUrgent?: boolean;
  isImportant?: boolean;
}) {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

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
  }
) {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
}

export async function deleteTodoAPI(id: string) {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });

  return response.json();
}

export async function toggleTodoCompleteAPI(id: string) {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PATCH",
  });

  return response.json();
}
