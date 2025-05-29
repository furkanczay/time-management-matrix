import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";

export default function Header({
  name,
  isAuth,
}: {
  name: string;
  isAuth: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1>TODO</h1>
      </div>
      {isAuth && (
        <div className="inline-flex items-center gap-2">
          <span>{name}</span>
          <Button
            onClick={async () => {
              await authClient.signOut();
            }}
            variant={"destructive"}
          >
            Çıkış Yap
          </Button>
        </div>
      )}
    </div>
  );
}
