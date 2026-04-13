import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CreateDooModal } from "./CreateDooModal";

export function DashboardHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="h-11 border-b border-border flex items-center justify-between px-5 bg-bg sticky top-0 z-10 shrink-0">
        <h1 className="text-[13px] font-semibold text-text">Overview</h1>
        <Button onClick={() => setIsModalOpen(true)} size="sm" className="gap-1.5">
          <Plus size={13} />
          New Doo
        </Button>
      </header>

      <CreateDooModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
