//flash-bingo-ui\src\app\mil-bingo\module\[moduleId]\page.tsx
"use client";

import { useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { ArrowLeft, CircleAlert, Loader2 } from "lucide-react";

export default function BingoEntryPage() {
  const params = useParams();
  const moduleId = params?.moduleId?.toString();
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit: () => void = () => {
    const value = inputRef.current?.value.trim();
    const number = parseInt(value || "", 10);

    if (isNaN(number) || number < 1 || number > 60) {
      setError("Chỉ chấp nhận phiếu từ 1 đến 60.");
      return;
    }

    setError("");
    setLoading(true);

    setTimeout(() => {
      router.push(`/mil-bingo/module/${moduleId}/${number}`);
    }, 300);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcefd4] px-4">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-sm flex flex-col items-center gap-4 border-2 border-[#1b1b62]">
        <div className="absolute top-4 left-4 ">
          <ArrowLeft
            className="w-10 h-10 border rounded-md p-2 bg-rose-500 text-white cursor-pointer hover:scale-110 transition-transform duration-200"
            onClick={() => router.back()}
          />
        </div>
        {/* Logo */}
        <img src="/FLASH-logo-colorful.png" alt="logo" className="h-20 mb-4" />

        {loading ? (
          <Loader2 className="animate-spin text-[#1b1b62] w-6 h-6 my-6" />
        ) : (
          <>
            {error ? (
              <div className="w-full text-red-600 font-bold text-sm flex items-center gap-2 px-3">
                <CircleAlert className="w-4 h-4" />
                {error}
              </div>
            ) : (
              <div className="text-sm text-gray-500 font-medium">
                Nhập số phiếu từ 1 đến 60
              </div>
            )}

            {/* Form input */}
            <div className="flex w-full gap-2">
              <input
                ref={inputRef}
                type="number"
                placeholder="1 đến 60"
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-center text-lg"
                onFocus={() => setError("")}
              />
              <button
                onClick={handleSubmit}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-semibold"
              >
                OK
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
