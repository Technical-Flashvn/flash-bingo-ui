"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { Eye, EyeOff, TriangleAlert } from "lucide-react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignInflow } from "../auth-types";

//import { setUser } from '@/lib/storage';
import { logIn } from "@/services/auth";
import toast from "react-hot-toast";
import { useAuthStore } from "@/services/auth-store";

interface SignInCardProps {
  setstate: (state: SignInflow) => void;
}

export const SignInCard = ({ setstate }: SignInCardProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setError("");

    if (!username || !password) {
      setError("Please fill all the fields.");
      return;
    }

    //TODO: call signIn api here
    try {
      const user = await logIn(username, password);
      toast.success("Logged in successfully.");

      setUser(user);
      router.push("/dashboard");
    } catch (err: any) {
      const backendMessage =
        err?.response?.data?.message || "Login failed. Please try again.";

      setError(backendMessage);
    } finally {
      setPending(false);
    }
  };

  return (
    <Card className="w-full max-w-md p-8 mx-auto mt-10">
      <CardHeader className="pt-0 px-0 flex flex-col items-center text-center gap-4">
        <img
          src="/FLASH-logo-colorful.png"
          alt="Flash Logo"
          className="h-16 w-auto"
        />
        <CardTitle className="text-xl font-semibold text-[#1b1b62]">
          Log in to your account
        </CardTitle>
      </CardHeader>

      {error && (
        <div className="bg-destructive/15 rounded-md flex p-3 items-center gap-x-2 text-sm text-destructive mb-6">
          <TriangleAlert className="size-4" />
          <p>{error}</p>
        </div>
      )}

      <CardContent className="space-y-5 px-0 pb-0">
        <form className="space-y-2.5" onSubmit={onSubmit}>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={pending}
            type="text"
            placeholder="User name"
          />
          <div className="relative">
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={pending}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-muted-foreground"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </div>
          </div>
          <Button
            type="submit"
            className="w-full font-semibold"
            disabled={pending}
            size={"lg"}
          >
            {pending ? "Logging in ..." : "Continue"}
          </Button>
        </form>
        <Separator />

        <div className="flex flex-col gap-y-2.5">
          <p
            className="text-center text-sm underline text-blue-400 hover:text-blue-500 cursor-pointer"
            onClick={() => setstate("ForgotPassword")}
          >
            Forgot your password?
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          Don&apos;t have an account?{" "}
          <span
            className="text-sky-700 font-semibold hover:underline cursor-pointer"
            onClick={() => setstate("SignUp")}
          >
            Sign up
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
