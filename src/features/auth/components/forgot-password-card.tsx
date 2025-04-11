'use client';

import { useRef, useState } from 'react';
import { forgotPassword } from '@/services/auth';

import { SignInflow } from '../auth-types';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface SignInCardProps {
  setstate: (state: SignInflow) => void;
}

export const ForgotPasswordCard = ({ setstate }: SignInCardProps) => {
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null); // Dùng useRef thay vì useState
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const email = emailRef.current?.value.trim(); // Lấy giá trị từ useRef

    if (!email) {
      return setError('Please enter your email!');
    }

    try {
      setPending(true);
      await forgotPassword(email);
      toast.success('Please check your email to reset your password.');
      router.push('/auth');
    } catch (error) {
      setError('Failed to send reset password email');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 mx-auto mt-10 bg-white rounded-md shadow-md">
      <h2 className="flex text-xl font-bold mb-4 justify-center">
        Forgot Password
      </h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleForgotPassword}>
        <input
          type="email"
          placeholder="Enter your email"
          ref={emailRef}
          className="border border-gray-300 rounded-md p-2 w-full mb-4"
          disabled={pending}
        />

        <button
          type="submit"
          disabled={pending}
          className="bg-blue-500 text-white px-4 py-2 rounded-md w-full hover:bg-blue-600"
        >
          {pending ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      <button
        onClick={() => setstate('SignIn')}
        className="mt-4 text-blue-500 hover:underline"
      >
        Back to Sign In
      </button>
    </div>
  );
};