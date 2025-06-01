"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuthForm from "@/components/auth-form";

export default function AuthLayout() {
  const [active, setActive] = useState<string>("login");
  return (
    <Tabs defaultValue={active} onValueChange={(value) => setActive(value)}>
      <TabsList>
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="signup">SignUp</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <AuthForm mode="login" />
      </TabsContent>
      <TabsContent value="signup">
        <AuthForm mode="signup" />
      </TabsContent>
    </Tabs>
  );
}
