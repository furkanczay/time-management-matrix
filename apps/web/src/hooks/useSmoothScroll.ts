"use client";

import { useEffect } from "react";

export function useSmoothScroll() {
  useEffect(() => {
    // Function to handle anchor link clicks
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Find if the clicked element is an anchor or inside an anchor that has a hash link
      const anchor = target.closest("a");

      if (anchor && anchor.hash) {
        const hash = anchor.hash;

        // Only apply smooth scrolling to internal anchor links (not external URLs with hashes)
        if (
          anchor.origin === window.location.origin &&
          anchor.pathname === window.location.pathname
        ) {
          e.preventDefault();

          // Find the target element by its ID
          const targetElement = document.querySelector(hash);

          if (targetElement) {
            // Smooth scroll to the element
            targetElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });

            // Update URL without causing a page reload
            window.history.pushState(null, "", hash);
          }
        }
      }
    };

    // Add event listener to handle all link clicks
    document.addEventListener("click", handleAnchorClick);

    // Check if the URL already has a hash on initial load
    if (window.location.hash) {
      setTimeout(() => {
        const targetElement = document.querySelector(window.location.hash);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 0);
    }

    // Clean up event listener on unmount
    return () => {
      document.removeEventListener("click", handleAnchorClick);
    };
  }, []);
}
