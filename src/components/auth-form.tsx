"use client";
import { useActionState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { loginAction, registerAction } from "@/actions/auth";
import { Loader2 } from "lucide-react";

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const [state, action, isPending] = useActionState(
    mode === "login" ? loginAction : registerAction,
    { error: null }
  );
  useEffect(() => {
    if (state?.error) {
      console.log(state.error);

      toast.error(state?.error);
    }
  }, [state?.error]);
  return (
    <form action={action}>
      {mode === "signup" && (
        <Input type="text" name="name" placeholder="Your name" />
      )}
      <Input type="email" name="email" placeholder="your email" />
      <Input type="password" name="password" placeholder="your password" />
      <Button>
        {isPending ? (
          <Loader2 className="animate-spin w-4 h-4" />
        ) : mode === "signup" ? (
          "Register"
        ) : (
          "Login"
        )}
      </Button>
    </form>
  );
}
