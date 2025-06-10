"use client";

import { useTodos, calculateQuadrant, TodoItem } from "@/contexts/todo-context";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import SingleTodo from "./todo/single-todo";
import NewDialog from "./todo/new-dialog";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  ChevronDown,
  ChevronUp,
  FolderOpen,
  List as ListIcon,
} from "lucide-react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { isToday } from "date-fns";

interface CategoriesWithListsProps {
  show: "matrix" | "list";
  sortBy?: "order" | "dueDate";
  sortOrder?: "asc" | "desc";
  filterToday?: boolean;
  filterList?: string;
}

// Quadrant definitions
const QUADRANTS = [
  {
    id: "1",
    title: "Important & Urgent",
    description: "Do First",
  },
  {
    id: "2",
    title: "Important & Not Urgent",
    description: "Schedule",
  },
  {
    id: "3",
    title: "Not Important & Urgent",
    description: "Delegate",
  },
  {
    id: "4",
    title: "Not Important & Not Urgent",
    description: "Eliminate",
  },
];

// Group todos by list
function groupTodosByList(todos: TodoItem[]) {
  const grouped: {
    [key: string]: {
      list: { id: string; title: string; color: string; description?: string };
      todos: TodoItem[];
    };
  } = {};

  todos.forEach((todo) => {
    const listId = todo.listId || "ungrouped";
    if (!grouped[listId]) {
      grouped[listId] = {
        list: todo.list
          ? {
              ...todo.list,
              color: todo.list.color || "#6b7280",
            }
          : {
              id: "ungrouped",
              title: "Gruplanmamış",
              color: "#6b7280",
            },
        todos: [],
      };
    }
    grouped[listId].todos.push(todo);
  });

  return grouped;
}

// Droppable quadrant wrapper component
function DroppableQuadrant({
  quadrant,
  children,
}: {
  quadrant: string;
  children: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({
    id: `quadrant-${quadrant}`,
  });

  return (
    <div ref={setNodeRef} className="h-full">
      {children}
    </div>
  );
}

function ListSection({
  listData,
  isCollapsed,
  onToggleCollapse,
  sortBy,
  sortOrder,
}: {
  listData: {
    list: { id: string; title: string; color: string; description?: string };
    todos: TodoItem[];
  };
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  sortBy?: "order" | "dueDate";
  sortOrder?: "asc" | "desc";
}) {
  const { list, todos } = listData;

  const sortedTodos = [...todos].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }

    if (sortBy === "dueDate") {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;

      const aDate = new Date(a.dueDate).getTime();
      const bDate = new Date(b.dueDate).getTime();
      return sortOrder === "desc" ? bDate - aDate : aDate - bDate;
    } else {
      return sortOrder === "desc" ? b.order - a.order : a.order - b.order;
    }
  });

  return (
    <div className="mb-4">
      <div
        className="flex items-center gap-2 p-2 rounded-lg border bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
        onClick={onToggleCollapse}
      >
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: list.color }}
        />
        {list.id === "ungrouped" ? (
          <ListIcon className="w-4 h-4 text-muted-foreground" />
        ) : (
          <FolderOpen className="w-4 h-4 text-muted-foreground" />
        )}
        <span className="font-medium text-sm">{list.title}</span>
        <span className="text-xs text-muted-foreground">({todos.length})</span>
        <div className="ml-auto">
          {isCollapsed ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronUp className="w-4 h-4" />
          )}
        </div>
      </div>

      {!isCollapsed && (
        <div className="mt-2 space-y-2 ml-4">
          <SortableContext
            items={sortedTodos.map((todo) => todo.id)}
            strategy={verticalListSortingStrategy}
          >
            {sortedTodos.map((todo) => (
              <SingleTodo key={todo.id} todo={todo} />
            ))}
          </SortableContext>
        </div>
      )}
    </div>
  );
}

export default function CategoriesWithLists({
  show,
  sortBy = "order",
  sortOrder = "asc",
  filterToday = false,
  filterList,
}: CategoriesWithListsProps) {
  const { todos, loading, error } = useTodos();
  const [collapsedQuadrants, setCollapsedQuadrants] = useState<string[]>([]);
  const [collapsedLists, setCollapsedLists] = useState<string[]>([]);

  const toggleQuadrantCollapse = (quadrantId: string) => {
    setCollapsedQuadrants((prev) =>
      prev.includes(quadrantId)
        ? prev.filter((id) => id !== quadrantId)
        : [...prev, quadrantId]
    );
  };

  const toggleListCollapse = (listId: string, quadrantId: string) => {
    const key = `${quadrantId}-${listId}`;
    setCollapsedLists((prev) =>
      prev.includes(key) ? prev.filter((id) => id !== key) : [...prev, key]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading todos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center text-red-600">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  if (show === "matrix") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        {QUADRANTS.map((quadrant) => {
          const filteredTodos = todos.filter((todo) => {
            const todoQuadrant = calculateQuadrant(
              todo.isUrgent,
              todo.isImportant
            );

            // Apply quadrant filter
            if (todoQuadrant !== quadrant.id) return false;

            // Apply today filter
            if (filterToday && todo.dueDate) {
              const dueDate = new Date(todo.dueDate);
              if (!isToday(dueDate)) return false;
            }

            // Apply list filter
            if (filterList) {
              if (filterList === "ungrouped") {
                return !todo.listId;
              } else {
                return todo.listId === filterList;
              }
            }

            return true;
          });

          const groupedTodos = groupTodosByList(filteredTodos);
          const isCollapsed = collapsedQuadrants.includes(quadrant.id);

          return (
            <DroppableQuadrant key={quadrant.id} quadrant={quadrant.id}>
              <Card className="h-full flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {quadrant.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {quadrant.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <NewDialog catId={quadrant.id} />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleQuadrantCollapse(quadrant.id)}
                      >
                        {isCollapsed ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronUp className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto">
                  {!isCollapsed && (
                    <div className="space-y-4">
                      {Object.entries(groupedTodos)
                        .sort(([a], [b]) => {
                          // Sort ungrouped first, then by list title
                          if (a === "ungrouped") return -1;
                          if (b === "ungrouped") return 1;
                          return groupedTodos[a].list.title.localeCompare(
                            groupedTodos[b].list.title
                          );
                        })
                        .map(([listId, listData]) => (
                          <ListSection
                            key={listId}
                            listData={listData}
                            isCollapsed={collapsedLists.includes(
                              `${quadrant.id}-${listId}`
                            )}
                            onToggleCollapse={() =>
                              toggleListCollapse(listId, quadrant.id)
                            }
                            sortBy={sortBy}
                            sortOrder={sortOrder}
                          />
                        ))}
                      {Object.keys(groupedTodos).length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No tasks in this quadrant
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </DroppableQuadrant>
          );
        })}
      </div>
    );
  }
  const allGroupedTodos = groupTodosByList(
    todos.filter((todo) => {
      if (filterToday && todo.dueDate) {
        const dueDate = new Date(todo.dueDate);
        if (!isToday(dueDate)) return false;
      }

      if (filterList) {
        if (filterList === "ungrouped") {
          return !todo.listId;
        } else {
          return todo.listId === filterList;
        }
      }

      return true;
    })
  );

  return (
    <div className="space-y-6">
      {Object.entries(allGroupedTodos)
        .sort(([a], [b]) => {
          if (a === "ungrouped") return -1;
          if (b === "ungrouped") return 1;
          return allGroupedTodos[a].list.title.localeCompare(
            allGroupedTodos[b].list.title
          );
        })
        .map(([listId, listData]) => (
          <Card key={listId}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: listData.list.color }}
                  />
                  <div>
                    <CardTitle className="text-lg">
                      {listData.list.title}
                    </CardTitle>
                    {listData.list.description && (
                      <p className="text-sm text-muted-foreground">
                        {listData.list.description}
                      </p>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({listData.todos.length} tasks)
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleListCollapse(listId, "list-view")}
                >
                  {collapsedLists.includes(`list-view-${listId}`) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronUp className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            {!collapsedLists.includes(`list-view-${listId}`) && (
              <CardContent>
                <div className="space-y-2">
                  <SortableContext
                    items={listData.todos.map((todo) => todo.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {listData.todos
                      .sort((a, b) => {
                        // Sort logic here
                        if (a.completed !== b.completed) {
                          return a.completed ? 1 : -1;
                        }

                        if (sortBy === "dueDate") {
                          if (!a.dueDate && !b.dueDate) return 0;
                          if (!a.dueDate) return 1;
                          if (!b.dueDate) return -1;

                          const aDate = new Date(a.dueDate).getTime();
                          const bDate = new Date(b.dueDate).getTime();
                          return sortOrder === "desc"
                            ? bDate - aDate
                            : aDate - bDate;
                        } else {
                          return sortOrder === "desc"
                            ? b.order - a.order
                            : a.order - b.order;
                        }
                      })
                      .map((todo) => (
                        <SingleTodo key={todo.id} todo={todo} />
                      ))}
                  </SortableContext>
                </div>
                {listData.todos.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No tasks in this list
                  </p>
                )}
              </CardContent>
            )}
          </Card>
        ))}

      {Object.keys(allGroupedTodos).length === 0 && (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              No tasks found. Create your first task to get started!
            </p>
          </CardContent>
        </Card>
      )}

      <div className="fixed bottom-6 right-6">
        <NewDialog catId="1" />
      </div>
    </div>
  );
}
