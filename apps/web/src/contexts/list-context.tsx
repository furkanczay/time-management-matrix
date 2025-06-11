"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface List {
  id: string;
  title: string;
  description?: string;
  color?: string;
  order: number;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    tasks: number;
  };
}

interface ListContextType {
  lists: List[];
  loading: boolean;
  createList: (data: {
    title: string;
    description?: string;
    color?: string;
  }) => Promise<void>;
  updateList: (
    id: string,
    data: { title?: string; description?: string; color?: string }
  ) => Promise<void>;
  deleteList: (id: string) => Promise<void>;
  refreshLists: () => Promise<void>;
}

const ListContext = createContext<ListContextType | undefined>(undefined);

export function ListProvider({ children }: { children: React.ReactNode }) {
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(false);
  const fetchLists = async () => {
    try {
      setLoading(true);
      const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const response = await fetch(`${apiBaseUrl}/api/lists`, {
        credentials: "include", // Include cookies for authentication
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setLists(data.data);
      } else {
        throw new Error(data.error || "Failed to fetch lists");
      }
    } catch (error) {
      console.error("Error fetching lists:", error);
    } finally {
      setLoading(false);
    }
  };
  const createList = async (data: {
    title: string;
    description?: string;
    color?: string;
  }) => {
    try {
      const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const response = await fetch(`${apiBaseUrl}/api/lists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setLists((prev) => [...prev, result.data]);
        } else {
          throw new Error(result.error);
        }
      } else {
        throw new Error("Failed to create list");
      }
    } catch (error) {
      console.error("Error creating list:", error);
      throw error;
    }
  };
  const updateList = async (
    id: string,
    data: { title?: string; description?: string; color?: string }
  ) => {
    try {
      const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const response = await fetch(`${apiBaseUrl}/api/lists/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setLists((prev) =>
            prev.map((list) => (list.id === id ? result.data : list))
          );
        } else {
          throw new Error(result.error);
        }
      } else {
        throw new Error("Failed to update list");
      }
    } catch (error) {
      console.error("Error updating list:", error);
      throw error;
    }
  };
  const deleteList = async (id: string) => {
    try {
      const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const response = await fetch(`${apiBaseUrl}/api/lists/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setLists((prev) => prev.filter((list) => list.id !== id));
        } else {
          throw new Error(result.error);
        }
      } else {
        throw new Error("Failed to delete list");
      }
    } catch (error) {
      console.error("Error deleting list:", error);
      throw error;
    }
  };

  const refreshLists = async () => {
    await fetchLists();
  };

  useEffect(() => {
    fetchLists();
  }, []);

  return (
    <ListContext.Provider
      value={{
        lists,
        loading,
        createList,
        updateList,
        deleteList,
        refreshLists,
      }}
    >
      {children}
    </ListContext.Provider>
  );
}

export function useList() {
  const context = useContext(ListContext);
  if (context === undefined) {
    throw new Error("useList must be used within a ListProvider");
  }
  return context;
}
