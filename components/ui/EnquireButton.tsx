import Link from "next/link";

export default function EnquireButton({ className }: { className?: string }) {
  return (
    <Link
      href="/enquiry"
      className={className || "btn-filled w-full text-center block mb-4"}
    >
      ENQUIRE
    </Link>
  );
}
