import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (session) {
    return redirect("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {children}
    </div>
  );
}
