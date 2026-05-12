import Link from "next/link";
import FadeUp from "@/components/ui/FadeUp";

export default function BlogsTeaser() {
  return (
    <section className="bg-background py-24 px-6 md:px-12">
      <FadeUp>
        <h2 className="font-cormorant text-[clamp(36px,5vw,64px)] text-foreground mb-12">
          From the Blogs
        </h2>
      </FadeUp>

      <div className="flex flex-col gap-16">
        {/* Featured Article */}
        <FadeUp delay={0.1}>
          <div className="flex flex-col md:flex-row w-full gap-8 md:gap-0 items-center">
            <Link href="/blogs/color-theory" className="w-full md:w-[42%] block group overflow-hidden rounded-[4px]">
              <img
                src="https://picsum.photos/seed/blogs1/800/500"
                alt="Blog Featured"
                className="w-full aspect-[16/10] object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
            <div className="w-full md:w-[58%] md:pl-[48px]">
              <span className="font-sans uppercase tracking-[0.12em] text-[11px] text-[#888] block mb-4">
                JANUARY 2025 &middot; INTERIORS
              </span>
              <h3 className="font-cormorant text-[clamp(22px,3vw,38px)] text-foreground mb-4 leading-tight hover:text-accent transition-colors">
                <Link href="/blogs/color-theory">
                  The Psychology of Warm Tones in Modern Spaces
                </Link>
              </h3>
              <p className="font-sans text-[14px] text-[#555] mb-6 line-clamp-3 max-w-[500px]">
                Exploring how muted gold, terracotta, and soft sand can transform stark contemporary architecture into inviting, lived-in sanctuaries.
              </p>
              <Link href="/blogs/color-theory" className="text-link">
                Read More &rarr;
              </Link>
            </div>
          </div>
        </FadeUp>

        {/* Small Articles Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <FadeUp delay={0.2}>
            <Link href="/blogs/natural-dyes" className="block group">
              <div className="overflow-hidden rounded-[4px] mb-6">
                <img
                  src="https://picsum.photos/seed/blogs2/600/337"
                    alt="Blog 2"
                  className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <span className="font-sans uppercase tracking-[0.12em] text-[11px] text-[#888] block mb-3">
                DECEMBER 2024 &middot; CRAFT
              </span>
              <h4 className="font-cormorant text-[24px] text-foreground mb-4 leading-tight group-hover:text-accent transition-colors">
                Reviving Natural Dyes in Commercial Textiles
              </h4>
              <span className="text-link pointer-events-none">
                Read &rarr;
              </span>
            </Link>
          </FadeUp>

          <FadeUp delay={0.3}>
            <Link href="/blogs/studio-visit" className="block group">
              <div className="overflow-hidden rounded-[4px] mb-6">
                <img
                  src="https://picsum.photos/seed/blogs3/600/337"
                    alt="Blog 3"
                  className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <span className="font-sans uppercase tracking-[0.12em] text-[11px] text-[#888] block mb-3">
                NOVEMBER 2024 &middot; STUDIO
              </span>
              <h4 className="font-cormorant text-[24px] text-foreground mb-4 leading-tight group-hover:text-accent transition-colors">
                Behind the Scenes: The Winter Collection
              </h4>
              <span className="text-link pointer-events-none">
                Read &rarr;
              </span>
            </Link>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
