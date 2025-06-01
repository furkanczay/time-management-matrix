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
    return {
      error: (e as APIError)?.message,
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
    return {
      error: (e as APIError)?.message,
    };
  }

  redirect("/");
}
