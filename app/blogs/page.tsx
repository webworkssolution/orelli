export const dynamic = "force-dynamic";

import { Metadata } from "next";
import Link from "next/link";
import FadeUp from "@/components/ui/FadeUp";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Blogs | Orelli Bombay",
  description: "Read our latest thoughts on interiors, craft, and the art of contemporary textiles.",
};

export default async function BlogsPage() {
  const blogs = await prisma.blog.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });

  const featured = blogs.find((b) => b.featured) || blogs[0];
  const articles = blogs.filter((b) => b.id !== featured?.id);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="pt-32 pb-8 px-6 md:px-12 border-b border-border">
        <FadeUp>
          <h1 className="font-cormorant text-[clamp(48px,6vw,80px)] text-foreground leading-none">
            Blogs
          </h1>
        </FadeUp>
      </section>

      {/* Featured Article */}
      <section className="py-8 px-6 md:px-12">
        {featured && (
          <FadeUp>
            <div className="w-full bg-border rounded-[4px] p-8 md:p-12 mb-8 flex flex-col justify-center items-start">
              <span className="font-sans uppercase tracking-[0.12em] text-[11px] text-accent mb-4">
                FEATURED
              </span>
              <h2 className="font-cormorant text-[clamp(28px,3.5vw,48px)] text-foreground leading-tight mb-4 max-w-3xl hover:text-accent transition-colors">
                <Link href={`/blogs/${featured.slug}`}>
                  {featured.title}
                </Link>
              </h2>
              <span className="font-sans uppercase tracking-[0.12em] text-[11px] text-[#888] mb-6">
                {featured.date} · {featured.readTime}
              </span>
              <p className="font-sans text-[14px] text-[#555] mb-6 max-w-2xl line-clamp-3">
                {featured.excerpt}
              </p>
              <Link href={`/blogs/${featured.slug}`} className="text-link">
                Read Article →
              </Link>
            </div>
          </FadeUp>
        )}

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {articles.map((article, index) => (
            <FadeUp key={article.slug} delay={(index % 3) * 0.1}>
              <Link href={`/blogs/${article.slug}`} className="block group">
                <div className="overflow-hidden rounded-[4px] aspect-[16/9] mb-4 bg-border">
                  <img
                    src={article.heroImage || "/new-upholstery-1.jpeg"}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <span className="font-sans uppercase tracking-[0.12em] text-[11px] text-[#888] block mb-2">
                  {article.date} · {article.category}
                </span>
                <h3 className="font-cormorant text-[22px] text-foreground mb-3 leading-tight group-hover:text-accent transition-colors">
                  {article.title}
                </h3>
                <span className="text-link pointer-events-none">
                  Read →
                </span>
              </Link>
            </FadeUp>
          ))}
        </div>
      </section>
    </div>
  );
}
