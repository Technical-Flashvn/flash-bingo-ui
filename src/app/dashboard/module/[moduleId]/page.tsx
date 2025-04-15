"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { getQuestionsByModule, deleteQuestion } from "@/services/question";
import { getModuleById } from "@/services/modules";
import { AddQuestionModal } from "@/features/question/add-question-modal";
import { QuestionCard } from "@/components/QuestionCard";
//import { EditQuestionModal } from "@/features/question/edit-quest-modal";
import { useConfirm } from "@/components/use-confirm";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";

type Question = {
  _id: string;
  title: string;
  keyword: string;
  correctAnswer: string;
  wrongAnswers: string[];
};

export default function ModulePage() {
  const { moduleId } = useParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "This action cannot be undone"
  );

  const [keywords, setKeywords] = useState<string[]>([]);
  useEffect(() => {
    if (!moduleId) return;

    async function fetchQuestionsAndKeywords() {
      setLoading(true);
      try {
        const [questionData, moduleData] = await Promise.all([
          getQuestionsByModule(moduleId as string),
          getModuleById(moduleId as string),
        ]);
        setQuestions(questionData.questions ?? []);
        setKeywords(moduleData?.keywords ?? []);
        console.log("Fetched keywords:", moduleData?.module?.keywords);
      } catch (error) {
        console.error(error);
        setQuestions([]);
      }
      setLoading(false);
    }

    fetchQuestionsAndKeywords();
  }, [moduleId]);

  useEffect(() => {
    if (!moduleId) return;

    async function fetchQuestions() {
      setLoading(true);
      try {
        const data = await getQuestionsByModule(moduleId as string);
        setQuestions(data.questions ?? []);
      } catch (error) {
        console.error(error);
        setQuestions([]);
      }
      setLoading(false);
    }

    fetchQuestions();
  }, [moduleId]);

  const handleDelete = async (id: string) => {
    const confirmed = await confirm();
    if (!confirmed) return;

    try {
      await deleteQuestion(id);
      toast.success("Question deleted successfully");
      setQuestions((prev) => prev.filter((q) => q._id !== id));
    } catch (error) {
      toast.error("Failed to delete question");
    }
  };

  if (loading) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <ConfirmDialog />
      <div className="flex flex-col items-center min-h-screen p-4 w-full max-w-screen-lg mx-auto">
        <div className="w-full max-h-[600px] overflow-hidden border p-4 rounded-lg">
          <div className="overflow-y-auto max-h-[500px] scrollbar-hide">
            {questions.length === 0 ? (
              <p className="text-center text-muted-foreground mb-4">
                No questions found.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 place-items-center">
                {questions.map((q) => (
                  <QuestionCard
                    key={q._id}
                    question={{ ...q, wrongAnswers: q.wrongAnswers ?? [] }}
                    onEdit={(question) => setEditingQuestion(question)}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4">
          <AddQuestionModal
            moduleId={moduleId as string}
            keywords={keywords}
            onQuestionAdded={() =>
              getQuestionsByModule(moduleId as string).then((data) =>
                setQuestions(data.questions ?? [])
              )
            }
          />
        </div>

        {/* {editingQuestion && (
          <EditQuestionModal
            question={editingQuestion}
            moduleId={moduleId as string}
            onClose={() => setEditingQuestion(null)}
            onQuestionUpdated={() =>
              getQuestionsByModule(moduleId as string).then((data) =>
                setQuestions(data.questions ?? [])
              )
            }
          />
        )} */}
      </div>
    </>
  );
}
