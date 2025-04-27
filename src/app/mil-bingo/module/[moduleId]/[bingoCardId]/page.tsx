import BingoCardClientWrapper from "./client-wrapper";

export default function BingoCardPage() {
  return (
    <div className="relative min-h-screen bg-[#fcefd4] flex items-center justify-center px-4 py-8">
      <img
        src="/MIL BINGO.png"
        alt="MIL BINGO"
        className="absolute top-0 left-1/2 -translate-x-1/2 h-30"
      />
      <BingoCardClientWrapper />
    </div>
  );
}
