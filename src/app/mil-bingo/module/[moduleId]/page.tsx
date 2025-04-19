"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { BiSolidLeftArrowCircle } from "react-icons/bi";
import { CircleAlert } from "lucide-react";
import clsx from "clsx";
import LoaderCustom from "@/components/loader-custom/loader-custom";

export default function BingoEntryPage() {
  const params = useParams();
  const moduleId = params?.moduleId?.toString();

  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleKeyClick = (num: string) => {
    if (inputValue.length >= 2) return; // Giới hạn chỉ nhập 2 chữ số
    setInputValue((prev) => prev + num);
    setError("");
  };

  const handleClear = () => {
    setInputValue("");
    setError("");
  };

  const handleSubmit = () => {
    const number = parseInt(inputValue);
    if (isNaN(number) || number < 1 || number > 30) {
      setError("Chỉ chấp nhận phiếu từ 1 đến 30.");
      return;
    }

    router.push(`/mil-bingo/module/${moduleId}/${number}`);
  };

  if (loading) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-4">
        <LoaderCustom />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen justify-center px-4 bg-[#fcefd4]">
      {/* Header */}
      <div className="absolute top-4 left-4">
        <BiSolidLeftArrowCircle
          className="text-green-500 text-3xl cursor-pointer hover:text-green-600 transition"
          onClick={() => router.push("/mil-bingo/module")}
        />
      </div>

      {/* Vỏ máy nhập */}
      <div className="bg-gray-700 rounded-xl shadow-xl p-6 w-full max-w-xs flex flex-col items-center">
        {/* Logo */}
        <Image
          src="/FLASH_logo-white_yellow.png"
          alt="logo"
          width={100}
          height={100}
          style={{ height: "auto", width: "100px" }}
          priority
          className="mb-4"
        />

        {/* Dòng thông báo */}
        <div
          className={clsx(
            "font-semibold mb-1 text-sm text-center flex items-center gap-2 transition-all",
            error
              ? "bg-red-600 text-white rounded px-2 py-1"
              : "text-yellow-100 justify-center"
          )}
        >
          {error && <CircleAlert className="w-4 h-4 text-white" />}
          Nhập số phiếu (từ 1 đến 30)
        </div>

        {/* Vùng màn hình + bàn phím */}
        <div className="bg-gray-200 rounded-lg p-4 w-full flex flex-col items-center border-[3px] border-gray-400">
          {/* Màn hình hiển thị số */}
          <div className="w-50 h-10 bg-black text-yellow-300 text-2xl font-bold text-center flex items-center justify-center rounded mb-4 shadow-inner">
            {inputValue || "–"}
          </div>

          {/* Bàn phím số */}
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handleKeyClick(num.toString())}
                className="w-14 h-14 bg-gray-100 rounded-full text-xl font-bold hover:bg-yellow-300 transition"
              >
                {num}
              </button>
            ))}
            <button
              onClick={handleClear}
              className="w-14 h-14 bg-red-200 rounded-full text-lg font-semibold hover:bg-red-300 transition"
            >
              C
            </button>
            <button
              onClick={() => handleKeyClick("0")}
              className="w-14 h-14 bg-gray-100 rounded-full text-xl font-bold hover:bg-yellow-300 transition"
            >
              0
            </button>
            <button
              onClick={handleSubmit}
              className="w-14 h-14 bg-green-500 text-white rounded-full font-bold hover:bg-green-600 transition"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
