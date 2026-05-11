import FadeUp from "@/components/ui/FadeUp";
import CollectionCard from "@/components/collections/CollectionCard";

const COLLECTIONS = [
  {
    title: "Handwoven Upholstery",
    description: "Rich textures for structured comfort.",
    imageSrc: "https://picsum.photos/seed/coll1/600/800",
    slug: "handwoven-upholstery",
  },
  {
    title: "Sheer Drapery",
    description: "Light-filtering elegance for modern spaces.",
    imageSrc: "https://picsum.photos/seed/coll2/600/800",
    slug: "sheer-drapery",
  },
  {
    title: "Artisan Rugs",
    description: "Grounding your rooms in heritage craft.",
    imageSrc: "https://picsum.photos/seed/coll3/600/800",
    slug: "artisan-rugs",
  },
  {
    title: "Luxury Cushions",
    description: "The perfect finishing touch.",
    imageSrc: "https://picsum.photos/seed/coll4/600/800",
    slug: "luxury-cushions",
  },
];

export default function CollectionsStrip() {
  return (
    <section className="bg-background py-24 px-6 md:px-12">
      <FadeUp>
        <h2 className="font-cormorant text-[clamp(36px,5vw,64px)] text-foreground mb-12">
          Our Collections
        </h2>
      </FadeUp>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {COLLECTIONS.map((collection, index) => (
          <FadeUp key={collection.slug} delay={index * 0.1}>
            <CollectionCard {...collection} />
          </FadeUp>
        ))}
      </div>
    </section>
  );
}
