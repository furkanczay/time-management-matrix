"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import {
  HomeIcon,
  LayoutDashboardIcon,
  Loader2,
  LogInIcon,
  MenuIcon,
  Triangle,
  XIcon,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

// Define a type for navigation items
interface NavItem {
  name: string;
  link: string;
  icon?: React.ReactNode;
}

interface ModernNavbarProps {
  navItems: NavItem[];
  className?: string;
}

export const ModernNavbar = ({ navItems, className }: ModernNavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "py-3 bg-background/80 backdrop-blur-lg border-b border-border/10 shadow-sm"
          : "py-5 bg-transparent",
        className
      )}
      style={{
        boxShadow: isScrolled
          ? "0 4px 20px -2px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.06)"
          : "none",
      }}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo with animation */}{" "}
        <Link href="/" className="flex items-center gap-2 group relative">
          <div
            className={cn(
              "p-2 rounded-md bg-gradient-to-br from-primary/20 to-primary/5 transition-all duration-300 group-hover:shadow-md group-hover:from-primary/30 group-hover:to-primary/10 relative overflow-hidden",
              isScrolled ? "scale-90" : ""
            )}
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
            <HomeIcon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-300 relative z-10" />
          </div>
          <div className="overflow-hidden">
            <span
              className={cn(
                "font-bold transition-all duration-300 tracking-tight inline-block bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/90",
                isScrolled ? "text-lg" : "text-xl"
              )}
            >
              Time Matrix
              <span className="block h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-primary/80 to-primary/40 transition-all duration-300 mt-0.5"></span>
            </span>
          </div>
          <span className="absolute -inset-2 bg-primary/5 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-200 -z-10"></span>
        </Link>
        {/* Desktop Navigation with enhanced styling */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item, idx) => (
            <Link
              key={`desktop-${item.name}-${idx}`}
              href={item.link}
              className="relative group px-3 py-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                {item.icon && (
                  <div className="h-4 w-4 opacity-70 group-hover:opacity-100 group-hover:text-primary transition-colors duration-300">
                    {item.icon}
                  </div>
                )}
                <span className="relative">
                  {item.name}
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 w-0 bg-primary rounded-full group-hover:w-full transition-all duration-300 opacity-0 group-hover:opacity-100"></span>
                </span>
              </span>
            </Link>
          ))}
        </nav>
        <AuthButtons />
        {/* Mobile Menu Button with animation */}{" "}
        <motion.button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden relative w-10 h-10 flex items-center justify-center focus:outline-none bg-background/50 backdrop-blur-sm rounded-full border border-border/20 hover:border-primary/40 hover:bg-primary/5 shadow-sm hover:shadow-md transition-all duration-300"
          animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
          transition={{
            duration: 0.3,
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          aria-label="Toggle menu"
        >
          <motion.span
            animate={{
              scale: isMobileMenuOpen ? 0 : 1,
              opacity: isMobileMenuOpen ? 0 : 1,
            }}
            transition={{ duration: 0.2 }}
            className="absolute"
          >
            <MenuIcon className="h-5 w-5 text-foreground" />
          </motion.span>
          <motion.span
            animate={{
              scale: isMobileMenuOpen ? 1 : 0,
              opacity: isMobileMenuOpen ? 1 : 0,
            }}
            transition={{ duration: 0.2 }}
            className="absolute"
          >
            <XIcon className="h-5 w-5 text-foreground" />
          </motion.span>
        </motion.button>
      </div>
      {/* Enhanced Mobile Menu */}{" "}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: isMobileMenuOpen ? "auto" : 0,
          opacity: isMobileMenuOpen ? 1 : 0,
        }}
        transition={{
          duration: 0.4,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="md:hidden overflow-hidden bg-background/90 backdrop-blur-lg shadow-lg border-t border-border/10"
        style={{
          boxShadow:
            "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)",
        }}
      >
        <div className="container mx-auto px-4 py-6 flex flex-col space-y-4">
          {navItems.map((item, idx) => (
            <motion.div
              key={`mobile-${item.name}-${idx}`}
              initial={{ x: -20, opacity: 0 }}
              animate={{
                x: isMobileMenuOpen ? 0 : -20,
                opacity: isMobileMenuOpen ? 1 : 0,
              }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              {" "}
              <Link
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-primary/5 rounded-lg transition-all relative overflow-hidden group"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-out"></span>
                {item.icon && (
                  <div className="h-5 w-5 text-primary/70 group-hover:text-primary group-hover:scale-110 transition-all duration-300">
                    {item.icon}
                  </div>
                )}
                <span className="font-medium relative">
                  {item.name}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                </span>
              </Link>
            </motion.div>
          ))}{" "}
          <motion.div
            className="pt-4 border-t border-border/10 mt-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{
              y: isMobileMenuOpen ? 0 : 20,
              opacity: isMobileMenuOpen ? 1 : 0,
            }}
            transition={{ duration: 0.3, delay: navItems.length * 0.05 + 0.1 }}
          >
            <MobileAuthButtons onClose={() => setIsMobileMenuOpen(false)} />
          </motion.div>
        </div>
      </motion.div>
    </header>
  );
};

function AuthButtons() {
  const { data: session, error, isPending } = authClient.useSession();
  const isLoggedIn = !!session;
  if (error) {
    return <Triangle />;
  }

  if (isPending)
    return <Loader2 className="animate-spin h-5 w-5 text-primary" />;
  return (
    <div className="hidden md:flex items-center gap-3">
      {!isPending &&
        !error &&
        (isLoggedIn ? (
          <Button
            size="sm"
            variant="default"
            className="relative group overflow-hidden bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
            asChild
          >
            <Link href="/dashboard" className="flex items-center gap-1.5">
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary-foreground/0 via-primary-foreground/10 to-primary-foreground/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>
              <LayoutDashboardIcon className="h-4 w-4 group-hover:animate-pulse" />
              <span className="relative">
                Dashboard
                <span className="absolute -bottom-px left-0 w-full h-px bg-primary-foreground/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </span>
            </Link>
          </Button>
        ) : (
          <Button
            size="sm"
            variant="default"
            className="relative group overflow-hidden bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
            asChild
          >
            <Link href="/login" className="flex items-center gap-1.5">
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary-foreground/0 via-primary-foreground/10 to-primary-foreground/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>
              <LogInIcon className="h-4 w-4 group-hover:animate-pulse" />
              <span className="relative">
                Login
                <span className="absolute -bottom-px left-0 w-full h-px bg-primary-foreground/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </span>
            </Link>
          </Button>
        ))}
    </div>
  );
}

function MobileAuthButtons({ onClose }: { onClose: () => void }) {
  const { data: session, error, isPending } = authClient.useSession();
  const isLoggedIn = !!session;

  if (error) {
    return (
      <div className="flex justify-center items-center py-2">
        <Triangle className="text-primary" />
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="flex justify-center items-center py-2">
        <Loader2 className="animate-spin h-5 w-5 text-primary" />
      </div>
    );
  }

  return isLoggedIn ? (
    <Button
      size="default"
      variant="default"
      className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary relative group overflow-hidden shadow-md hover:shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all duration-300"
      asChild
    >
      <Link
        href="/dashboard"
        onClick={onClose}
        className="flex items-center justify-center gap-2"
      >
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary-foreground/0 via-primary-foreground/10 to-primary-foreground/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>
        <LayoutDashboardIcon className="h-4 w-4 group-hover:animate-pulse" />
        <span className="relative">Dashboard</span>
      </Link>
    </Button>
  ) : (
    <Button
      size="default"
      variant="default"
      className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary relative group overflow-hidden shadow-md hover:shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all duration-300"
      asChild
    >
      <Link
        href="/login"
        onClick={onClose}
        className="flex items-center justify-center gap-2"
      >
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary-foreground/0 via-primary-foreground/10 to-primary-foreground/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>
        <LogInIcon className="h-4 w-4 group-hover:animate-pulse" />
        <span className="relative">Login</span>
      </Link>
    </Button>
  );
}
