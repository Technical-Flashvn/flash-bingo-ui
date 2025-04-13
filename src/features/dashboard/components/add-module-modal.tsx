"use client";

import { useRef, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TriangleAlert } from "lucide-react";
import toast from "react-hot-toast";

import { createModule } from "@/services/modules";

interface AddModuleModalProps {
  onModuleAdded: () => void;
}

export const AddModuleModal = ({ onModuleAdded }: AddModuleModalProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const titleRef = useRef<HTMLInputElement | null>(null);
  const keywordRef = useRef<HTMLTextAreaElement | null>(null);

  const handleAdd = async () => {
    const title = titleRef.current?.value.trim();
    const rawKeywords = keywordRef.current?.value.trim();
    setError("");

    if (!title || !rawKeywords) {
      setError("Please fill in both the title and keywords.");
      return;
    }

    const keywords = rawKeywords
      .split("\n")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    if (keywords.length === 0) {
      setError("Please provide at least one keyword.");
      return;
    }

    setLoading(true);
    try {
      await createModule(title, keywords);
      toast.success("Module created successfully!");
      if (titleRef.current) titleRef.current.value = "";
      if (keywordRef.current) keywordRef.current.value = "";
      setOpen(false);
      onModuleAdded();
    } catch (error) {
      toast.error("Failed to create module.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) setError("");
      }}
    >
      <DialogTrigger asChild>
        <Button>+ Add module</Button>
      </DialogTrigger>

      <DialogContent className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-lg">
        <DialogHeader>
          <DialogTitle>Create a new module</DialogTitle>
        </DialogHeader>

        {error && (
          <div className="bg-destructive/15 rounded-md flex p-3 items-center gap-x-2 text-sm text-destructive">
            <TriangleAlert className="size-4" />
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-4 mt-2">
          <Input
            ref={titleRef}
            placeholder="Module title (e.g., Geography, Physics...)"
          />
          <Textarea
            ref={keywordRef}
            placeholder="Enter keywords, one per line"
            className="resize-none max-h-40"
          />
        </div>

        <DialogFooter className="mt-6">
          <Button disabled={loading} onClick={handleAdd}>
            {loading ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
