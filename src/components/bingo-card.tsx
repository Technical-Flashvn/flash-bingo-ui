"use client";

import { useState, useMemo } from "react";
import { Check } from "lucide-react";
import clsx from "clsx";

type BingoCardViewerProps = {
  bingoCardId: number;
  keywords: string[];
};

const COLORS = ["#DE3163", "#3f99e9", "#feb622", "#e65a00"];

export default function BingoCard({ bingoCardId, keywords }: BingoCardViewerProps) {
  const [checked, setChecked] = useState<boolean[]>(Array(16).fill(false));

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

  return (
    <div
      className="w-full max-w-md rounded-sm overflow-hidden shadow-xl flex flex-col relative"
      style={{ backgroundColor: bgColor }}
    >
      {/* Header */}
      <div className="relative text-center mt-4 mb-2 px-4">
        <h1 className="text-3xl font-bold text-white">MIL BINGO</h1>
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
    </div>
  );
}
