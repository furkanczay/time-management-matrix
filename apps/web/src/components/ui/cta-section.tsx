"use client";

import React from "react";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "./button";

interface CTASectionProps {
  title: string;
  description: string;
  primaryButtonText: string;
  primaryButtonHref: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
}

export function CTASection({
  title,
  description,
  primaryButtonText,
  primaryButtonHref,
  secondaryButtonText,
  secondaryButtonHref,
}: CTASectionProps) {
  return (
    <section className="w-full py-16 md:py-28 lg:py-36 relative overflow-hidden">
      {/* Enhanced modern gradient background with animated effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-blue-600/80 to-purple-600/80 animate-gradient"></div>

      {/* Subtle pattern overlay with enhanced visibility */}
      <div className="absolute inset-0 bg-[url('/time-illustration.svg')] bg-no-repeat bg-center opacity-15 mix-blend-soft-light"></div>

      {/* Animated particles with improved visual effect */}
      <div className="absolute inset-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/30 animate-float blur-[1px]"
            style={{
              width: `${Math.random() * 8 + 3}px`,
              height: `${Math.random() * 8 + 3}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`,
              filter: `blur(${Math.random() * 2}px)`,
            }}
          />
        ))}
      </div>

      {/* Animated geometric shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-primary/20 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute -bottom-40 -right-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s", animationDuration: "15s" }}
        ></div>
      </div>
      {/* Enhanced content container with modernized glass effect */}
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto bg-gradient-to-b from-white/15 to-white/5 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.2)] overflow-hidden">
          {/* Glass reflection effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent rounded-t-3xl transform rotate-180 blur-md"></div>
          </div>

          <div className="flex flex-col items-center justify-center space-y-8 text-center relative z-10">
            <div className="space-y-4">
              {" "}
              <h2 className="text-4xl font-bold tracking-tighter md:text-5xl/tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80 drop-shadow-md">
                {title}
              </h2>
              <p className="max-w-[800px] text-white/90 md:text-xl/relaxed lg:text-xl/relaxed xl:text-2xl/relaxed mx-auto leading-relaxed">
                {description}
              </p>
            </div>{" "}
            <div className="flex flex-col gap-4 w-full max-w-md">
              <Button
                size="lg"
                variant="secondary"
                asChild
                className="text-primary font-medium text-lg shadow-xl shadow-primary/30 hover:shadow-primary/40 hover:scale-105 transition-all duration-300 animate-pulse-shadow relative overflow-hidden group"
              >
                <Link
                  href={primaryButtonHref}
                  className="w-full flex items-center justify-center"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                  {primaryButtonText}{" "}
                  <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>

              {secondaryButtonText && secondaryButtonHref && (
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="text-white border-white/40 bg-white/10 hover:bg-white/20 transition-all duration-300 group"
                >
                  <Link
                    href={secondaryButtonHref}
                    className="w-full flex items-center justify-center"
                  >
                    {secondaryButtonText}
                  </Link>
                </Button>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
              <div className="flex -space-x-3 relative">
                {["JD", "AS", "RK", "TM", "+"].map((initials, idx) => (
                  <div
                    key={idx}
                    className="h-11 w-11 rounded-full bg-gradient-to-b from-white to-white/80 border-2 border-primary/50 shadow-lg flex items-center justify-center text-xs font-bold transform hover:scale-110 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                    style={{
                      zIndex: 5 - idx,
                      animationDelay: `${idx * 0.1}s`,
                      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    <span className="bg-clip-text text-transparent bg-gradient-to-br from-primary to-blue-700 font-bold">
                      {initials}
                    </span>
                  </div>
                ))}
                <div className="absolute -bottom-1 inset-x-0 h-2 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full blur-sm"></div>
              </div>
              <div className="text-sm sm:text-base text-white/90 font-medium ml-2 flex items-center gap-2">
                <span className="inline-flex items-center bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                  <svg
                    className="w-4 h-4 text-green-400 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="animate-pulse">Live</span>
                </span>
                Join 10,000+ users optimizing their workflow
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
