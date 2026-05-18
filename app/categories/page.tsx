import { Metadata } from "next";
import Link from "next/link";
import FadeUp from "@/components/ui/FadeUp";
import CollectionCard from "@/components/categories/CollectionCard";

export const metadata: Metadata = {
  title: "Categories | Orelli Bombay",
  description: "Handwoven textiles for contemporary living. Explore our upholstery, drapery, and rugs.",
};

const FILTERS = ["ALL", "UPHOLSTERY", "DRAPERY", "RUGS", "WALLPAPERS", "OUTDOOR"];

const PRODUCTS = [
  {
    title: "Upholstery",
    description: "Rich textures for structured comfort.",
    imageSrc: "/new-upholstery-1.jpeg",
    slug: "upholstery",
    tags: ["UPHOLSTERY"],
  },
  {
    title: "Drapery",
    description: "Light-filtering elegance for modern spaces.",
    imageSrc: "/new-drapery-1.jpeg",
    slug: "drapery",
    tags: ["DRAPERY"],
  },
  {
    title: "Rugs",
    description: "Grounding your rooms in heritage craft.",
    imageSrc: "/new-rugs-1.jpeg",
    slug: "rugs",
    tags: ["RUGS"],
  },
  {
    title: "Wallpapers",
    description: "The perfect finishing touch.",
    imageSrc: "/new-wallpapers-1.jpeg",
    slug: "wallpapers",
    tags: ["WALLPAPERS"],
  },
  {
    title: "Outdoor",
    description: "Bring luxury outside.",
    imageSrc: "/new-hero-2.jpeg",
    slug: "outdoor",
    tags: ["OUTDOOR"],
  },
];

export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="pt-48 pb-16 px-6 md:px-12 border-b border-border">
        <FadeUp>
          <h1 className="font-cormorant text-[clamp(48px,6vw,80px)] text-foreground leading-none mb-4">
            Categories
          </h1>
          <p className="font-sans text-[16px] text-[#555]">
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
              className={`font-sans uppercase tracking-[0.12em] text-[11px] px-4 py-1.5 rounded-full border transition-colors ${
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
      <section className="py-16 px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {PRODUCTS.map((product, index) => (
            <FadeUp key={product.slug} delay={(index % 3) * 0.1}>
              <CollectionCard {...product} />
              <div className="mt-2 flex gap-2">
                {product.tags.map((tag) => (
                  <span key={tag} className="font-sans uppercase tracking-widest text-[11px] text-[#888]">
                    {tag}
                  </span>
                ))}
              </div>
            </FadeUp>
          ))}
        </div>

        <div className="flex justify-center">
          <button className="btn-outline">Load More</button>
        </div>
      </section>
    </div>
  );
}
