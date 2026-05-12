import { Metadata } from "next";
import Link from "next/link";
import FadeUp from "@/components/ui/FadeUp";

export const metadata: Metadata = {
  title: "Blogs | Orelli Bombay",
  description: "Read our latest thoughts on interiors, craft, and the art of contemporary textiles.",
};

export default function JournalPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="pt-48 pb-12 px-6 md:px-12 border-b border-border">
        <FadeUp>
          <h1 className="font-cormorant text-[clamp(48px,6vw,80px)] text-foreground leading-none">
            Blogs
          </h1>
        </FadeUp>
      </section>

      {/* Featured Article */}
      <section className="py-8 px-6 md:px-12">
        <FadeUp>
          <div className="w-full bg-border rounded-[4px] p-8 md:p-12 mb-8 flex flex-col justify-center items-start">
            <span className="font-sans uppercase tracking-[0.12em] text-[11px] text-accent mb-4">
              FEATURED
            </span>
            <h2 className="font-cormorant text-[clamp(28px,3.5vw,48px)] text-foreground leading-tight mb-4 max-w-3xl hover:text-accent transition-colors">
              <Link href="/journal/color-theory">
                The Psychology of Warm Tones in Modern Spaces
              </Link>
            </h2>
            <span className="font-sans uppercase tracking-[0.12em] text-[11px] text-[#888] mb-6">
              JANUARY 2025 &middot; 8 MIN READ
            </span>
            <p className="font-sans text-[14px] text-[#555] mb-6 max-w-2xl line-clamp-3">
              Exploring how muted gold, terracotta, and soft sand can transform stark contemporary architecture into inviting, lived-in sanctuaries. We sit down with leading interior architects to discuss their approach.
            </p>
            <Link href="/journal/color-theory" className="text-link">
              Read Article &rarr;
            </Link>
          </div>
        </FadeUp>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {[
            {
              slug: "natural-dyes",
              img: "https://picsum.photos/seed/j1/600/337",
              meta: "DECEMBER 2024 · CRAFT",
              title: "Reviving Natural Dyes in Commercial Textiles",
            },
            {
              slug: "studio-visit",
              img: "https://picsum.photos/seed/j2/600/337",
              meta: "NOVEMBER 2024 · STUDIO",
              title: "Behind the Scenes: The Winter Collection",
            },
            {
              slug: "art-of-drapery",
              img: "https://picsum.photos/seed/j3/600/337",
              meta: "OCTOBER 2024 · INTERIORS",
              title: "The Subtle Art of Drapery Installation",
            },
            {
              slug: "fibers-explained",
              img: "https://picsum.photos/seed/j4/600/337",
              meta: "SEPTEMBER 2024 · EDUCATION",
              title: "Understanding Fiber Blends for Upholstery",
            },
            {
              slug: "artisan-spotlight",
              img: "https://picsum.photos/seed/j5/600/337",
              meta: "AUGUST 2024 · CRAFT",
              title: "Artisan Spotlight: The Master Weavers of Kutch",
            },
            {
              slug: "styling-cushions",
              img: "https://picsum.photos/seed/j6/600/337",
              meta: "JULY 2024 · INTERIORS",
              title: "How to Layer Textures with Cushions",
            },
          ].map((article, index) => (
            <FadeUp key={article.slug} delay={(index % 3) * 0.1}>
              <Link href={`/journal/${article.slug}`} className="block group">
                <div className="overflow-hidden rounded-[4px] aspect-[16/9] mb-4 bg-border">
                  <img
                    src={article.img}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <span className="font-sans uppercase tracking-[0.12em] text-[11px] text-[#888] block mb-2">
                  {article.meta}
                </span>
                <h3 className="font-cormorant text-[22px] text-foreground mb-3 leading-tight group-hover:text-accent transition-colors">
                  {article.title}
                </h3>
                <span className="text-link pointer-events-none">
                  Read &rarr;
                </span>
              </Link>
            </FadeUp>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 py-8">
          <span className="font-sans text-[14px] text-foreground border-b border-accent pb-1">1</span>
          <Link href="/journal?page=2" className="font-sans text-[14px] text-[#888] hover:text-foreground pb-1">2</Link>
          <Link href="/journal?page=3" className="font-sans text-[14px] text-[#888] hover:text-foreground pb-1">3</Link>
        </div>
      </section>
    </div>
  );
}
