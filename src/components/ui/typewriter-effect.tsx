"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";

export const TypewriterEffect = ({
  words,
  className,
  cursorClassName,
}: {
  words: {
    text: string;
    className?: string;
  }[];
  className?: string;
  cursorClassName?: string;
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const word = words[currentWordIndex]?.text || "";

    const timeout = setTimeout(() => {
      // If deleting
      if (isDeleting) {
        setCurrentText(word.substring(0, currentText.length - 1));
        setTypingSpeed(50); // faster when deleting

        // If all deleted, start typing next word
        if (currentText.length === 0) {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
          setTypingSpeed(150);
        }
      }
      // If typing
      else {
        setCurrentText(word.substring(0, currentText.length + 1));

        // If word is complete, prepare to delete after pause
        if (currentText.length === word.length) {
          setTypingSpeed(2000); // pause before deleting
          setTimeout(() => {
            setIsDeleting(true);
            setTypingSpeed(50);
          }, 2000);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, currentWordIndex, isDeleting, typingSpeed, words]);

  return (
    <div className={cn("flex items-center space-x-1", className)}>
      <span className="inline-block">
        {currentText}
        <span
          className={cn(
            "ml-1 inline-block h-4 w-[2px] animate-blink bg-primary",
            cursorClassName
          )}
        ></span>
      </span>
    </div>
  );
};
