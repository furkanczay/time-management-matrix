"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";

export default function SignoutButton() {
  return (
    <Button
      onClick={async () => {
        await authClient.signOut();
      }}
      variant={"destructive"}
    >
      Çıkış Yap
    </Button>
  );
}
