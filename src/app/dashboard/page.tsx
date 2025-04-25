"use client";
//hooks
import { useQuery, useQueryClient } from "@tanstack/react-query";
//API services
import { getAllModules } from "@/services/modules";
import { useAuthStore } from "@/services/auth-store";
//Components
import { ModuleCard } from "@/components/ModuleCard";
import { AddModuleModal } from "@/features/dashboard/components/add-module-modal";

interface Module {
  _id: string;
  title: string;
  keywords: string[];
}

export default function DashboardPage() {
  const queryClient = useQueryClient();

  const user = useAuthStore((state) => state.user);
  //Dashboard: GET all modules
  const {
    data: modules = [],
    isLoading,
    refetch,
  } = useQuery<Module[]>({
    queryKey: ["modules"],
    queryFn: getAllModules,
  });

  const handleModuleAdded = () => {
    refetch();
  };

  const handleModuleDeleted = (moduleId: string) => {
    queryClient.setQueryData<Module[]>(["modules"], (oldModules = []) =>
      oldModules.filter((m) => m._id !== moduleId)
    );
  };

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-6 flex-1">
        <h2 className="text-xl font-semibold mb-4">Your Modules</h2>

        <div className="relative border rounded-lg p-4 flex flex-col max-h-[550px]">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="loader border-t-4 border-blue-500 rounded-full w-8 h-8 animate-spin"></div>
              <p className="ml-2">Loading...</p>
            </div>
          ) : ( 
            <>
              <div className="overflow-y-auto flex-1 mb-4">
                {modules.length === 0 ? (
                  <p className="text-center text-muted-foreground">
                    No modules found.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {modules.map((module) => (
                      <ModuleCard
                        key={module._id}
                        module={module}
                        onDeleted={() => handleModuleDeleted(module._id)}
                        onUpdated={refetch} // Re-fetch modules after update
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-auto flex justify-center">
                <AddModuleModal onModuleAdded={handleModuleAdded} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
