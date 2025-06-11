import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, error } = await authClient.getSession();
  if (session) {
    return redirect("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {children}
    </div>
  );
}
