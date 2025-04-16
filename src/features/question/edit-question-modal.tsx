"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircleIcon, Plus, Trash2 } from "lucide-react";
import { updateQuestion } from "@/services/question";
import toast from "react-hot-toast";

interface EditQuestionModalProps {
  question: {
    _id: string;
    title: string;
    keyword: string;
    correctAnswer: string;
    wrongAnswers: string[];
  } | null;
  moduleId: string;
  keywords: string[];
  onClose: () => void;
  onQuestionUpdated: () => void;
}

export const EditQuestionModal = ({
  moduleId,
  question,
  keywords,
  onClose,
  onQuestionUpdated,
}: EditQuestionModalProps) => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedKeyword, setSelectedKeyword] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [wrongAnswers, setWrongAnswers] = useState<string[]>([""]);

  useEffect(() => {
    if (question) {
      setTitle(question.title || "");
      setCorrectAnswer(question.correctAnswer || "");
      setWrongAnswers(question.wrongAnswers ?? [""]);
      setSelectedKeyword(question.keyword || "");
    }
  }, [question]);

  const handleAddWrongAnswer = () => {
    setWrongAnswers((prev) => [...prev, ""]);
  };

  const handleRemoveWrongAnswer = (index: number) => {
    setWrongAnswers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleWrongAnswerChange = (index: number, value: string) => {
    setWrongAnswers((prev) =>
      prev.map((ans, i) => (i === index ? value : ans))
    );
  };

  const handleSubmit = async () => {
    const trimmedTitle = title.trim();
    const trimmedCorrectAnswer = correctAnswer.trim();
    const filteredWrongAnswers = wrongAnswers
      .map((ans) => ans.trim())
      .filter((ans) => ans !== "");

    if (
      !trimmedTitle ||
      !trimmedCorrectAnswer ||
      filteredWrongAnswers.length === 0 ||
      !selectedKeyword
    ) {
      toast.error("Please fill all fields!");
      return;
    }

    setLoading(true);
    try {
      await updateQuestion(question!._id, {
        title: trimmedTitle,
        keyword: selectedKeyword,
        correctAnswer: trimmedCorrectAnswer,
        wrongAnswers: filteredWrongAnswers,
      });

      toast.success("Question updated successfully!");
      onClose();
      onQuestionUpdated();
    } catch (error) {
      toast.error("Failed to update question!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={!!question} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-lg">
        <DialogHeader>
          <DialogTitle>Edit Question</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter question..."
          />

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

          <div className="relative">
            <Input
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              placeholder="Correct answer..."
              className="border-green-500 focus:ring-green-500"
            />
            <span className="absolute top-1/2 right-3 transform -translate-y-1/2 text-green-600">
              <CheckCircleIcon className="w-4 h-4" />
            </span>
          </div>

          <div className="max-h-[200px] overflow-y-auto scrollbar-hide space-y-2">
            {wrongAnswers.map((ans, index) => (
              <div key={index} className="relative flex items-center">
                <Input
                  value={ans}
                  onChange={(e) =>
                    handleWrongAnswerChange(index, e.target.value)
                  }
                  placeholder={`Wrong answer ${index + 1}...`}
                  className="border-red-400 focus:ring-red-500"
                />
                {wrongAnswers.length > 1 && (
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
            <Plus size={16} className="mr-1 font-semibold" /> Add Wrong Answer
          </Button>
        </div>

        <DialogFooter className="mt-6">
          <Button
            disabled={loading}
            onClick={handleSubmit}
            className="font-semibold text-md py-2"
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
