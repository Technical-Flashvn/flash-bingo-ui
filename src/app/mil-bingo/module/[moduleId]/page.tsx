"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BiSolidLeftArrowCircle } from "react-icons/bi";
import LoaderCustom from "@/components/loader-custom/loader-custom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const LOCAL_STORAGE_KEY = "bingo_used_cards";

export default function BingoEntryPage() {
  const params = useParams();
  const moduleId = params?.moduleId?.toString();

  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [usedCards, setUsedCards] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      setUsedCards(JSON.parse(stored));
    }
    setLoading(false); // Không cần chờ API nữa
  }, []);

  const handleSubmit = () => {
    const number = parseInt(inputValue);
    if (isNaN(number) || number < 1 || number > 30) {
      alert("Vui lòng nhập số từ 1 đến 30.");
      return;
    }

    const updated = [...usedCards, number];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    setUsedCards(updated);

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
    <div className="flex flex-col items-center min-h-screen p-4 w-full max-w-2xl">
      {/* Header */}
      <div className="flex items-center w-full mb-4 sticky top-0 bg-white z-10 p-2">
        <BiSolidLeftArrowCircle
          className="text-green-500 text-3xl cursor-pointer hover:text-green-600 transition"
          onClick={() => router.push("/mil-bingo/module")}
        />
        <div className="text-1xl font-bold mx-auto">Nhập số phiếu Bingo</div>
      </div>

      {/* Nhập số phiếu */}
      <div className="flex gap-2 w-full mb-4">
        <Input
          placeholder="Nhập số từ 1 đến 30"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          type="number"
          className="flex-1"
        />
        <Button onClick={handleSubmit}>Xác nhận</Button>
      </div>
    </div>
  );
}
