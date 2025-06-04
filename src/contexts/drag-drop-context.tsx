"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import { ReactNode, useState } from "react";
import { useTodos, TodoItem, calculateQuadrant } from "./todo-context";
import SingleTodo from "@/components/todo/single-todo";
import { toast } from "sonner";

interface DragDropProviderProps {
  children: ReactNode;
}

export function DragDropProvider({ children }: DragDropProviderProps) {
  const { todos, updateTodo, refreshTodos } = useTodos();
  const [_activeId, setActiveId] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<TodoItem | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);

    // Find the active todo item
    const activeTodo = todos.find((todo) => todo.id === active.id);
    setActiveItem(activeTodo || null);
  };
  const handleDragOver = (_event: DragOverEvent) => {
    // This will be used for real-time visual feedback
    // We'll implement this if needed for better UX
  };
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);
    setActiveItem(null);

    if (!over) {
      console.log("No drop target found");
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    console.log("Drag end - Active:", activeId, "Over:", overId);

    // If dropping on a quadrant container
    if (overId.startsWith("quadrant-")) {
      const targetQuadrant = overId.replace("quadrant-", "");
      const activeTodo = todos.find((todo) => todo.id === activeId);

      if (!activeTodo) {
        console.log("Active todo not found");
        return;
      }

      const currentQuadrant = calculateQuadrant(
        activeTodo.isUrgent,
        activeTodo.isImportant
      );

      console.log(
        "Moving from quadrant",
        currentQuadrant,
        "to",
        targetQuadrant
      );

      // If moving to a different quadrant
      if (currentQuadrant !== targetQuadrant) {
        try {
          // Convert quadrant to isUrgent and isImportant values
          const { isUrgent, isImportant } = getQuadrantFlags(targetQuadrant);

          console.log("Updating todo with:", { isUrgent, isImportant });
          await updateTodo(activeId, {
            isUrgent,
            isImportant,
          });

          // Refresh to get updated data
          await refreshTodos();

          toast.success("Task moved to new quadrant!");
        } catch (error) {
          console.error("Failed to move task:", error);
          toast.error("Failed to move task");
        }
      }
      return;
    }

    // If dropping on another todo (for reordering within same quadrant)
    if (activeId !== overId) {
      const activeTodo = todos.find((todo) => todo.id === activeId);
      const overTodo = todos.find((todo) => todo.id === overId);

      if (!activeTodo || !overTodo) {
        console.log("Active or over todo not found");
        return;
      }

      const activeQuadrant = calculateQuadrant(
        activeTodo.isUrgent,
        activeTodo.isImportant
      );
      const overQuadrant = calculateQuadrant(
        overTodo.isUrgent,
        overTodo.isImportant
      );

      console.log(
        "Reordering - Active quadrant:",
        activeQuadrant,
        "Over quadrant:",
        overQuadrant
      );

      // Only allow reordering within the same quadrant
      if (activeQuadrant === overQuadrant) {
        try {
          // Get todos in the same quadrant, sorted by order
          const quadrantTodos = todos
            .filter((todo) => {
              const todoQuadrant = calculateQuadrant(
                todo.isUrgent,
                todo.isImportant
              );
              return todoQuadrant === activeQuadrant;
            })
            .sort((a, b) => a.order - b.order);

          // Find the indices
          const activeIndex = quadrantTodos.findIndex(
            (todo) => todo.id === activeId
          );
          const overIndex = quadrantTodos.findIndex(
            (todo) => todo.id === overId
          );

          if (activeIndex === -1 || overIndex === -1) {
            console.log(
              "Indices not found - activeIndex:",
              activeIndex,
              "overIndex:",
              overIndex
            );
            return;
          }

          console.log("Reordering from index", activeIndex, "to", overIndex);

          // Create new order
          const reorderedTodos = [...quadrantTodos];
          const [movedTodo] = reorderedTodos.splice(activeIndex, 1);
          reorderedTodos.splice(overIndex, 0, movedTodo);

          // Update order values for all affected todos
          const updates = reorderedTodos.map((todo, index) => ({
            id: todo.id,
            order: index,
          }));

          console.log("Order updates:", updates); // Update in parallel
          await Promise.all(
            updates.map(({ id, order }) => updateTodo(id, { order }))
          );

          // Refresh to get updated data
          await refreshTodos();

          toast.success("Tasks reordered!");
        } catch (error) {
          console.error("Failed to reorder tasks:", error);
          toast.error("Failed to reorder tasks");
        }
      } else {
        console.log("Cannot reorder between different quadrants");
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {children}
      <DragOverlay
        dropAnimation={{
          sideEffects: defaultDropAnimationSideEffects({
            styles: {
              active: {
                opacity: "0.5",
              },
            },
          }),
        }}
      >
        {activeItem ? (
          <div className="opacity-80 rotate-3 transform scale-105">
            <SingleTodo todo={activeItem} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

// Helper function to convert quadrant to isUrgent and isImportant flags
function getQuadrantFlags(quadrant: string): {
  isUrgent: boolean;
  isImportant: boolean;
} {
  switch (quadrant) {
    case "1":
      return { isUrgent: true, isImportant: true };
    case "2":
      return { isUrgent: false, isImportant: true };
    case "3":
      return { isUrgent: true, isImportant: false };
    case "4":
      return { isUrgent: false, isImportant: false };
    default:
      return { isUrgent: false, isImportant: false };
  }
}
