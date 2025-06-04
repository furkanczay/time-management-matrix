"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export default function FixOrderButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleFixOrder = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/tasks/fix-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Order values fixed for ${data.updatedCount} tasks`);
        // Refresh the page to see changes
        window.location.reload();
      } else {
        toast.error("Failed to fix order values");
      }
    } catch (error) {
      console.error("Error fixing order:", error);
      toast.error("Error fixing order values");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleFixOrder}
      disabled={isLoading}
    >
      {isLoading ? "Fixing..." : "Fix Order"}
    </Button>
  );
}
