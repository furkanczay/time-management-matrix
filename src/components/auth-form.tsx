"use client";
import { useActionState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { loginAction, registerAction } from "@/actions/auth";
import { Loader2, Mail, Lock, User } from "lucide-react";
import { Label } from "./ui/label";
import { useState } from "react";

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const [state, action, isPending] = useActionState(
    mode === "login" ? loginAction : registerAction,
    { error: null }
  );

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

  // Form validation
  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: "", email: "", password: "" };

    // Name validation (for signup only)
    if (mode === "signup" && !formValues.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    // Email validation
    if (!formValues.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    } // Password validation
    if (!formValues.password) {
      newErrors.password = "Şifre gerekli";
      isValid = false;
    } else if (formValues.password.length < 6) {
      newErrors.password = "Şifre en az 6 karakter olmalıdır";
      isValid = false;
    } else if (
      mode === "signup" &&
      !/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/.test(formValues.password)
    ) {
      // Only enforce strict password rules for signup
      newErrors.password =
        "Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!validateForm()) {
      e.preventDefault();

      // Show toast for password errors
      if (
        errors.password ||
        (formValues.password && formValues.password.length < 6)
      ) {
        toast.error("Şifre geçersiz", {
          description:
            "Şifreniz en az 6 karakter olmalı ve güvenlik kriterlerini karşılamalıdır.",
        });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
  useEffect(() => {
    if (state?.error) {
      // Display more user-friendly error messages for common auth issues
      if (
        state.error.toLowerCase().includes("password") ||
        state.error.toLowerCase().includes("şifre")
      ) {
        toast.error("Şifre hatalı. Lütfen tekrar deneyin.", {
          description:
            "Şifrenizi hatırlamıyorsanız şifremi unuttum seçeneğini kullanabilirsiniz.",
        });
      } else if (
        state.error.toLowerCase().includes("user") ||
        state.error.toLowerCase().includes("not found")
      ) {
        toast.error("Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı.", {
          description:
            "Lütfen e-posta adresinizi kontrol edin veya yeni hesap oluşturun.",
        });
      } else if (state.error.toLowerCase().includes("exists")) {
        toast.error("Bu e-posta adresi ile kayıtlı bir hesap zaten var.", {
          description: "Farklı bir e-posta adresi deneyin veya giriş yapın.",
        });
      } else {
        toast.error(state.error);
      }
      console.log("Auth error:", state.error);
    }
  }, [state?.error]);

  return (
    <form action={action} onSubmit={handleSubmit} className="space-y-4">
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
