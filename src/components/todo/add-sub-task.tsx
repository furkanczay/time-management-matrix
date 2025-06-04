"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type Subtask = {
  id: string;
  title: string;
  completed: boolean;
  parentId: string;
};

export default function AddSubTask({
  id,
  subtasks,
}: {
  id: string;
  subtasks: Subtask[];
}) {
  const [stateTasks, setStateTasks] = useState<Subtask[]>([...subtasks]);
  const [isAdd, setIsAdd] = useState(false);
  const [tempInput, setTempInput] = useState("");

  const handleAddSubtask = () => {
    setIsAdd(true);
  };

  const handleBlur = async () => {
    const trimmed = tempInput.trim();
    if (trimmed !== "") {
      const response = await fetch(`/api/subtasks`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          title: trimmed,
          completed: false,
          parentId: id,
        }),
        credentials: "include",
      })
        .then((res) => res.json())
        .catch((e) => console.log(e));
      setStateTasks((prev) => [...prev, response]);
    }
    setTempInput("");
    setIsAdd(false);
  };

  const handleCheckToggle = async (id: string, value: boolean) => {
    const response = await fetch(`/api/subtasks/${id}`, {
      credentials: "include",
      method: "PUT",
      body: JSON.stringify({
        completed: value,
      }),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .catch((e) => console.log(e));
    setStateTasks((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: response.completed } : item
      )
    );
  };

  const total = stateTasks.length;
  const completed = stateTasks?.filter((x) => x.completed).length;
  const progressValue = total > 0 ? (completed / total) * 100 : 0;
  return (
    <div>
      <div>
        {isAdd ? (
          <div>
            <Input
              type="text"
              value={tempInput}
              onChange={(e) => setTempInput(e.target.value)}
              onBlur={handleBlur}
              autoFocus
            />
          </div>
        ) : (
          <Button
            className="cursor-pointer"
            onClick={handleAddSubtask}
            variant={"outline"}
          >
            + Add Sub Task
          </Button>
        )}
      </div>
      <div className="my-2 space-y-4">
        {stateTasks.length > 0 && (
          <>
            <h1>Subtasks</h1>
            <Progress value={progressValue} />
          </>
        )}
      </div>
      {stateTasks.length > 0 && (
        <ul className="mt-2">
          {stateTasks.map((item, idx) => (
            <li key={idx}>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={item.completed}
                  onCheckedChange={(value) =>
                    handleCheckToggle(item.id, !!value)
                  }
                />
                <span
                  className={cn(
                    "",
                    item.completed ? "line-through opacity-50" : ""
                  )}
                >
                  {item.title}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
