export const dynamic = "force-dynamic";

import Hero from "@/components/home/Hero";
import CollectionsStrip from "@/components/home/CollectionsStrip";
import BrandStatement from "@/components/home/BrandStatement";
import FeaturedProject from "@/components/home/FeaturedProject";
import BlogsTeaser from "@/components/home/BlogsTeaser";
import EnquiryCTA from "@/components/home/EnquiryCTA";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const [heroImages, categories, blogs, projects] = await Promise.all([
    prisma.heroImage.findMany({ orderBy: { order: "asc" } }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
    prisma.blog.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      take: 3,
    }),
    prisma.project.findMany({
      where: { featured: true },
      orderBy: { order: "asc" },
      take: 2,
    }),
  ]);

  return (
    <div className="min-h-screen">
      <Hero images={heroImages.map((img) => img.src)} />
      <CollectionsStrip
        categories={categories.map((cat) => ({
          title: cat.title,
          description: cat.description,
          imageSrc: cat.imageSrc,
          slug: cat.slug,
        }))}
      />
      <BrandStatement />
      {projects.length > 0 && (
        <FeaturedProject
          projects={projects.map((p) => ({
            title: p.title,
            description: p.description,
            imageSrc: p.imageSrc,
          }))}
        />
      )}
      <BlogsTeaser
        blogs={blogs.map((b) => ({
          slug: b.slug,
          title: b.title,
          excerpt: b.excerpt,
          date: b.date,
          category: b.category,
          heroImage: b.heroImage,
        }))}
      />
      <EnquiryCTA />
    </div>
  );
}
