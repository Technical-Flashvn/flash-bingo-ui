"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { useConfirm } from "@/components/use-confirm";
import { AnimatePresence, motion } from "framer-motion";

type Question = {
  _id: string;
  title: string;
  keyword: string;
  correctAnswer: string;
  wrongAnswers: string[];
};

interface QuestionShowcaseProps {
  questions: Question[];
  onClose: () => void;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

export const QuestionShowcase = ({
  questions,
  onClose,
}: QuestionShowcaseProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [keywordsSeen, setKeywordsSeen] = useState<string[]>([]);
  const [ConfirmDialog, confirm] = useConfirm(
    "Close Presentation?",
    "You cannot review checked keywords."
  );

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    const options = shuffleArray([
      currentQuestion.correctAnswer,
      ...(currentQuestion.wrongAnswers ?? []),
    ]);
    setShuffledOptions(options);
    setShowAnswer(false);
    setKeywordsSeen((prev) =>
      prev.includes(currentQuestion.keyword)
        ? prev
        : [...prev, currentQuestion.keyword]
    );
  }, [currentIndex]);

  const getOptionLabel = (index: number) => String.fromCharCode(65 + index); // A, B, C...

  const handleClose = async () => {
    const confirmed = await confirm();
    if (confirmed) onClose();
  };

  return (
    <>
      <ConfirmDialog />
      <div className="fixed inset-0 z-50 bg-[#fcefd4] p-6 flex flex-col items-center justify-center text-center overflow-auto">
        {/* Nút đóng */}
        <button
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center border bg-red-500 hover:bg-red-700 rounded-full text-white cursor-pointer"
          onClick={handleClose}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo FLASH ở đầu, căn giữa */}
        <div className="mb-4">
          <img
            src="/FLASH-logo-colorful.png"
            alt="FLASH logo"
            className="w-30 mx-auto"
          />
        </div>

        {/* Select từ khóa đã qua */}
        {keywordsSeen.length > 0 && (
          <div className="mb-4 w-full max-w-md text-left">
            <Select>
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="View keyword" />
              </SelectTrigger>
              <SelectContent>
                {keywordsSeen.map((kw, i) => (
                  <SelectItem key={i} value={kw}>
                    {kw}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Vùng câu hỏi và lựa chọn */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion._id}
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="border-2 border-blue-400 rounded-xl p-6 w-full max-w-xl bg-white shadow-md"
          >
            <h2 className="text-xl font-semibold mb-6">
              {currentQuestion.title}
            </h2>

            <div className="flex flex-col gap-3 w-full mb-4">
              {shuffledOptions.map((opt, i) => {
                const isCorrect = opt === currentQuestion.correctAnswer;
                return (
                  <div
                    key={i}
                    className={`border px-4 py-2 rounded-lg text-left transition-all cursor-pointer ${
                      showAnswer && isCorrect
                        ? "border-green-500 font-semibold"
                        : "border-blue-200"
                    }`}
                  >
                    <strong className="mr-2">{getOptionLabel(i)}.</strong> {opt}
                  </div>
                );
              })}
            </div>

            {showAnswer && (
              <Badge className="text-md font-semibold py-2 px-4 rounded-full bg-[#3f99e9] text-white mb-4">
                {currentQuestion.keyword}
              </Badge>
            )}

            {/* Buttons */}
            <div className="flex gap-3 justify-center mt-2">
              <Button
                className="bg-green-600 text-white font-semibold hover:bg-green-700 cursor-pointer"
                onClick={() => setShowAnswer(true)}
                disabled={showAnswer}
              >
                Đáp án
              </Button>
              <Button
                variant="secondary"
                className="cursor-pointer font-semibold"
                disabled={!showAnswer || currentIndex === questions.length - 1}
                onClick={() => setCurrentIndex((prev) => prev + 1)}
              >
                Câu tiếp theo
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
};
