"use client";

import { cn } from "@/lib/utils";
import React, { useState, useRef } from "react";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

export function TiltCard({ children, className }: TiltCardProps) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      // Normalize the values
      const maxRotation = 10;
      const normalizedX = (mouseY / (rect.height / 2)) * maxRotation;
      const normalizedY = -(mouseX / (rect.width / 2)) * maxRotation;

      setRotation({
        x: normalizedX,
        y: normalizedY,
      });
    }
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        "w-full h-full transition-all duration-200 transform-gpu relative overflow-hidden",
        isHovering ? "z-10" : "",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${
          rotation.y
        }deg) ${isHovering ? "scale3d(1.05, 1.05, 1.05)" : ""}`,
      }}
    >
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 transition-opacity duration-300",
          isHovering ? "opacity-100" : ""
        )}
        style={{
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        }}
      />
      {children}
    </div>
  );
}
