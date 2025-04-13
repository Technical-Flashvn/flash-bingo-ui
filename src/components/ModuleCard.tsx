"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteModule, updateModule } from "@/services/modules";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "./ui/textarea";
import { useConfirm } from "./use-confirm";
import toast from "react-hot-toast";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface Module {
  _id: string;
  title: string;
  keywords: string[];
}

interface ModuleCardProps {
  module: Module;
  onUpdated: () => void;
  onDeleted: () => void;
}

export const ModuleCard = ({ module, onDeleted, onUpdated }: ModuleCardProps) => {
  const [editOpen, setEditOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(module.title);
  const [keywordsString, setKeywordsString] = useState(
    module.keywords.join("\n")
  );

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "This action cannot be undone"
  );

  const handleDelete = async () => {
    const confirmed = await confirm();
    if (!confirmed) return;
    try {
      await deleteModule(module._id);
      toast.success("Module deleted successfully");
      onDeleted();
    } catch (error) {
      toast.error("Error deleting module");
    }
  };

  const handleEdit = async () => {
    const trimmedTitle = newTitle.trim();
    const trimmedKeywords = keywordsString
      .split("\n")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    if (!trimmedTitle || trimmedKeywords.length === 0) {
      toast.error("Please enter valid title and keywords.");
      return;
    }

    try {
      await updateModule(module._id, trimmedTitle, trimmedKeywords);
      toast.success("Module updated successfully");
      setEditOpen(false);
      onUpdated();
    } catch (error) {
      toast.error("Error updating module");
    }
  };

  return (
    <>
      <ConfirmDialog />
      <Card className="p-4 flex items-center justify-between hover:shadow-md">
        {/* Left: title + dropdown */}
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-base text-primary">{module.title}</p>
          <Select>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="view keyword" />
            </SelectTrigger>
            <SelectContent>
              {module.keywords.map((keyword, index) => (
                <SelectItem key={index} value={keyword}>
                  {keyword}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Right: buttons */}
        <div className="flex items-center gap-2">
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Pencil className="w-4 h-4 text-blue-500" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-lg">
              <DialogHeader>
                <DialogTitle>Edit Module</DialogTitle>
              </DialogHeader>

              <div className="space-y-2">
                <Input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Module Title"
                />
                <Textarea
                  className="min-h-[120px] max-h-[200px] resize-y"
                  value={keywordsString}
                  onChange={(e) => setKeywordsString(e.target.value)}
                  placeholder="Enter one keyword per line"
                />
              </div>

              <DialogFooter className="mt-4">
                <Button onClick={handleEdit}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="ghost" size="icon" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      </Card>
    </>
  );
};
