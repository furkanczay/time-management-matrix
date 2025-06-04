"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ClockIcon,
  CheckCircle2Icon,
  ZapIcon,
  BarChart3Icon,
  ArrowRightIcon,
  HomeIcon,
  InfoIcon,
  PhoneIcon,
} from "lucide-react";
import { ModernNavbar } from "@/components/ui/modern-navbar";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { BackgroundCells } from "@/components/ui/background-cells";
import { TiltCard } from "@/components/ui/tilt-card";
import { CTASection } from "@/components/ui/cta-section";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

export default function Home() {
  useSmoothScroll();
  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <HomeIcon className="h-4 w-4" />,
    },
    {
      name: "Features",
      link: "#features",
      icon: <CheckCircle2Icon className="h-4 w-4" />,
    },
    {
      name: "Screenshots",
      link: "#screenshots",
      icon: <ZapIcon className="h-4 w-4" />,
    },
    {
      name: "Contact",
      link: "/contact",
      icon: <PhoneIcon className="h-4 w-4" />,
    },
  ];

  const typewriterWords = [
    { text: "Productivity" },
    { text: "Time Management" },
    { text: "Task Organization" },
    { text: "Priority Focus" },
  ];

  return (
    <div className="flex flex-col min-h-screen relative">
      <ModernNavbar navItems={navItems} />

      {/* Enhanced Hero Section with adjusted top padding for navbar */}
      <section className="w-full pt-24 md:pt-32 pb-12 md:pb-24 lg:pb-32 xl:py-48 relative overflow-hidden">
        <BackgroundCells />
        {/* Enhanced background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-6">
              <div className="inline-block rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-sm text-primary font-medium shadow-sm backdrop-blur-sm transform hover:scale-105 transition-all duration-300 w-fit">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                  Introducing Time Matrix
                </span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                Master Your{" "}
                <span className="text-primary relative inline-block">
                  Time
                  <span className="absolute -bottom-1.5 left-0 right-0 h-1.5 bg-primary/30 rounded-full blur-sm"></span>
                </span>
                , Achieve{" "}
                <div className="inline-block">
                  <TypewriterEffect words={typewriterWords} />
                </div>
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl leading-relaxed">
                Organize your tasks based on urgency and importance. Boost
                productivity and focus on what truly matters with our powerful
                time management solution.
              </p>
              <div className="flex flex-col gap-3 min-[400px]:flex-row pt-2">
                <Button
                  size="lg"
                  className="group relative overflow-hidden rounded-xl shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90"
                  asChild
                >
                  <Link href="/login" className="flex items-center gap-2">
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                    Get Started
                    <svg
                      className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-primary/30 text-primary hover:bg-primary/5"
                >
                  <Link href="#features" className="flex items-center gap-2">
                    Learn More
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-[550px] w-full">
                {/* Enhanced App Screenshot UI */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-500 rounded-2xl shadow-2xl overflow-hidden border border-white/10 flex items-center justify-center transform hover:scale-105 hover:rotate-1 transition-all duration-700 ease-out">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>

                  {/* Fancy decorative elements */}
                  <div className="absolute top-10 left-10 w-20 h-20 bg-white/20 rounded-full blur-xl"></div>
                  <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>

                  <div className="relative z-10 bg-background/90 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-white/20 w-[90%] h-[90%] transform transition-transform duration-500 group">
                    {/* Browser-like top bar with enhanced design */}
                    <div className="flex items-center justify-between mb-6 border-b border-muted/20 pb-4">
                      <div className="flex gap-2">
                        <div className="w-3.5 h-3.5 rounded-full bg-red-500 shadow-inner"></div>
                        <div className="w-3.5 h-3.5 rounded-full bg-yellow-500 shadow-inner"></div>
                        <div className="w-3.5 h-3.5 rounded-full bg-green-500 shadow-inner"></div>
                      </div>
                      <div className="bg-muted/10 px-4 py-1.5 rounded-md text-xs font-mono text-muted-foreground border border-muted/10 flex items-center gap-2">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
                          />
                        </svg>
                        Time Matrix Dashboard
                      </div>
                    </div>

                    {/* Enhanced Matrix Mock UI with realistic details */}
                    <div className="text-center text-muted-foreground mb-5 font-medium">
                      Eisenhower Matrix View
                    </div>
                    <div className="grid grid-cols-2 gap-3 h-[75%]">
                      {/* Important & Urgent */}
                      <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                        <div className="flex justify-between items-center mb-2 pb-2 border-b border-muted/10">
                          <span className="font-medium text-sm flex items-center gap-1 text-red-500">
                            <span className="h-2 w-2 rounded-full bg-red-500"></span>
                            Important & Urgent
                          </span>
                          <span className="bg-red-500/20 text-red-500 text-xs px-2 py-0.5 rounded-full">
                            3 tasks
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="border border-muted/10 rounded bg-background/80 p-2 text-xs hover:shadow-sm transition-shadow">
                            <div className="flex justify-between">
                              <span>Client Presentation</span>
                              <span>Today</span>
                            </div>
                          </div>
                          <div className="border border-muted/10 rounded bg-background/80 p-2 text-xs hover:shadow-sm transition-shadow animate-pulse">
                            <div className="flex justify-between">
                              <span>Submit Project Proposal</span>
                              <span>2 hrs</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Important & Not Urgent */}
                      <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-3 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                        <div className="flex justify-between items-center mb-2 pb-2 border-b border-muted/10">
                          <span className="font-medium text-sm flex items-center gap-1 text-blue-500">
                            <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                            Important & Not Urgent
                          </span>
                          <span className="bg-blue-500/20 text-blue-500 text-xs px-2 py-0.5 rounded-full">
                            2 tasks
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="border border-muted/10 rounded bg-background/80 p-2 text-xs hover:shadow-sm transition-shadow">
                            <div className="flex justify-between">
                              <span>Strategic Planning</span>
                              <span>This Week</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Not Important & Urgent */}
                      <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-3 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                        <div className="flex justify-between items-center mb-2 pb-2 border-b border-muted/10">
                          <span className="font-medium text-sm flex items-center gap-1 text-yellow-500">
                            <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                            Not Important & Urgent
                          </span>
                          <span className="bg-yellow-500/20 text-yellow-500 text-xs px-2 py-0.5 rounded-full">
                            1 task
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="border border-muted/10 rounded bg-background/80 p-2 text-xs hover:shadow-sm transition-shadow">
                            <div className="flex justify-between">
                              <span>Team Meeting</span>
                              <span>3:00 PM</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Not Important & Not Urgent */}
                      <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-3 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                        <div className="flex justify-between items-center mb-2 pb-2 border-b border-muted/10">
                          <span className="font-medium text-sm flex items-center gap-1 text-green-500">
                            <span className="h-2 w-2 rounded-full bg-green-500"></span>
                            Not Important & Not Urgent
                          </span>
                          <span className="bg-green-500/20 text-green-500 text-xs px-2 py-0.5 rounded-full">
                            4 tasks
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="border border-muted/10 rounded bg-background/80 p-2 text-xs hover:shadow-sm transition-shadow">
                            <div className="flex justify-between">
                              <span>Research New Tools</span>
                              <span>Later</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section
        id="features"
        className="w-full py-12 md:py-24 lg:py-32 bg-muted/5 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-10"></div>

        {/* Enhanced background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-60 h-60 rounded-full bg-primary/5 blur-3xl"></div>
          <div className="absolute bottom-1/3 left-1/3 w-80 h-80 rounded-full bg-blue-500/5 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-20">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-3">
              <div className="inline-block rounded-full bg-gradient-to-r from-primary/20 to-blue-500/20 border border-primary/30 px-4 py-1.5 text-sm text-primary font-medium shadow-sm animate-focus">
                <span className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Features
                </span>
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500 relative inline-block">
                Everything you need to manage your time effectively
                <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 to-blue-500/50 rounded-full blur-sm"></div>
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto leading-relaxed">
                Our application is designed with the Eisenhower Matrix
                principle, helping you prioritize tasks and increase
                productivity with a beautiful, intuitive interface.
              </p>
            </div>
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mt-16">
            <TiltCard className="h-full">
              <div className="flex flex-col items-center space-y-4 rounded-xl border border-primary/20 p-6 shadow-xl bg-gradient-to-b from-background/95 to-background/80 backdrop-blur-md h-full group hover:border-primary/50 transition-all duration-300 hover:animate-border-glow">
                <div className="rounded-full border border-primary/30 p-4 bg-primary/10 shadow-inner group-hover:bg-primary/20 transition-colors duration-300 relative">
                  <div className="absolute inset-0 rounded-full bg-primary/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <ClockIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground/90 group-hover:text-primary transition-colors duration-300">
                  Time Matrix
                </h3>
                <p className="text-sm text-muted-foreground text-center leading-relaxed">
                  Visualize your tasks in four quadrants based on urgency and
                  importance for optimal time management.
                </p>
                <div className="mt-4 h-1 w-0 bg-primary/50 rounded-full group-hover:w-16 transition-all duration-500"></div>
              </div>
            </TiltCard>

            <TiltCard className="h-full">
              <div className="flex flex-col items-center space-y-4 rounded-xl border border-blue-500/20 p-6 shadow-xl bg-gradient-to-b from-background/95 to-background/80 backdrop-blur-md h-full group hover:border-blue-500/50 transition-all duration-300 hover:animate-border-glow">
                <div className="rounded-full border border-blue-500/30 p-4 bg-blue-500/10 shadow-inner group-hover:bg-blue-500/20 transition-colors duration-300 relative">
                  <div className="absolute inset-0 rounded-full bg-blue-500/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <CheckCircle2Icon className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-foreground/90 group-hover:text-blue-500 transition-colors duration-300">
                  Task Management
                </h3>
                <p className="text-sm text-muted-foreground text-center leading-relaxed">
                  Create, organize, and track tasks with ease. Add subtasks for
                  complex projects and set deadlines.
                </p>
                <div className="mt-4 h-1 w-0 bg-blue-500/50 rounded-full group-hover:w-16 transition-all duration-500"></div>
              </div>
            </TiltCard>

            <TiltCard className="h-full">
              <div className="flex flex-col items-center space-y-4 rounded-xl border border-purple-500/20 p-6 shadow-xl bg-gradient-to-b from-background/95 to-background/80 backdrop-blur-md h-full group hover:border-purple-500/50 transition-all duration-300 hover:animate-border-glow">
                <div className="rounded-full border border-purple-500/30 p-4 bg-purple-500/10 shadow-inner group-hover:bg-purple-500/20 transition-colors duration-300 relative">
                  <div className="absolute inset-0 rounded-full bg-purple-500/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <ZapIcon className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="text-xl font-bold text-foreground/90 group-hover:text-purple-500 transition-colors duration-300">
                  Quick Actions
                </h3>
                <p className="text-sm text-muted-foreground text-center leading-relaxed">
                  Drag and drop tasks between categories to quickly update
                  priorities and reorganize your workflow.
                </p>
                <div className="mt-4 h-1 w-0 bg-purple-500/50 rounded-full group-hover:w-16 transition-all duration-500"></div>
              </div>
            </TiltCard>

            <TiltCard className="h-full">
              <div className="flex flex-col items-center space-y-4 rounded-xl border border-green-500/20 p-6 shadow-xl bg-gradient-to-b from-background/95 to-background/80 backdrop-blur-md h-full group hover:border-green-500/50 transition-all duration-300 hover:animate-border-glow">
                <div className="rounded-full border border-green-500/30 p-4 bg-green-500/10 shadow-inner group-hover:bg-green-500/20 transition-colors duration-300 relative">
                  <div className="absolute inset-0 rounded-full bg-green-500/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <BarChart3Icon className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-foreground/90 group-hover:text-green-500 transition-colors duration-300">
                  Progress Tracking
                </h3>
                <p className="text-sm text-muted-foreground text-center leading-relaxed">
                  Monitor your productivity and track progress over time with
                  visual analytics and insightful reports.
                </p>
                <div className="mt-4 h-1 w-0 bg-green-500/50 rounded-full group-hover:w-16 transition-all duration-500"></div>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* App Showcase */}
      <section
        id="screenshots"
        className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-transparent to-muted/30"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
            <div className="inline-block rounded-lg bg-primary/20 border border-primary/30 px-3 py-1 text-sm text-primary mb-2">
              Screenshots
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-purple-500">
              See the app in action
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Explore how Time Matrix helps you organize tasks and boost
              productivity.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Screenshot 1 */}
            <div className="rounded-xl border bg-background/80 backdrop-blur-sm shadow-xl overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
              <div className="aspect-[16/9] overflow-hidden rounded-t-xl relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-blue-500/20 group-hover:opacity-70 transition-opacity duration-300"></div>
                <div className="h-full w-full bg-muted flex items-center justify-center relative">
                  <div className="absolute top-0 left-0 right-0 h-8 bg-background/90 flex items-center px-4">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-xs ml-2 text-muted-foreground">
                      Dashboard.tsx
                    </div>
                  </div>
                  <p className="text-muted-foreground">Dashboard Screenshot</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg">Task Dashboard</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Get a complete overview of all your tasks in a beautifully
                  designed interface that makes prioritization intuitive.
                </p>
                <div className="flex items-center mt-4">
                  <div className="h-1 w-1/3 bg-primary rounded-full"></div>
                  <div className="h-1 w-1/3 bg-blue-500 rounded-full"></div>
                  <div className="h-1 w-1/3 bg-purple-500 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Screenshot 2 */}
            <div className="rounded-xl border bg-background/80 backdrop-blur-sm shadow-xl overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
              <div className="aspect-[16/9] overflow-hidden rounded-t-xl relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 group-hover:opacity-70 transition-opacity duration-300"></div>
                <div className="h-full w-full bg-muted flex items-center justify-center relative">
                  <div className="absolute top-0 left-0 right-0 h-8 bg-background/90 flex items-center px-4">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-xs ml-2 text-muted-foreground">
                      TaskManagement.tsx
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    Task Management Screenshot
                  </p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg">Task Management</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Create, edit, and organize tasks with our intuitive controls.
                  Add subtasks, deadlines, and priority levels.
                </p>
                <div className="flex items-center mt-4">
                  <div className="h-1 w-1/3 bg-blue-500 rounded-full"></div>
                  <div className="h-1 w-1/3 bg-purple-500 rounded-full"></div>
                  <div className="h-1 w-1/3 bg-primary rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Screenshot 3 */}
            <div className="rounded-xl border bg-background/80 backdrop-blur-sm shadow-xl overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
              <div className="aspect-[16/9] overflow-hidden rounded-t-xl relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-primary/20 group-hover:opacity-70 transition-opacity duration-300"></div>
                <div className="h-full w-full bg-muted flex items-center justify-center relative">
                  <div className="absolute top-0 left-0 right-0 h-8 bg-background/90 flex items-center px-4">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-xs ml-2 text-muted-foreground">
                      TimeMatrix.tsx
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    Time Matrix View Screenshot
                  </p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg">Time Matrix View</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Visualize and prioritize tasks in a 2×2 grid based on the
                  Eisenhower Matrix principle for maximum productivity.
                </p>
                <div className="flex items-center mt-4">
                  <div className="h-1 w-1/3 bg-purple-500 rounded-full"></div>
                  <div className="h-1 w-1/3 bg-primary rounded-full"></div>
                  <div className="h-1 w-1/3 bg-blue-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section className="w-full py-12 md:py-24 lg:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent"></div>

        {/* Enhanced background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl opacity-70"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl opacity-70"></div>
        </div>

        {/* Curved shape divider */}
        <div className="absolute top-0 inset-x-0 h-16">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            className="absolute w-full h-full"
          >
            <path
              fill="currentColor"
              fillOpacity="0.05"
              d="M0,32L60,58.7C120,85,240,139,360,138.7C480,139,600,85,720,74.7C840,64,960,96,1080,112C1200,128,1320,128,1380,128L1440,128L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
            ></path>
          </svg>
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="inline-block rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 border border-primary/30 px-4 py-1.5 text-sm text-primary mb-2 font-medium shadow-sm">
              <span className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.243 4.757c-5.152-5.152-13.334-5.152-18.486 0-5.151 5.152-5.151 13.334 0 18.486 5.152 5.151 13.334 5.151 18.486 0 5.151-5.152 5.151-13.334 0-18.486zm-2.828 15.657c-3.541 3.541-9.29 3.541-12.83 0-3.541-3.541-3.541-9.29 0-12.83 3.54-3.541 9.289-3.541 12.83 0 3.54 3.54 3.54 9.289 0 12.83zm-3.465-10.607c-.828-.828-2.167-.828-2.995 0-.835.835-.835 2.167 0 3.003.828.828 2.167.828 2.995 0 .835-.836.835-2.168 0-3.003zm-6 6c-.828-.828-2.167-.828-2.995 0-.835.835-.835 2.167 0 3.003.828.828 2.167.828 2.995 0 .835-.836.835-2.168 0-3.003z"></path>
                </svg>
                Testimonials
              </span>
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 relative inline-block">
              What our users say
              <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 to-purple-500/50 rounded-full blur-sm"></div>
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed leading-relaxed">
              Don't just take our word for it. See how Time Matrix has
              transformed productivity for our users and helped them achieve
              more.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-16">
            {/* First testimonial with enhanced styling */}
            <div className="rounded-2xl border-2 border-primary/20 bg-gradient-to-b from-background to-background/80 backdrop-blur-md p-8 shadow-xl relative group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 hover:border-primary/40">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mt-10 -mr-10 blur-3xl group-hover:bg-primary/20 transition-all duration-500 animate-pulse"></div>

              {/* Quote icon with enhanced styling */}
              <div className="absolute top-4 right-4">
                <svg
                  className="h-10 w-10 text-primary/10 group-hover:text-primary/20 transition-colors duration-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              {/* User profile with enhanced styling */}
              <div className="flex items-center space-x-4">
                <div className="h-14 w-14 rounded-full ring-2 ring-primary/30 ring-offset-2 ring-offset-background bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center shadow-lg border border-white/20 group-hover:scale-110 transition-transform duration-300">
                  <span className="font-medium text-white text-base">JD</span>
                </div>
                <div>
                  <p className="font-bold text-lg">John Doe</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground flex items-center">
                      <svg
                        className="w-4 h-4 mr-1 text-primary/70"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                          clipRule="evenodd"
                        />
                        <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                      </svg>
                      Product Manager
                    </p>
                  </div>
                </div>
              </div>

              {/* Rating stars with animation */}
              <div className="mt-6 space-y-4">
                <div className="flex">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-yellow-500 group-hover:scale-110 transition-transform duration-300"
                        style={{ transitionDelay: `${i * 50}ms` }}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                </div>

                {/* Testimonial text with enhanced styling */}
                <blockquote className="text-muted-foreground italic relative text-base leading-relaxed">
                  <span className="text-4xl absolute -top-3 -left-2 text-primary/20 font-serif">
                    "
                  </span>
                  Time Matrix has completely changed how I prioritize tasks. I'm
                  now much more focused on what truly matters and my team's
                  productivity has increased by 37%.
                  <span className="text-4xl absolute -bottom-6 -right-2 text-primary/20 font-serif">
                    "
                  </span>
                </blockquote>

                {/* Date of testimonial */}
                <div className="pt-4 mt-4 border-t border-muted/20">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    May 12, 2025
                  </span>
                </div>
              </div>
            </div>

            {/* Second testimonial with enhanced styling */}
            <div className="rounded-2xl border-2 border-blue-500/20 bg-gradient-to-b from-background to-background/80 backdrop-blur-md p-8 shadow-xl relative group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 hover:border-blue-500/40">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mt-10 -mr-10 blur-3xl group-hover:bg-blue-500/20 transition-all duration-500 animate-pulse"></div>

              {/* Quote icon with enhanced styling */}
              <div className="absolute top-4 right-4">
                <svg
                  className="h-10 w-10 text-blue-500/10 group-hover:text-blue-500/20 transition-colors duration-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              {/* User profile with enhanced styling */}
              <div className="flex items-center space-x-4">
                <div className="h-14 w-14 rounded-full ring-2 ring-blue-500/30 ring-offset-2 ring-offset-background bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg border border-white/20 group-hover:scale-110 transition-transform duration-300">
                  <span className="font-medium text-white text-base">JS</span>
                </div>
                <div>
                  <p className="font-bold text-lg">Jane Smith</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground flex items-center">
                      <svg
                        className="w-4 h-4 mr-1 text-blue-500/70"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1.581.814l-4.419-2.3-4.419 2.3A1 1 0 014 16V4zm2-1h8a1 1 0 011 1v10.879L11.12 12.88a1 1 0 00-.939 0L6 14.879V4a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Entrepreneur
                    </p>
                  </div>
                </div>
              </div>

              {/* Rating stars with animation */}
              <div className="mt-6 space-y-4">
                <div className="flex">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-yellow-500 group-hover:scale-110 transition-transform duration-300"
                        style={{ transitionDelay: `${i * 50}ms` }}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                </div>

                {/* Testimonial text with enhanced styling */}
                <blockquote className="text-muted-foreground italic relative text-base leading-relaxed">
                  <span className="text-4xl absolute -top-3 -left-2 text-blue-500/20 font-serif">
                    "
                  </span>
                  The visual matrix makes it so easy to see where I should focus
                  my energy. My productivity has improved dramatically and I've
                  reclaimed about 10 hours each week.
                  <span className="text-4xl absolute -bottom-6 -right-2 text-blue-500/20 font-serif">
                    "
                  </span>
                </blockquote>

                {/* Date of testimonial */}
                <div className="pt-4 mt-4 border-t border-muted/20">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    April 28, 2025
                  </span>
                </div>
              </div>
            </div>

            {/* Third testimonial with enhanced styling */}
            <div className="rounded-2xl border-2 border-purple-500/20 bg-gradient-to-b from-background to-background/80 backdrop-blur-md p-8 shadow-xl relative group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 hover:border-purple-500/40">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full -mt-10 -mr-10 blur-3xl group-hover:bg-purple-500/20 transition-all duration-500 animate-pulse"></div>

              {/* Quote icon with enhanced styling */}
              <div className="absolute top-4 right-4">
                <svg
                  className="h-10 w-10 text-purple-500/10 group-hover:text-purple-500/20 transition-colors duration-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              {/* User profile with enhanced styling */}
              <div className="flex items-center space-x-4">
                <div className="h-14 w-14 rounded-full ring-2 ring-purple-500/30 ring-offset-2 ring-offset-background bg-gradient-to-br from-purple-500 to-primary flex items-center justify-center shadow-lg border border-white/20 group-hover:scale-110 transition-transform duration-300">
                  <span className="font-medium text-white text-base">RJ</span>
                </div>
                <div>
                  <p className="font-bold text-lg">Robert Johnson</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground flex items-center">
                      <svg
                        className="w-4 h-4 mr-1 text-purple-500/70"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Developer
                    </p>
                  </div>
                </div>
              </div>

              {/* Rating stars with animation */}
              <div className="mt-6 space-y-4">
                <div className="flex">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-yellow-500 group-hover:scale-110 transition-transform duration-300"
                        style={{ transitionDelay: `${i * 50}ms` }}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                </div>

                {/* Testimonial text with enhanced styling */}
                <blockquote className="text-muted-foreground italic relative text-base leading-relaxed">
                  <span className="text-4xl absolute -top-3 -left-2 text-purple-500/20 font-serif">
                    "
                  </span>
                  I love how I can quickly reorganize tasks as priorities shift.
                  The drag-and-drop interface is intuitive and efficient.
                  Perfect for our agile development workflow.
                  <span className="text-4xl absolute -bottom-6 -right-2 text-purple-500/20 font-serif">
                    "
                  </span>
                </blockquote>

                {/* Date of testimonial */}
                <div className="pt-4 mt-4 border-t border-muted/20">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    May 5, 2025
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action - Using our new component */}
      <CTASection
        title="Ready to take control of your time?"
        description="Join thousands of users who are already mastering their productivity with Time Matrix."
        primaryButtonText="Get Started Now"
        primaryButtonHref="/login"
        secondaryButtonText="Learn More"
        secondaryButtonHref="#features"
      />

      {/* Footer */}
      <footer className="w-full py-12 md:py-16 bg-background border-t relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:14px_14px]"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-primary/10 rounded-full">
                  <ClockIcon className="h-6 w-6 text-primary" />
                </div>
                <span className="font-bold text-xl">Time Matrix</span>
              </div>
              <p className="text-sm text-muted-foreground">
                A powerful time management tool based on the Eisenhower Matrix
                principle to help you prioritize tasks and boost productivity.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-base">Product</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/features"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/roadmap"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Roadmap
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-base">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-base">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/privacy"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cookies"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 Time Matrix. All rights reserved.
            </p>

            <div className="flex items-center space-x-4">
              <Link
                href="https://twitter.com"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </Link>
              <Link
                href="https://github.com"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </Link>
              <Link
                href="https://linkedin.com"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
