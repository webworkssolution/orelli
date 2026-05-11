import { Metadata } from "next";
import FadeUp from "@/components/ui/FadeUp";
import CollectionCard from "@/components/collections/CollectionCard";

export const metadata: Metadata = {
  title: "Collections | Orelli Bombay",
  description: "Handwoven textiles for contemporary living. Explore our upholstery, drapery, and rugs.",
};

const FILTERS = ["ALL", "UPHOLSTERY", "DRAPERY", "RUGS", "CUSHIONS"];

const PRODUCTS = [
  {
    title: "Handwoven Upholstery",
    description: "Rich textures for structured comfort.",
    imageSrc: "https://picsum.photos/seed/coll1/600/800",
    slug: "handwoven-upholstery",
    tags: ["HANDWOVEN", "UPHOLSTERY"],
  },
  {
    title: "Sheer Drapery",
    description: "Light-filtering elegance for modern spaces.",
    imageSrc: "https://picsum.photos/seed/coll2/600/800",
    slug: "sheer-drapery",
    tags: ["NATURAL FIBRE", "DRAPERY"],
  },
  {
    title: "Artisan Rugs",
    description: "Grounding your rooms in heritage craft.",
    imageSrc: "https://picsum.photos/seed/coll3/600/800",
    slug: "artisan-rugs",
    tags: ["HERITAGE", "RUGS"],
  },
  {
    title: "Luxury Cushions",
    description: "The perfect finishing touch.",
    imageSrc: "https://picsum.photos/seed/coll4/600/800",
    slug: "luxury-cushions",
    tags: ["SILK", "CUSHIONS"],
  },
  {
    title: "The Malabar Series",
    description: "Coastal landscapes of Southern India.",
    imageSrc: "https://picsum.photos/seed/feat1/600/800",
    slug: "malabar-series",
    tags: ["COTTON", "UPHOLSTERY"],
  },
  {
    title: "Heritage Weaves",
    description: "Reviving centuries-old techniques.",
    imageSrc: "https://picsum.photos/seed/feat2/600/800",
    slug: "heritage-weaves",
    tags: ["BROCADE", "DRAPERY"],
  },
];

export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="pt-48 pb-16 px-6 md:px-12 border-b border-border">
        <FadeUp>
          <h1 className="font-cormorant text-[clamp(48px,6vw,80px)] text-foreground leading-none mb-4">
            Collections
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
            <button
              key={filter}
              className={`font-sans uppercase tracking-[0.12em] text-[11px] px-4 py-1.5 rounded-full border transition-colors ${
                idx === 0
                  ? "bg-foreground text-whiteAlt border-foreground"
                  : "bg-transparent text-foreground border-border hover:border-foreground"
              }`}
            >
              {filter}
            </button>
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
