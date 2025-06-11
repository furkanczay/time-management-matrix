"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Settings, User, LogOut } from "lucide-react";

interface UserNavProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function UserNav({ user }: UserNavProps) {
  const router = useRouter();

  // Get initials from name
  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleSignOut = async () => {
    const res = await authClient.signOut();
    if (res.data?.success) {
      router.refresh();
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full hover:bg-muted/50 transition-all duration-200 group"
        >
          <Avatar className="h-10 w-10 border-2 border-border/30 group-hover:border-primary/30 transition-colors shadow-sm">
            {user.image ? (
              <AvatarImage src={user.image} alt={user.name || "User"} />
            ) : null}
            <AvatarFallback className="bg-gradient-to-br from-primary/10 to-primary/5 text-primary font-semibold">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-background shadow-sm"></div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-64 border border-border/50 shadow-xl bg-card/95 backdrop-blur-xl"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="pb-3">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12 border-2 border-border/30">
              {user.image ? (
                <AvatarImage src={user.image} alt={user.name || "User"} />
              ) : null}
              <AvatarFallback className="bg-gradient-to-br from-primary/10 to-primary/5 text-primary font-semibold text-lg">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1 flex-1 min-w-0">
              <p className="text-sm font-semibold leading-none truncate">
                {user.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground truncate">
                {user.email}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <div className="h-1.5 w-1.5 bg-green-500 rounded-full"></div>
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                  Online
                </span>
              </div>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border/50" />
        <DropdownMenuItem
          onClick={() => router.push("/dashboard")}
          className="cursor-pointer hover:bg-muted/50 transition-colors group py-2.5"
        >
          <User className="mr-3 h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          <span className="font-medium">Dashboard</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push("/profile")}
          className="cursor-pointer hover:bg-muted/50 transition-colors group py-2.5"
        >
          <Settings className="mr-3 h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          <span className="font-medium">Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-border/50" />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors group py-2.5"
        >
          <LogOut className="mr-3 h-4 w-4 text-muted-foreground group-hover:text-destructive transition-colors" />
          <span className="font-medium">Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
