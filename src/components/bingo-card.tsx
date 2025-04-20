"use client";

import { useMemo, useState, useEffect } from "react";
import { Check } from "lucide-react";
import toast from "react-hot-toast";
import clsx from "clsx";

type BingoCardViewerProps = {
  bingoCardId: number;
  keywords: string[];
};

const COLORS = ["#DE3163", "#3f99e9", "#feb622", "#e65a00"];

export default function BingoCard({
  bingoCardId,
  keywords,
}: BingoCardViewerProps) {
  const [checked, setChecked] = useState<boolean[]>(Array(16).fill(false));
  const [isWinner, setIsWinner] = useState(false);
  const [showMedal, setShowMedal] = useState(false);
  const [showMedalMini, setShowMedalMini] = useState(false);

  const bgColor = useMemo(() => {
    const index = bingoCardId % COLORS.length;
    return COLORS[index];
  }, [bingoCardId]);

  const handleToggle = (index: number) => {
    setChecked((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  useEffect(() => {
    if (!isWinner && checkWinner(checked)) {
      setIsWinner(true);
      toast.success("Here is the Winner!");
      setShowMedal(true);
    }
  }, [checked, isWinner]);

  const checkWinner = (grid: boolean[]) => {
    const rows = [
      [0, 1, 2, 3],
      [4, 5, 6, 7],
      [8, 9, 10, 11],
      [12, 13, 14, 15],
    ];
    const cols = [
      [0, 4, 8, 12],
      [1, 5, 9, 13],
      [2, 6, 10, 14],
      [3, 7, 11, 15],
    ];
    const diags = [
      [0, 5, 10, 15],
      [3, 6, 9, 12],
    ];
    return [...rows, ...cols, ...diags].some((line) =>
      line.every((i) => grid[i])
    );
  };

  return (
    <div
      className="w-full max-w-md rounded-sm overflow-hidden shadow-xl flex flex-col relative"
      style={{ backgroundColor: bgColor }}
    >
      {/* Header */}
      <div className="relative text-center mt-4 mb-2 px-4">
        <h1 className="text-3xl font-bold text-white">MIL BINGO</h1>

        {showMedalMini && (
          <img
            src="/medal.png"
            alt="Medal"
            className="w-10 h-10 absolute top-0 right-2"
          />
        )}
      </div>

      {/* Bingo Grid */}
      <div className="px-4 mb-4 grow" style={{ backgroundColor: bgColor }}>
        <div className="grid grid-cols-4 gap-[1px] bg-black">
          {keywords.map((kw, i) => (
            <div
              key={i}
              className={clsx(
                "relative flex items-center justify-center text-center text-[13px] font-semibold bg-white text-black aspect-square cursor-pointer select-none leading-tight px-1 py-1",
                {
                  "bg-opacity-60": checked[i],
                  "text-gray-600": checked[i],
                }
              )}
              onClick={() => handleToggle(i)}
            >
              {kw}
              {checked[i] && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Check className="w-15 h-15 text-green-600 opacity-70" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center text-xs text-white bg-transparent px-4 py-1">
        <span>#{bingoCardId}</span>
        <span>flashvn.org</span>
      </div>

      {/* Medal Button */}
      {showMedal && (
        <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
          <button
            onClick={() => {
              setShowMedal(false);
              setShowMedalMini(true);
            }}
            className="pointer-events-auto rounded-full bg-yellow-400 p-5 animate-pulse shadow-lg hover:scale-105 transition-transform duration-200"
          >
            <img
              src="/medal.png"
              alt="Medal"
              className="w-30 h-30 object-contain"
            />
          </button>
        </div>
      )}
    </div>
  );
}
