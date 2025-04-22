"use client";
//Packages
import toast from "react-hot-toast";
import { useState, useRef } from "react";
import { CheckCircleIcon, Plus, Trash2 } from "lucide-react";
//UI components
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
//API services
import { createQuestion } from "@/services/question";

interface AddQuestionModalProps {
  moduleId: string;
  keywords: string[];
  onQuestionAdded: () => void;
}

export const AddQuestionModal = ({
  moduleId,
  keywords,
  onQuestionAdded,
}: AddQuestionModalProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedKeyword, setSelectedKeyword] = useState("");
  const [renderId, setRenderId] = useState(0);

  const titleRef = useRef<HTMLInputElement | null>(null);
  const correctAnswerRef = useRef<HTMLInputElement | null>(null);
  const wrongAnswersRefs = useRef<HTMLInputElement[]>([null!]);

  const handleAddWrongAnswer = () => {
    wrongAnswersRefs.current.push(null!);
    setRenderId((prev) => prev + 1);
  };

  const handleRemoveWrongAnswer = (index: number) => {
    wrongAnswersRefs.current.splice(index, 1);
    setRenderId((prev) => prev + 1);
  };

  const handleSubmit = async () => {
    const title = titleRef.current?.value.trim();
    const correctAnswer = correctAnswerRef.current?.value.trim();
    const filteredWrongAnswers = wrongAnswersRefs.current
      .map((ref) => ref?.value.trim())
      .filter((val) => val && val !== "");

    if (
      !title ||
      !correctAnswer ||
      filteredWrongAnswers.length === 0 ||
      !selectedKeyword
    ) {
      toast.error("Please fill all fields!");
      return;
    }

    setLoading(true);
    try {
      await createQuestion(moduleId, {
        title,
        keyword: selectedKeyword,
        correctAnswer,
        wrongAnswers: filteredWrongAnswers,
      });

      toast.success("Question added successfully!");
      setOpen(false);
      titleRef.current!.value = "";
      correctAnswerRef.current!.value = "";
      wrongAnswersRefs.current = [null!]; // Reset to 1 input
      setSelectedKeyword("");
      setRenderId((prev) => prev + 1);
      onQuestionAdded();
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="font-semibold">+ Add Question</Button>
      </DialogTrigger>

      <DialogContent className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-lg">
        <DialogHeader>
          <DialogTitle>Add New Question</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Question Title */}
          <Input ref={titleRef} placeholder="Question here..." />

          {/* Select Keyword */}
          <Select value={selectedKeyword} onValueChange={setSelectedKeyword}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select keyword..." />
            </SelectTrigger>
            <SelectContent>
              {keywords.map((kw) => (
                <SelectItem key={kw} value={kw}>
                  {kw}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Correct answer */}
          <div className="relative">
            <Input
              ref={correctAnswerRef}
              placeholder="Correct answer..."
              className="border-green-500 focus:ring-green-500"
            />
            <span className="absolute top-1/2 right-3 transform -translate-y-1/2 text-green-600 text-sm">
              <CheckCircleIcon className="w-4 h-4" />
            </span>
          </div>

          {/* Wrong answers */}
          <div className="max-h-[200px] overflow-y-auto scrollbar-hide space-y-2" key={renderId}>
            {wrongAnswersRefs.current.map((_, index) => (
              <div key={index} className="relative flex items-center">
                <Input
                  ref={(el) => {
                    if (el) wrongAnswersRefs.current[index] = el;
                  }}
                  placeholder={`Wrong Answer ${index + 1}...`}
                  className="border-red-400 focus:ring-red-500"
                />
                {wrongAnswersRefs.current.length > 1 && (
                  <button
                    onClick={() => handleRemoveWrongAnswer(index)}
                    className="absolute right-3 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            className="w-full flex items-center justify-center"
            onClick={handleAddWrongAnswer}
          >
            <Plus size={16} className="mr-1" /> Add Wrong Answer
          </Button>
        </div>

        <DialogFooter className="mt-6">
          <Button
            disabled={loading}
            onClick={handleSubmit}
            className="font-semibold text-md py-2"
          >
            {loading ? "Saving..." : "Add Question"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
