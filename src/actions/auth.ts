"use server";

import { auth } from "@/lib/auth";
import { APIError } from "better-auth";
import { NextResponse } from "next/server";

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    await auth.api.signInEmail({
      body: {
        email: email as string,
        password: password as string,
      },
    });

    return {
      error: null,
    };
  } catch (e) {
    return {
      error: (e as APIError)?.message,
    };
  }
}

export async function registerAction(prevState: any, formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const name = formData.get("name");

  try {
    await auth.api.signUpEmail({
      body: {
        email: email as string,
        password: password as string,
        name: name as string,
      },
    });

    return {
      error: null,
    };
  } catch (e) {
    return {
      error: (e as APIError)?.message,
    };
  }
}
