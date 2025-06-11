"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  user?: {
    name?: string | null;
  } | null;
}

export function MobileNav({ user }: MobileNavProps) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  // Links array
  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/calendar", label: "Calendar" },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <Link
          href="/"
          className="flex items-center"
          onClick={() => setOpen(false)}
        >
          <span className="text-lg font-bold">Time Matrix</span>
        </Link>
        <div className="mt-8 flex flex-col gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                "text-base font-medium transition-colors hover:text-foreground/80",
                pathname === link.href
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-4 border-t pt-4">
            {user ? (
              <>
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-sm font-medium">
                    Signed in as {user.name}
                  </span>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                  className="text-base font-medium transition-colors hover:text-foreground/80 text-foreground/60"
                >
                  Profile Settings
                </Link>
                <Link
                  href="/api/auth/signout"
                  className="mt-4 block text-base font-medium text-foreground/60 transition-colors hover:text-foreground/80"
                >
                  Sign Out
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="text-base font-medium transition-colors hover:text-foreground/80 text-foreground/60"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="mt-4 block text-base font-medium transition-colors hover:text-foreground/80 text-foreground/60"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
