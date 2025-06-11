"use client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { Loader2, Mail, Lock, User } from "lucide-react";
import { Label } from "./ui/label";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isPending, setIsPending] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    if (mode === "login") {
      await authClient.signIn
        .email({
          email: formValues.email,
          password: formValues.password,
        })
        .then(() => {
          toast.success("Successfully signed in!");
        })
        .catch((error) => {
          toast.error(`Sign in failed: ${error.message}`);
        });
    } else {
      await authClient.signUp
        .email({
          name: formValues.name,
          email: formValues.email,
          password: formValues.password,
        })
        .then(() => {
          toast.success(
            "Account created successfully! Please check your email for verification."
          );
        })
        .catch((error) => {
          toast.error(`Account creation failed: ${error.message}`);
        });
    }
    setIsPending(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === "signup" && (
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="name"
              type="text"
              name="name"
              placeholder="Your name"
              className="pl-10"
              value={formValues.name}
              onChange={handleChange}
            />
          </div>
          {errors.name && (
            <p className="text-xs text-destructive mt-1">{errors.name}</p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="Your email"
            className="pl-10"
            value={formValues.email}
            onChange={handleChange}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-destructive mt-1">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="password">Password</Label>{" "}
          {mode === "login" && (
            <a
              href="#"
              className="text-xs text-muted-foreground hover:text-primary"
              onClick={(e) => {
                e.preventDefault();
                toast.info(
                  "Şifre sıfırlama özelliği yakında aktif olacaktır.",
                  {
                    description:
                      "Backend hazır olduğunda bu özellik kullanıma açılacaktır.",
                    duration: 5000,
                  }
                );
              }}
            >
              Forgot password?
            </a>
          )}
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            name="password"
            placeholder="Your password"
            className="pl-10"
            value={formValues.password}
            onChange={handleChange}
          />
        </div>
        {errors.password && (
          <p className="text-xs text-destructive mt-1">{errors.password}</p>
        )}
      </div>

      <Button className="w-full" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {mode === "login" ? "Signing in..." : "Creating account..."}
          </>
        ) : mode === "signup" ? (
          "Create Account"
        ) : (
          "Sign In"
        )}
      </Button>
    </form>
  );
}
