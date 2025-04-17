"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  CirclePlay,
  Printer,
  FileCheck,
  LoaderCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { getModuleById } from "@/services/modules";
import clsx from "clsx";

interface ModuleBarProps {
  moduleId: string;
  disabled?: boolean;
  onStart?: () => void;
}

type PrintStatus = "idle" | "loading" | "done";

export const ModuleBar = ({ moduleId, disabled, onStart }: ModuleBarProps) => {
  const router = useRouter();
  const [moduleTitle, setModuleTitle] = useState<string>("...");
  const [printStatus, setPrintStatus] = useState<PrintStatus>("idle");

  useEffect(() => {
    async function fetchModule() {
      try {
        const data = await getModuleById(moduleId);
        setModuleTitle(data?.title || "Module");
      } catch (error) {
        toast.error("Failed to load module");
      }
    }

    fetchModule();
  }, [moduleId]);

  const handlePrint = async () => {
    setPrintStatus("loading");
    setTimeout(() => {
      setPrintStatus("done");
      setTimeout(() => setPrintStatus("idle"), 2000);
    }, 2000);
  };

  return (
    <div className="w-full border-b px-4 py-3 flex items-center justify-between bg-white sticky top-0 z-30">
      {/* Left side */}
      <div className="flex items-center gap-3 w-1/2 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/dashboard")}
          className="border border-muted p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <p className="text-sm text-muted-foreground truncate ml-1">
          <span className="font-semibold text-foreground">{moduleTitle}</span>{" "}
          module
        </p>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 shrink-0">
        <Button
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold"
          onClick={onStart}
          disabled={disabled}
        >
          <CirclePlay className="w-5 h-5 mr-2" />
          Start
        </Button>

        <Button
          onClick={handlePrint}
          className={clsx(
            "text-white font-semibold",
            printStatus === "idle" && "bg-blue-500 hover:bg-blue-600",
            printStatus === "done" && "bg-green-500 hover:bg-green-600",
            printStatus === "loading" && "bg-yellow-500 cursor-not-allowed"
          )}
          disabled={printStatus === "loading" || disabled}
        >
          {printStatus === "idle" && (
            <>
              <Printer className="w-5 h-5 mr-2" />
              Print
            </>
          )}
          {printStatus === "loading" && (
            <>
              <LoaderCircle className="w-5 h-5 mr-2 animate-spin" />
              Loading
            </>
          )}
          {printStatus === "done" && (
            <>
              <FileCheck className="w-5 h-5 mr-2" />
              Printed
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
