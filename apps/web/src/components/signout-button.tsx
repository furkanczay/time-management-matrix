"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function SignoutButton() {
  const router = useRouter();
  return (
    <Button
      onClick={async () => {
        const res = await authClient.signOut();
        if (res.data?.success) {
          router.refresh();
        }
      }}
      variant={"destructive"}
    >
      Çıkış Yap
    </Button>
  );
}
