import { getSession } from "@/lib/session";
import { UserNav } from "./user-nav";
import Link from "next/link";
import { Button } from "./ui/button";
import NewDialog from "./todo/new-dialog";
import {
  GridIcon,
  ClockIcon,
  CalendarIcon,
  PlusIcon,
  Sparkles,
  Target,
} from "lucide-react";

export default async function Header() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-7xl">
        {/* Logo and Brand */}
        <div className="flex items-center gap-8">
          <Link
            href="/dashboard"
            className="flex items-center space-x-3 group transition-all duration-200 hover:scale-105"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/60 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative bg-gradient-to-r from-primary to-primary/80 p-2 rounded-xl shadow-sm">
                <Target className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-lg bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Time Matrix
              </span>
              <div className="text-xs text-muted-foreground font-medium">
                Priority Management
              </div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <Button
              asChild
              variant="ghost"
              className="text-sm font-medium h-9 px-4 hover:bg-muted/50 transition-all duration-200 group"
            >
              <Link href="/dashboard" className="flex items-center gap-2">
                <GridIcon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                Dashboard
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="text-sm font-medium h-9 px-4 hover:bg-muted/50 transition-all duration-200 group"
            >
              <Link href="/calendar" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                Calendar
              </Link>
            </Button>
          </nav>
        </div>{" "}
        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {session && (
            <>
              <NewDialog showTrigger={false}>
                <Button
                  size="sm"
                  className="hidden sm:flex bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-sm hover:shadow-md transition-all duration-200 group"
                >
                  <PlusIcon className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
                  New Task
                  <Sparkles className="ml-2 h-3 w-3 opacity-70" />
                </Button>
              </NewDialog>
              <div className="h-6 w-px bg-border/50"></div>
              <UserNav user={session.user} />
            </>
          )}

          {!session && (
            <div className="flex items-center gap-3">
              <Button
                asChild
                variant="ghost"
                className="text-sm font-medium hover:bg-muted/50 transition-all duration-200"
              >
                <Link href="/login">Log in</Link>
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
