"use client";

import { useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { CircleAlert, Loader2 } from "lucide-react";

export default function BingoEntryPage() {
  const params = useParams();
  const moduleId = params?.moduleId?.toString();
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Thêm loading

  const handleSubmit = () => {
    const value = inputRef.current?.value.trim();
    const number = parseInt(value || "", 10);

    if (isNaN(number) || number < 1 || number > 60) {
      setError("Chỉ chấp nhận phiếu từ 1 đến 60.");
      return;
    }

    setError("");
    setLoading(true); // Hiển thị spinner

    // Delay nhỏ để spinner kịp render trước khi chuyển trang
    setTimeout(() => {
      router.push(`/mil-bingo/module/${moduleId}/${number}`);
    }, 300);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcefd4] px-4">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-sm flex flex-col items-center gap-4 border-2 border-[#1b1b62]">
        {/* Logo */}
        <Image
          src="/FLASH-logo-colorful.png"
          alt="logo"
          width={150}
          height={150}
          priority
        />

        {/* Nếu đang loading thì hiển thị spinner */}
        {loading ? (
          <Loader2 className="animate-spin text-[#1b1b62] w-6 h-6 my-6" />
        ) : (
          <>
            {/* Thông báo lỗi */}
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

            {/* Form nhập liệu */}
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
