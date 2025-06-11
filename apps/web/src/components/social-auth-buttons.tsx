"use client";
import { Button } from "./ui/button";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { toast } from "sonner";

export default function SocialAuthButtons() {
  const handleSocialLogin = (provider: string) => {
    toast.info(`${provider} authentication will be implemented soon.`);
    // When backend is ready, we'll implement actual OAuth authentication here
    // For Google: signIn("google")
    // For GitHub: signIn("github")
  };

  return (
    <>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-muted"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          className="w-full"
          type="button"
          onClick={() => handleSocialLogin("Google")}
        >
          <FaGoogle className="mr-2 h-4 w-4" />
          Google
        </Button>
        <Button
          variant="outline"
          className="w-full"
          type="button"
          onClick={() => handleSocialLogin("GitHub")}
        >
          <FaGithub className="mr-2 h-4 w-4" />
          GitHub
        </Button>
      </div>
    </>
  );
}
