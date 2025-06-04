"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface BackgroundCellProps {
  className?: string;
  containerClassName?: string;
  patternClassName?: string;
}

export function BackgroundCells({
  className,
  containerClassName,
  patternClassName,
}: BackgroundCellProps) {
  const [_isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const cells = containerRef.current.querySelectorAll(".cell");

      cells.forEach((cell) => {
        const cellRect = cell.getBoundingClientRect();
        const cellCenterX = cellRect.left + cellRect.width / 2 - rect.left;
        const cellCenterY = cellRect.top + cellRect.height / 2 - rect.top;

        const distance = Math.sqrt(
          Math.pow(x - cellCenterX, 2) + Math.pow(y - cellCenterY, 2)
        );

        const maxDistance = 100;
        const opacity = Math.max(0, 1 - distance / maxDistance);

        if (opacity > 0) {
          cell.classList.add("active");
          (cell as HTMLElement).style.opacity = String(opacity * 0.5);
        } else {
          cell.classList.remove("active");
          (cell as HTMLElement).style.opacity = "0";
        }
      });
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "absolute inset-0 -z-10 overflow-hidden",
        containerClassName
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        className={cn(
          "absolute inset-0 bg-grid-primary/[0.02] [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]",
          patternClassName
        )}
      >
        {Array.from({ length: 20 }).map((_, y) =>
          Array.from({ length: 20 }).map((_, x) => (
            <div
              key={`${x}-${y}`}
              className={cn(
                "cell absolute h-8 w-8 rounded-full bg-primary/20 opacity-0 transition-opacity duration-300",
                className
              )}
              style={{
                left: `${x * 10 - 5}%`,
                top: `${y * 10 - 5}%`,
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
