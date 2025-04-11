'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { TriangleAlert, Eye, EyeOff } from 'lucide-react';

import { useState, useRef } from 'react';
import { signUp } from '@/services/auth';
import { useRouter } from 'next/navigation';
import { SignInflow } from '../auth-types';
import toast from 'react-hot-toast';

interface SignUpCardProps {
  setstate: (state: SignInflow) => void;
}

export const SignUpCard = ({ setstate }: SignUpCardProps) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    passwordRef.current?.focus();
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
    confirmPasswordRef.current?.focus();
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill all the fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email is not valid.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setPending(true);
    try {
      await signUp(username, email, password);
      toast.success('Account created successfully.');
      setstate('SignIn');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong!');
    } finally {
      setPending(false);
    }
  };

  return (
    <Card className="w-full h-full p-8 max-w-md mx-auto mt-20">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Create your new account</CardTitle>
        <CardDescription>
          Sign up to manage your flash game modules
        </CardDescription>
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
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={pending}
            required
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={pending}
            required
          />
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={pending}
              ref={passwordRef}
              required
            />
            {showPassword ? (
              <EyeOff
                className="absolute right-3 top-2 cursor-pointer"
                onClick={togglePasswordVisibility}
              />
            ) : (
              <Eye
                className="absolute right-3 top-2 cursor-pointer"
                onClick={togglePasswordVisibility}
              />
            )}
          </div>
          <div className="relative">
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={pending}
              ref={confirmPasswordRef}
              required
            />
            {showConfirmPassword ? (
              <EyeOff
                className="absolute right-3 top-2 cursor-pointer"
                onClick={toggleConfirmPasswordVisibility}
              />
            ) : (
              <Eye
                className="absolute right-3 top-2 cursor-pointer"
                onClick={toggleConfirmPasswordVisibility}
              />
            )}
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={pending}>
            Create Account
          </Button>
        </form>

        <Separator />

        <p className="text-xs text-muted-foreground">
          Already have an account?{' '}
          <span
            className="text-sky-700 hover:underline cursor-pointer"
            onClick={() => setstate('SignIn')}
          >
            Sign in
          </span>
        </p>
      </CardContent>
    </Card>
  );
};