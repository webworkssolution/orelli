export const dynamic = "force-dynamic";

import { Metadata } from "next";
import Link from "next/link";
import FadeUp from "@/components/ui/FadeUp";
import CollectionCard from "@/components/categories/CollectionCard";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Categories | Orelli Bombay",
  description: "Handwoven textiles for contemporary living. Explore our upholstery, drapery, and rugs.",
};

export default async function CollectionsPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
  });

  // Build filter list dynamically from all unique tags
  const allTags = new Set<string>();
  categories.forEach((cat) => {
    try {
      const tags = JSON.parse(cat.tags) as string[];
      tags.forEach((t) => allTags.add(t));
    } catch {
      // ignore parse errors
    }
  });
  const FILTERS = ["ALL", ...Array.from(allTags)];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="pt-32 pb-8 px-6 md:px-12 border-b border-border">
        <FadeUp>
          <h1 className="font-cormorant text-[clamp(48px,6vw,80px)] text-foreground leading-none mb-4">
            Categories
          </h1>
          <p className="font-sans text-[18px] text-[#555]">
            Handwoven textiles for contemporary living.
          </p>
        </FadeUp>
      </section>

      {/* Filter Bar */}
      <div className="sticky top-[72px] z-40 bg-background border-b border-border py-4 px-6 md:px-12 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          {FILTERS.map((filter, idx) => (
            <Link
              key={filter}
              href={filter === "ALL" ? "/categories" : `/categories/${filter.toLowerCase()}`}
              className={`font-sans uppercase tracking-[0.12em] text-[13px] px-4 py-1.5 rounded-full border transition-colors ${
                idx === 0
                  ? "bg-[#E8E4DF] text-black border-[#E8E4DF]"
                  : "bg-transparent text-foreground border-border hover:border-foreground"
              }`}
            >
              {filter}
            </Link>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <section className="py-8 px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {categories.map((category, index) => {


            return (
              <FadeUp key={category.slug} delay={(index % 3) * 0.1}>
                <CollectionCard
                  title={category.title}
                  description={category.description}
                  imageSrc={category.imageSrc}
                  slug={category.slug}
                />

              </FadeUp>
            );
          })}
        </div>
      </section>
    </div>
  );
}
