import { getSession } from "@/lib/session";
import SignoutButton from "./signout-button";

export default async function Header() {
  const session = await getSession();
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1>TODO</h1>
      </div>
      {session && (
        <div className="inline-flex items-center gap-2">
          <span>{session.user.name}</span>
          <SignoutButton />
        </div>
      )}
    </div>
  );
}
