"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuthForm from "@/components/auth-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SocialAuthButtons from "@/components/social-auth-buttons";
import Image from "next/image";

export default function AuthLayout() {
  const [active, setActive] = useState<string>("login");

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex w-full max-w-4xl shadow-lg rounded-xl overflow-hidden">
        {/* Left Side - Image/Brand */}
        <div className="hidden md:flex md:w-1/2 bg-primary relative flex-col justify-between items-center p-8">
          <div className="w-full">
            <h2 className="text-2xl font-bold text-white mb-2">
              Time Management Matrix
            </h2>
            <p className="text-primary-foreground/80">
              Organize your tasks efficiently and boost your productivity
            </p>
          </div>

          <div className="relative w-full h-64">
            <Image
              src="/time-illustration.svg"
              alt="Time Management"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div className="text-primary-foreground/80 text-sm">
            <p>
              © {new Date().getFullYear()} Time Management Matrix. All rights
              reserved.
            </p>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full md:w-1/2 p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold mb-1">
              {active === "login" ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-muted-foreground">
              {active === "login"
                ? "Enter your credentials to access your account"
                : "Register to start organizing your time efficiently"}
            </p>
          </div>

          <Card className="border-none shadow-none">
            <CardHeader className="px-0 pt-0">
              <Tabs
                defaultValue={active}
                onValueChange={(value) => setActive(value)}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <CardContent className="px-0 py-2">
                    <AuthForm mode="login" />
                    <SocialAuthButtons />
                  </CardContent>
                </TabsContent>

                <TabsContent value="signup">
                  <CardContent className="px-0 py-2">
                    <AuthForm mode="signup" />
                    <SocialAuthButtons />
                  </CardContent>
                </TabsContent>
              </Tabs>
            </CardHeader>

            <CardFooter className="px-0 pt-4 pb-0 flex justify-center">
              <p className="text-xs text-center text-muted-foreground">
                By continuing, you agree to our{" "}
                <a
                  href="#"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
