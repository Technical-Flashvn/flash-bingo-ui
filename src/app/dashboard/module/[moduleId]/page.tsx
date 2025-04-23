"use client";

import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { LoaderCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

// API services
import { getModuleById } from "@/services/modules";
import { getQuestionsByModule, deleteQuestion } from "@/services/question";

// Components
import { useConfirm } from "@/components/use-confirm";
import { QuestionCard } from "@/components/QuestionCard";
import { ModuleBar } from "@/features/question/module-bar";
import { QuestionShowcase } from "@/features/question/question-showcase";
import { AddQuestionModal } from "@/features/question/add-question-modal";
import { EditQuestionModal } from "@/features/question/edit-question-modal";

type Question = {
  _id: string;
  title: string;
  keyword: string;
  correctAnswer: string;
  wrongAnswers: string[];
};

export default function ModulePage() {
  const { moduleId } = useParams() as { moduleId: string };
  const [showShowcase, setShowShowcase] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [ConfirmDialog, confirm] = useConfirm("Are you sure?", "This action cannot be undone");

  const {
    data: questionsData,
    isLoading: loadingQuestions,
    refetch: refetchQuestions,
  } = useQuery({
    queryKey: ["questions", moduleId],
    queryFn: () => getQuestionsByModule(moduleId),
    enabled: !!moduleId,
  });

  const {
    data: moduleData,
    isLoading: loadingModule,
  } = useQuery({
    queryKey: ["module", moduleId],
    queryFn: () => getModuleById(moduleId),
    enabled: !!moduleId,
  });

  const questions = questionsData?.questions ?? [];
  const keywords = moduleData?.keywords ?? [];

  const handleDelete = async (id: string) => {
    const confirmed = await confirm();
    if (!confirmed) return;

    try {
      await deleteQuestion(id);
      toast.success("Question deleted successfully");
      refetchQuestions();
    } catch (error) {
      toast.error("Failed to delete question");
    }
  };

  if (loadingQuestions || loadingModule) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <ConfirmDialog />
      <ModuleBar
        moduleId={moduleId}
        disabled={questions.length === 0}
        onStart={() => setShowShowcase(true)}
      />

      {showShowcase && (
        <QuestionShowcase
          questions={questions}
          onClose={() => setShowShowcase(false)}
        />
      )}

      <div className="flex flex-col items-center min-h-screen p-4 w-full max-w-screen-lg mx-auto">
        <div className="w-full max-h-[600px] overflow-hidden border p-4 rounded-lg">
          <div className="overflow-y-auto max-h-[500px] scrollbar-hide">
            {questions.length === 0 ? (
              <p className="text-center text-muted-foreground mb-4">
                No questions found.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 place-items-center">
                {questions.map((q: Question) => (
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
            moduleId={moduleId}
            keywords={keywords}
            onQuestionAdded={refetchQuestions}
          />
        </div>

        {editingQuestion && (
          <EditQuestionModal
            question={editingQuestion}
            moduleId={moduleId}
            keywords={keywords}
            onClose={() => setEditingQuestion(null)}
            onQuestionUpdated={refetchQuestions}
          />
        )}
      </div>
    </>
  );
}
