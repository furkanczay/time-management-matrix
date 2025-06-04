import { getSession } from "@/lib/session";
import { UserNav } from "./user-nav";
import Link from "next/link";
import { Button } from "./ui/button";
import { GridIcon, ClockIcon, CalendarIcon, PlusSquare } from "lucide-react";

export default async function Header() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <ClockIcon className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">
              Time Matrix
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Button asChild variant="ghost" className="text-sm font-medium">
              <Link href="/dashboard">
                <GridIcon className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <Button asChild variant="ghost" className="text-sm font-medium">
              <Link href="/calendar">
                <CalendarIcon className="mr-2 h-4 w-4" />
                Calendar
              </Link>
            </Button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {session && (
            <>
              <Button size="sm" className="hidden sm:flex">
                <PlusSquare className="mr-1 h-4 w-4" />
                New Task
              </Button>
              <UserNav user={session.user} />
            </>
          )}

          {!session && (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
