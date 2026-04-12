import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CreateDooModal } from "./CreateDooModal";

export function DashboardHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between border-b border-border/50 pb-6">
        <div>
          <h1 className="text-4xl font-semibold text-text tracking-tight">Overview</h1>
          <p className="text-text/50 font-medium mt-2">Manage your active orchestrations and resources.</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="gap-2 bg-brand text-white hover:bg-brand/90 transition-colors shadow-sm font-medium"
        >
          <Plus size={18} />
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

