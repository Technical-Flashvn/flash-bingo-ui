// [moduleId]/[bingoCardId]/page.tsx
import BingoCardClientWrapper from "./client-wrapper";

export default function BingoCardPage() {
  return (
    <div className="min-h-screen bg-[#fcefd4] flex items-center justify-center px-4 py-8">
      <BingoCardClientWrapper />
    </div>
  );
}
