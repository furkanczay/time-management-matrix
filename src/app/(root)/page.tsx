"use client";
import Categories from "@/components/categories";
import TodoForm from "@/components/todo/todo-form";
import { Button } from "@/components/ui/button";
import { Grid, List } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [show, setShow] = useState<"matrix" | "list">("matrix");
  return (
    <div>
      <h1 className="text-2xl font-bold">Todo with Quadrant</h1>
      <div className="flex items-center justify-between">
        <TodoForm />
        <div>
          <Button
            onClick={() => setShow("matrix")}
            variant={show === "matrix" ? "default" : "ghost"}
          >
            <Grid />
          </Button>
          <Button
            onClick={() => setShow("list")}
            variant={show === "list" ? "default" : "ghost"}
          >
            <List />
          </Button>
        </div>
      </div>
      <Categories show={show} />
    </div>
  );
}
