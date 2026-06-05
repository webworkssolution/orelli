import Link from "next/link";
import { notFound } from "next/navigation";
import EnquireButton from "@/components/ui/EnquireButton";
import FadeUp from "@/components/ui/FadeUp";
import { prisma } from "@/lib/prisma";
import CategoryProjects from "@/components/categories/CategoryProjects";

export async function generateStaticParams() {
  const categories = await prisma.category.findMany({
    select: { slug: true },
  });
  return categories.map((cat) => ({ slug: cat.slug }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
    include: {
      projects: {
        orderBy: { order: 'asc' }
      }
    }
  });

  if (!category) {
    notFound();
  }

  const gallery = (() => {
    try {
      return JSON.parse(category.gallery) as string[];
    } catch {
      return [category.imageSrc];
    }
  })();

  const tags = (() => {
    try {
      return JSON.parse(category.tags) as string[];
    } catch {
      return [];
    }
  })();

  return (
    <div className="min-h-screen bg-background pt-[72px]">
      <div className="flex flex-col md:flex-row w-full py-8 md:py-12 items-stretch">
        {/* Left: Image Gallery */}
        <div className="w-full md:w-1/2 px-6 md:px-12 flex flex-col gap-4">
          <FadeUp>
            <div className="w-full aspect-square md:aspect-[4/3] xl:aspect-[16/9] max-h-[550px] bg-border rounded-[4px] overflow-hidden relative">
              <img
                src={category.imageSrc}
                alt={category.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </FadeUp>

          {/* Thumbnail Gallery */}
          {gallery.length > 1 && (
            <div className="flex gap-3 overflow-x-auto">
              {gallery.map((img, idx) => (
                <div
                  key={idx}
                  className="w-20 h-20 flex-shrink-0 rounded-[4px] overflow-hidden border border-border"
                >
                  <img
                    src={img}
                    alt={`${category.title} ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info Panel */}
        <div className="w-full md:w-1/2 px-6 md:px-12 mt-8 md:mt-0 flex flex-col justify-center">
          <FadeUp delay={0.1}>
            <div className="font-sans text-[12px] text-[#888] mb-6">
              <Link
                href="/categories"
                className="hover:text-foreground transition-colors"
              >
                Categories
              </Link>
              <span className="mx-2">/</span>
              <span className="text-foreground capitalize">
                {category.title}
              </span>
            </div>

            <h1 className="font-cormorant text-[clamp(28px,3vw,44px)] text-foreground leading-tight mb-2">
              {category.title}
            </h1>

            <div className="font-sans uppercase tracking-[0.12em] text-[11px] text-[#888]">
              {tags.join(" · ")} {tags.length > 0 ? "· " : ""}NATURAL FIBRE
            </div>

            <div className="w-full h-[1px] bg-border my-5" />

            <p className="font-sans text-[14px] text-[#555] leading-[1.8] mb-8">
              {category.detailDescription || category.description}
            </p>

            <EnquireButton className="btn-filled w-full text-center block mb-4" />
            <p className="font-sans text-[12px] text-[#888] text-center">
              Custom orders welcome. Lead time 4–6 weeks.
            </p>
          </FadeUp>
        </div>
      </div>
      
      {/* Related Projects Grid & Modal */}
      <CategoryProjects projects={category.projects} />
    </div>
  );
}
