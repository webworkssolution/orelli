import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import FadeUp from "@/components/ui/FadeUp";
import { prisma } from "@/lib/prisma";

export async function generateStaticParams() {
  const blogs = await prisma.blog.findMany({
    select: { slug: true },
  });
  return blogs.map((blog) => ({ slug: blog.slug }));
}

const components = {
  p: (props: React.ComponentPropsWithoutRef<"p">) => (
    <p className="font-sans text-[16px] text-[#333] leading-[1.9] mb-6" {...props} />
  ),
  h2: (props: React.ComponentPropsWithoutRef<"h2">) => (
    <h2 className="font-cormorant text-[28px] text-foreground mt-10 mb-4" {...props} />
  ),
  blockquote: (props: React.ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote className="font-cormorant italic text-[20px] text-accent border-l-2 border-accent pl-[20px] my-8" {...props} />
  ),
  img: ({ alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img alt={alt ?? ""} className="w-full rounded-[4px] my-8" {...props} />
  ),
};

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const blog = await prisma.blog.findUnique({
    where: { slug: params.slug },
  });

  if (!blog) {
    notFound();
  }

  // Get related blogs (same category, excluding current)
  const relatedBlogs = await prisma.blog.findMany({
    where: {
      published: true,
      slug: { not: blog.slug },
    },
    orderBy: { order: "asc" },
    take: 2,
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[720px] mx-auto px-6 pt-32 pb-12">
        <FadeUp>
          <div className="font-sans text-[12px] text-[#888] mb-6 uppercase tracking-widest">
            <Link href="/blogs" className="hover:text-foreground transition-colors">Blogs</Link>
            <span className="mx-2">/</span>
            <span>{blog.category}</span>
          </div>

          <h1 className="font-cormorant text-[clamp(32px,4vw,56px)] text-foreground leading-[1.2] mb-4">
            {blog.title}
          </h1>

          <div className="font-sans uppercase tracking-[0.12em] text-[11px] text-[#888] mb-6">
            {blog.date} · {blog.readTime}
          </div>

          <div className="w-full h-[1px] bg-border my-6" />

          {blog.heroImage && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={blog.heroImage}
              alt={blog.title}
              className="w-full aspect-[16/9] object-cover rounded-[4px] mb-10"
            />
          )}

          <div className="article-content">
            <MDXRemote source={blog.content || "Content coming soon."} components={components} />
          </div>
        </FadeUp>

        {relatedBlogs.length > 0 && (
          <FadeUp delay={0.2}>
            <div className="border-t border-border mt-16 pt-12">
              <h3 className="font-cormorant text-[28px] text-foreground mb-8">
                More from the Blogs
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {relatedBlogs.map((related) => (
                  <Link key={related.slug} href={`/blogs/${related.slug}`} className="block group">
                    <div className="overflow-hidden rounded-[4px] aspect-[16/9] mb-4 bg-border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={related.heroImage || "/new-drapery-1.jpeg"}
                        alt={related.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <h4 className="font-cormorant text-[20px] text-foreground group-hover:text-accent transition-colors">
                      {related.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          </FadeUp>
        )}
      </div>
    </div>
  );
}
