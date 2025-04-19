"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BiSolidLeftArrowCircle } from "react-icons/bi";
import { getAllModules } from "@/services/modules";
import { generateBingoCards } from "@/services/bingo";
import { Loader2 } from "lucide-react";
import LoaderCustom from "@/components/loader-custom/loader-custom";

type Module = {
  _id: string;
  title: string;
};

export default function ModulePage() {
  const router = useRouter();
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingModule, setLoadingModule] = useState<string | null>(null);

  useEffect(() => {
    async function fetchModules() {
      try {
        setLoading(true);
        const data = await getAllModules();
        setModules(data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách modules:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchModules();
  }, []);

  const handleSelectModule = async (moduleId: string) => {
    setLoadingModule(moduleId);
    try {
      await generateBingoCards(moduleId); // 👈 gọi tạo phiếu trước
      router.push(`/mil-bingo/module/${moduleId}`);
    } catch (error) {
      console.error("Không thể tạo phiếu bingo:", error);
      alert("Không thể tạo phiếu bingo. Vui lòng thử lại.");
      setLoadingModule(null);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-4">
        <LoaderCustom />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-4 w-full max-w-2xl">
      {/* Header */}
      <div className="flex items-center w-full mb-4 sticky top-0 bg-white z-10 p-2">
        <BiSolidLeftArrowCircle
          className="text-green-500 text-3xl cursor-pointer hover:text-green-600 transition"
          onClick={() => router.push("/")}
        />
        <div className="text-1xl font-bold mx-auto">Chọn Module</div>
      </div>

      {modules.length === 0 ? (
        <div className="text-center text-gray-500">Không có module nào!</div>
      ) : (
        <div className="w-full overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto p-2 scrollbar-hide">
            {modules.map((mod) => (
              <button
                key={mod._id}
                className="bg-white border border-gray-300 p-4 rounded-lg text-lg font-semibold 
                text-center shadow-md hover:shadow-lg transition cursor-pointer hover:bg-gray-100 relative"
                onClick={() => handleSelectModule(mod._id)}
                disabled={loadingModule === mod._id}
              >
                {loadingModule === mod._id ? (
                  <Loader2 className="animate-spin text-muted-foreground mx-auto" />
                ) : (
                  mod.title
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
