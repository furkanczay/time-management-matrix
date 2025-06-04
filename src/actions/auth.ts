"use server";

import { auth } from "@/lib/auth";
import { APIError } from "better-auth";
import { redirect } from "next/navigation";

type AuthFormState = {
  error: string | null;
};

export async function loginAction(
  prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  try {
    await auth.api.signInEmail({
      body: {
        email: email,
        password: password,
      },
    });
  } catch (e) {
    const apiError = e as APIError;
    let errorMessage = apiError?.message || "Giriş yapılırken bir hata oluştu";

    // Convert generic error messages to more specific ones
    if (
      errorMessage.toLowerCase().includes("invalid credentials") ||
      errorMessage.toLowerCase().includes("authentication failed") ||
      errorMessage.toLowerCase().includes("password")
    ) {
      errorMessage = "Geçersiz şifre. Lütfen tekrar deneyin.";
    } else if (
      errorMessage.toLowerCase().includes("not found") ||
      errorMessage.toLowerCase().includes("no user")
    ) {
      errorMessage = "Bu e-posta ile kayıtlı kullanıcı bulunamadı.";
    }

    return {
      error: errorMessage,
    };
  }
  redirect("/");
}

export async function registerAction(
  prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  try {
    await auth.api.signUpEmail({
      body: {
        email: email,
        password: password,
        name: name,
      },
    });
  } catch (e) {
    const apiError = e as APIError;
    let errorMessage = apiError?.message || "Kayıt olurken bir hata oluştu";

    // Convert generic error messages to more specific ones
    if (
      errorMessage.toLowerCase().includes("exists") ||
      errorMessage.toLowerCase().includes("already")
    ) {
      errorMessage = "Bu e-posta adresi zaten kullanılıyor.";
    } else if (errorMessage.toLowerCase().includes("password")) {
      errorMessage = "Şifre geçersiz. Daha güçlü bir şifre deneyin.";
    } else if (
      errorMessage.toLowerCase().includes("email") &&
      errorMessage.toLowerCase().includes("invalid")
    ) {
      errorMessage = "Geçersiz e-posta adresi formatı.";
    }

    return {
      error: errorMessage,
    };
  }

  redirect("/");
}
