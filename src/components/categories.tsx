"use client";
import { useTodos, calculateQuadrant } from "@/contexts/todo-context";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import SingleTodo from "./todo/single-todo";
import NewDialog from "./todo/new-dialog";
import { useState } from "react";
import { Button } from "./ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { isToday } from "date-fns";

interface CategoriesProps {
  show: "matrix" | "list";
  sortBy?: "order" | "dueDate";
  sortOrder?: "asc" | "desc";
  filterToday?: boolean;
}

// Quadrant definitions - no need for external JSON file
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

// Droppable quadrant wrapper component
function DroppableQuadrant({
  quadrant,
  children,
  className,
}: {
  quadrant: { id: string; title: string; description: string };
  children: React.ReactNode;
  className?: string;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: `quadrant-${quadrant.id}`,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        className,
        isOver && "ring-2 ring-blue-500 ring-opacity-50"
      )}
    >
      {children}
    </div>
  );
}

export default function Categories({
  show,
  sortBy = "order",
  sortOrder = "asc",
  filterToday = false,
}: CategoriesProps) {
  const { todos, loading, error } = useTodos();
  const [expandedQuadrants, setExpandedQuadrants] = useState<
    Record<string, boolean>
  >({
    "1": true,
    "2": true,
    "3": true,
    "4": true,
  });

  const toggleQuadrant = (quadrantId: string) => {
    setExpandedQuadrants((prev) => ({
      ...prev,
      [quadrantId]: !prev[quadrantId],
    }));
  };

  const INITIAL_SHOW_COUNT = 5; // Show first 5 tasks by default

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
          const filteredTodos = todos
            .filter((todo) => {
              // Basic quadrant filtering
              const todoQuadrant = calculateQuadrant(
                todo.isUrgent,
                todo.isImportant
              );

              // Apply today's date filter if enabled
              if (filterToday && todo.dueDate) {
                const dueDate = new Date(todo.dueDate);
                return todoQuadrant === quadrant.id && isToday(dueDate);
              }

              return todoQuadrant === quadrant.id;
            })
            .sort((a, b) => {
              // First sort by completion status (incomplete tasks first)
              if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
              }

              // Then sort by the selected sort field
              if (sortBy === "dueDate") {
                // Handle null/undefined due dates
                if (!a.dueDate && !b.dueDate) return 0;
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;

                const aDate = new Date(a.dueDate);
                const bDate = new Date(b.dueDate);
                return sortOrder === "asc"
                  ? aDate.getTime() - bDate.getTime()
                  : bDate.getTime() - aDate.getTime();
              } else {
                // Default order sorting
                return sortOrder === "asc"
                  ? a.order - b.order
                  : b.order - a.order;
              }
            });

          const isExpanded = expandedQuadrants[quadrant.id];
          const hasMoreTasks = filteredTodos.length > INITIAL_SHOW_COUNT;
          const displayedTodos = isExpanded
            ? filteredTodos
            : filteredTodos.slice(0, INITIAL_SHOW_COUNT); // Determine minimum height based on content
          const minHeight =
            filteredTodos.length === 0 ? "min-h-[500px]" : "min-h-[400px]";

          return (
            <DroppableQuadrant key={quadrant.id} quadrant={quadrant}>
              <Card
                className={cn(
                  "flex flex-col matrix-card-transition",
                  minHeight
                )}
              >
                <CardHeader className="flex-shrink-0 pb-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {quadrant.title}
                      </CardTitle>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm text-gray-500">
                          {quadrant.description}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {filteredTodos.length} task
                          {filteredTodos.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                    {hasMoreTasks && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleQuadrant(quadrant.id)}
                        className="ml-2 flex items-center gap-1 hover:bg-gray-100"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="h-4 w-4" />
                            <span className="hidden sm:inline text-xs">
                              Less
                            </span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4" />
                            <span className="hidden sm:inline text-xs">
                              More
                            </span>
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col p-4">
                  {" "}
                  <div
                    className={cn(
                      "flex-1 transition-all duration-300 ease-in-out",
                      isExpanded
                        ? "max-h-[450px] overflow-y-auto scrollbar-thin"
                        : "max-h-none overflow-visible"
                    )}
                  >
                    {" "}
                    <div className="space-y-3">
                      <SortableContext
                        items={displayedTodos.map((todo) => todo.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {displayedTodos.length > 0 ? (
                          displayedTodos.map((todo, index) => (
                            <div
                              key={todo.id}
                              className={cn(
                                "transition-all duration-200",
                                index >= INITIAL_SHOW_COUNT &&
                                  !isExpanded &&
                                  "hidden"
                              )}
                            >
                              <SingleTodo todo={todo} />
                            </div>
                          ))
                        ) : (
                          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-full p-6 mb-6 shadow-sm">
                              <svg
                                className="w-10 h-10 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                                />
                              </svg>
                            </div>
                            <h3 className="text-base font-semibold text-gray-700 mb-2">
                              No tasks yet
                            </h3>
                            <p className="text-sm text-gray-500 max-w-[240px] leading-relaxed">
                              This quadrant is empty. Add your first task to
                              start organizing your time effectively.
                            </p>
                          </div>
                        )}
                      </SortableContext>
                    </div>
                    {!isExpanded && hasMoreTasks && (
                      <div className="text-center py-3 mt-3 border-t border-dashed border-gray-200">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleQuadrant(quadrant.id)}
                          className="text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                        >
                          <ChevronDown className="h-4 w-4 mr-1" />
                          {filteredTodos.length - INITIAL_SHOW_COUNT} more task
                          {filteredTodos.length - INITIAL_SHOW_COUNT !== 1
                            ? "s"
                            : ""}
                        </Button>
                      </div>
                    )}
                  </div>{" "}
                  <div className="mt-4 pt-4 border-t border-gray-100 flex-shrink-0">
                    <NewDialog catId={quadrant.id} />
                  </div>
                </CardContent>
              </Card>
            </DroppableQuadrant>
          );
        })}
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">All Todos</h2>{" "}
      <div className="space-y-2">
        {todos
          .filter((todo) => {
            // Apply today's date filter if enabled
            if (filterToday && todo.dueDate) {
              return isToday(new Date(todo.dueDate));
            }
            return true;
          })
          .sort((a, b) => {
            // First sort by completion status (incomplete tasks first)
            if (a.completed !== b.completed) {
              return a.completed ? 1 : -1;
            }

            // Then sort by the selected sort field
            if (sortBy === "dueDate") {
              // Handle null/undefined due dates
              if (!a.dueDate && !b.dueDate) return 0;
              if (!a.dueDate) return 1;
              if (!b.dueDate) return -1;

              const aDate = new Date(a.dueDate);
              const bDate = new Date(b.dueDate);
              return sortOrder === "asc"
                ? aDate.getTime() - bDate.getTime()
                : bDate.getTime() - aDate.getTime();
            } else {
              // Default order sorting
              return sortOrder === "asc"
                ? a.order - b.order
                : b.order - a.order;
            }
          })
          .map((todo) => (
            <SingleTodo key={todo.id} todo={todo} />
          ))}
      </div>
    </div>
  );
}
