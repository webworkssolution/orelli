import Link from "next/link";
import FadeUp from "@/components/ui/FadeUp";

interface BlogData {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  heroImage: string;
}

interface BlogsTeaserProps {
  blogs: BlogData[];
}

export default function BlogsTeaser({ blogs }: BlogsTeaserProps) {
  if (blogs.length === 0) return null;

  const featured = blogs[0];
  const secondary = blogs.slice(1, 3);

  return (
    <section className="bg-background py-12 px-6 md:px-12">
      <FadeUp>
        <h2 className="font-cormorant text-[clamp(36px,5vw,64px)] text-foreground mb-12">
          From the Blogs
        </h2>
      </FadeUp>

      <div className="flex flex-col gap-16">
        {/* Featured Article */}
        {featured && (
          <FadeUp delay={0.1}>
            <div className="flex flex-col md:flex-row w-full gap-8 md:gap-0 items-center">
              <Link href={`/blogs/${featured.slug}`} className="w-full md:w-[42%] block group overflow-hidden rounded-[4px]">
                <img
                  src={featured.heroImage || "/new-upholstery-1.jpeg"}
                  alt={featured.title}
                  className="w-full aspect-[16/10] object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
              <div className="w-full md:w-[58%] md:pl-[48px]">
                <span className="font-sans uppercase tracking-[0.12em] text-[11px] text-[#888] block mb-4">
                  {featured.category}
                </span>
                <h3 className="font-cormorant text-[clamp(22px,3vw,38px)] text-foreground mb-4 leading-tight hover:text-accent transition-colors">
                  <Link href={`/blogs/${featured.slug}`}>
                    {featured.title}
                  </Link>
                </h3>
                <p className="font-sans text-[14px] text-[#555] mb-6 line-clamp-3 max-w-[500px]">
                  {featured.excerpt}
                </p>
                <Link href={`/blogs/${featured.slug}`} className="text-link">
                  Read More →
                </Link>
              </div>
            </div>
          </FadeUp>
        )}

        {/* Small Articles Row */}
        {secondary.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {secondary.map((article, idx) => (
              <FadeUp key={article.slug} delay={0.2 + idx * 0.1}>
                <Link href={`/blogs/${article.slug}`} className="block group">
                  <div className="overflow-hidden rounded-[4px] mb-6">
                    <img
                      src={article.heroImage || "/new-drapery-1.jpeg"}
                      alt={article.title}
                      className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <span className="font-sans uppercase tracking-[0.12em] text-[11px] text-[#888] block mb-3">
                    {article.category}
                  </span>
                  <h4 className="font-cormorant text-[24px] text-foreground mb-4 leading-tight group-hover:text-accent transition-colors">
                    {article.title}
                  </h4>
                  <span className="text-link pointer-events-none">
                    Read →
                  </span>
                </Link>
              </FadeUp>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
