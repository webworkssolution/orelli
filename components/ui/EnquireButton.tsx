"use client";

import { useModal } from "@/components/context/ModalContext";

export default function EnquireButton({ className }: { className?: string }) {
  const { openModal } = useModal();

  return (
    <button 
      onClick={openModal}
      className={className || "btn-filled w-full text-center block mb-4"}
    >
      ENQUIRE
    </button>
  );
}
