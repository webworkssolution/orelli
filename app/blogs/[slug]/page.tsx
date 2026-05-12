import fs from "fs";
import path from "path";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import matter from "gray-matter";
import FadeUp from "@/components/ui/FadeUp";

export async function generateStaticParams() {
  const files = fs.readdirSync(path.join(process.cwd(), "content/blogs"));
  return files.map((filename) => ({
    slug: filename.replace(".mdx", ""),
  }));
}

const components = {
  p: (props: any) => <p className="font-sans text-[16px] text-[#333] leading-[1.9] mb-6" {...props} />,
  h2: (props: any) => <h2 className="font-cormorant text-[28px] text-foreground mt-10 mb-4" {...props} />,
  blockquote: (props: any) => (
    <blockquote className="font-cormorant italic text-[20px] text-accent border-l-2 border-accent pl-[20px] my-8" {...props} />
  ),
  img: (props: any) => (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img className="w-full rounded-[4px] my-8" {...props} />
  ),
};

export default function ArticlePage({ params }: { params: { slug: string } }) {
  let frontMatter = {
    title: params.slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
    date: "JANUARY 2025",
    readTime: "8 MIN READ",
    category: "INTERIORS",
    heroImage: "https://picsum.photos/seed/articlemain/1200/675",
  };
  let content = "The content for this article has not been written yet.";

  try {
    const filePath = path.join(process.cwd(), "content/blogs", `${params.slug}.mdx`);
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data, content: mdxContent } = matter(fileContent);
    frontMatter = { ...frontMatter, ...data };
    content = mdxContent;
  } catch (e) {
    // Fallback if file doesn't exist, to keep demo working
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[720px] mx-auto px-6 pt-40 pb-24">
        <FadeUp>
          <div className="font-sans text-[12px] text-[#888] mb-6 uppercase tracking-widest">
            <Link href="/blogs" className="hover:text-foreground transition-colors">Blogs</Link>
            <span className="mx-2">/</span>
            <span>{frontMatter.category}</span>
          </div>

          <h1 className="font-cormorant text-[clamp(32px,4vw,56px)] text-foreground leading-[1.2] mb-4">
            {frontMatter.title}
          </h1>

          <div className="font-sans uppercase tracking-[0.12em] text-[11px] text-[#888] mb-6">
            {frontMatter.date} &middot; {frontMatter.readTime}
          </div>

          <div className="w-full h-[1px] bg-border my-6" />

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={frontMatter.heroImage}
            alt={frontMatter.title}
            className="w-full aspect-[16/9] object-cover rounded-[4px] mb-10"
          />

          <div className="article-content">
            <MDXRemote source={content} components={components} />
          </div>
        </FadeUp>

        <FadeUp delay={0.2}>
          <div className="border-t border-border mt-16 pt-12">
            <h3 className="font-cormorant text-[28px] text-foreground mb-8">
              More from the Blogs
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <Link href="/blogs/natural-dyes" className="block group">
                <div className="overflow-hidden rounded-[4px] aspect-[16/9] mb-4 bg-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://picsum.photos/seed/j1/600/337"
                    alt="Related 1"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h4 className="font-cormorant text-[20px] text-foreground group-hover:text-accent transition-colors">
                  Reviving Natural Dyes in Commercial Textiles
                </h4>
              </Link>
              <Link href="/blogs/studio-visit" className="block group">
                <div className="overflow-hidden rounded-[4px] aspect-[16/9] mb-4 bg-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://picsum.photos/seed/j2/600/337"
                    alt="Related 2"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h4 className="font-cormorant text-[20px] text-foreground group-hover:text-accent transition-colors">
                  Behind the Scenes: The Winter Collection
                </h4>
              </Link>
            </div>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
