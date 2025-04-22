// flash-bingo-ui/src/app/mil-bingo/module/[moduleId]/[bingoCardId]/page.tsx

import { notFound } from "next/navigation";
import BingoCard from "@/components/bingo-card";
import { getBingoCardByIndex } from "@/services/bingo";

type PageProps = {
  params: {
    moduleId: string;
    bingoCardId: string;
  };
};

export default async function BingoCardPage(props: PageProps) {
  const { moduleId, bingoCardId } = props.params;

  const cardId = Number(bingoCardId);
  if (isNaN(cardId)) return notFound();

  const card = await getCardData(moduleId, cardId);
  if (!card || !card.keywords || card.keywords.length !== 16) return notFound();

  return (
    <div className="min-h-screen bg-[#fcefd4] flex items-center justify-center px-4 py-8">
      <BingoCard bingoCardId={cardId} keywords={card.keywords} />
    </div>
  );
}
//gameplay: GET bingo card by index
async function getCardData(moduleId: string, index: number) {
  try {
    return await getBingoCardByIndex(moduleId, index);
  } catch {
    return null;
  }
}
