import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.heroImage.deleteMany();
  await prisma.category.deleteMany();
  await prisma.project.deleteMany();
  await prisma.blog.deleteMany();

  // Seed Categories
  const categories = [
    {
      title: "Upholstery",
      slug: "upholstery",
      description: "Rich textures for structured comfort.",
      detailDescription:
        "Woven on traditional looms by master artisans, this textile brings exceptional tactile richness and enduring strength. Ideal for high-use residential seating and statement pieces, it softens beautifully with age while maintaining its structured weave.",
      imageSrc: "/new-upholstery-1.jpeg",
      tags: JSON.stringify(["UPHOLSTERY"]),
      gallery: JSON.stringify([
        "/new-upholstery-1.jpeg",
        "/new-upholstery-2.jpeg",
        "/new-upholstery-3.jpeg",
      ]),
      order: 0,
    },
    {
      title: "Drapery",
      slug: "drapery",
      description: "Light-filtering elegance for modern spaces.",
      detailDescription:
        "Our drapery fabrics combine traditional weaving techniques with contemporary aesthetics. Designed to filter light beautifully while providing privacy, these textiles transform windows into focal points of any room.",
      imageSrc: "/new-drapery-1.jpeg",
      tags: JSON.stringify(["DRAPERY"]),
      gallery: JSON.stringify(["/new-drapery-1.jpeg", "/new-drapery-2.jpeg"]),
      order: 1,
    },
    {
      title: "Rugs",
      slug: "rugs",
      description: "Grounding your rooms in heritage craft.",
      detailDescription:
        "Each rug is a testament to centuries of weaving tradition. Hand-knotted by skilled artisans, our rugs bring warmth, texture, and a sense of heritage to contemporary living spaces.",
      imageSrc: "/new-rugs-1.jpeg",
      tags: JSON.stringify(["RUGS"]),
      gallery: JSON.stringify(["/new-rugs-1.jpeg", "/new-rugs-2.jpeg"]),
      order: 2,
    },
    {
      title: "Wallpapers",
      slug: "wallpapers",
      description: "The perfect finishing touch.",
      detailDescription:
        "Our wallpaper collection draws inspiration from traditional Indian motifs reimagined for modern interiors. Each design is carefully crafted to add depth and character to your walls.",
      imageSrc: "/new-wallpapers-1.jpeg",
      tags: JSON.stringify(["WALLPAPERS"]),
      gallery: JSON.stringify([
        "/new-wallpapers-1.jpeg",
        "/new-wallpapers-2.jpeg",
      ]),
      order: 3,
    },
    {
      title: "Outdoor",
      slug: "outdoor",
      description: "Bring luxury outside.",
      detailDescription:
        "Purpose-built for outdoor living, these textiles resist weather while maintaining the luxurious hand-feel that defines Orelli. Perfect for patios, pool areas, and covered terraces.",
      imageSrc: "/new-hero-2.jpeg",
      tags: JSON.stringify(["OUTDOOR"]),
      gallery: JSON.stringify(["/new-hero-2.jpeg"]),
      order: 4,
    },
  ];

  for (const cat of categories) {
    await prisma.category.create({ data: cat });
  }
  console.log(`  ✅ Created ${categories.length} categories`);

  // Seed Projects
  const projects = [
    {
      title: "The Malabar Series",
      slug: "malabar-series",
      description:
        "Inspired by the coastal landscapes of Southern India. This collection features lightweight hand-spun cotton and raw silk blends, perfect for tropical climates.",
      imageSrc: "/new-hero-2.jpeg",
      featured: true,
      order: 0,
    },
    {
      title: "Heritage Weaves",
      slug: "heritage-weaves",
      description:
        "Reviving centuries-old weaving techniques. Heavy brocades and textured jacquards that bring a sense of history and depth to contemporary interiors.",
      imageSrc: "/new-upholstery-1.jpeg",
      featured: true,
      order: 1,
    },
  ];

  for (const proj of projects) {
    await prisma.project.create({ data: proj });
  }
  console.log(`  ✅ Created ${projects.length} projects`);

  // Seed Blogs
  const blogs = [
    {
      title: "The Psychology of Warm Tones in Modern Spaces",
      slug: "color-theory",
      excerpt:
        "Exploring how muted gold, terracotta, and soft sand can transform stark contemporary architecture into inviting, lived-in sanctuaries.",
      content: `When we design a space, the textiles are often selected last—an afterthought to the architecture and hard materials. But we believe the fabric is what actually makes a room habitable. It is the layer that directly touches the skin, the element that acoustic waves bounce against, and the surface that catches the afternoon light.

## The Return to Warmth

For the better part of the last decade, interior palettes were dominated by cool greys and stark whites. Now, we are seeing a dramatic shift back toward warmth. Terracottas, muted golds, and deep ochres are returning to living spaces, bringing with them a sense of groundedness and earthiness.

> "A warm tone isn't just a color choice; it's a physiological signal to the body to relax."

In our latest collection, we explored these tones using natural dyes derived from madder root and pomegranate rinds. The resulting textiles have a living quality to them—they subtly shift in appearance throughout the day as the sunlight changes.

Incorporating these fabrics doesn't mean overwhelming a room. A single upholstered armchair in a rich rust tone, or heavy drapery in a soft sand hue, can completely alter the emotional temperature of an otherwise minimalist concrete and glass structure.`,
      date: "JANUARY 2025",
      readTime: "8 MIN READ",
      category: "INTERIORS",
      heroImage: "/new-upholstery-1.jpeg",
      featured: true,
      published: true,
      order: 0,
    },
    {
      title: "Reviving Natural Dyes in Commercial Textiles",
      slug: "natural-dyes",
      excerpt:
        "How ancient dyeing techniques are finding new life in modern commercial textile production.",
      content:
        "The art of natural dyeing is one of humanity's oldest crafts. Long before synthetic dyes revolutionized the textile industry, artisans across India used plants, minerals, and insects to create a stunning palette of colors that have endured for millennia.",
      date: "DECEMBER 2024",
      readTime: "6 MIN READ",
      category: "CRAFT",
      heroImage: "/new-upholstery-1.jpeg",
      featured: false,
      published: true,
      order: 1,
    },
    {
      title: "Behind the Scenes: The Winter Collection",
      slug: "studio-visit",
      excerpt:
        "A look inside our studio as we prepare the winter collection launch.",
      content:
        "Every collection begins with a story. For our Winter 2024 collection, the story started with a journey to the highlands of Meghalaya, where the morning mist clings to ancient forests and the light has a quality unlike anywhere else in India.",
      date: "NOVEMBER 2024",
      readTime: "5 MIN READ",
      category: "STUDIO",
      heroImage: "/new-drapery-1.jpeg",
      featured: false,
      published: true,
      order: 2,
    },
    {
      title: "The Subtle Art of Drapery Installation",
      slug: "art-of-drapery",
      excerpt:
        "Expert tips on how to properly install drapery for maximum visual impact.",
      content:
        "The way a curtain falls can make or break a room. In this guide, we share our expertise on achieving the perfect drape every time.",
      date: "OCTOBER 2024",
      readTime: "7 MIN READ",
      category: "INTERIORS",
      heroImage: "/new-rugs-1.jpeg",
      featured: false,
      published: true,
      order: 3,
    },
    {
      title: "Understanding Fiber Blends for Upholstery",
      slug: "fibers-explained",
      excerpt:
        "A comprehensive guide to understanding different fiber blends and their suitability for upholstery.",
      content:
        "Choosing the right fabric for upholstery is about more than aesthetics. The fiber composition determines durability, comfort, and how the fabric ages over time.",
      date: "SEPTEMBER 2024",
      readTime: "10 MIN READ",
      category: "EDUCATION",
      heroImage: "/new-hero-2.jpeg",
      featured: false,
      published: true,
      order: 4,
    },
    {
      title: "Artisan Spotlight: The Master Weavers of Kutch",
      slug: "artisan-spotlight",
      excerpt:
        "Meet the artisans behind our most celebrated textiles from the Kutch region of Gujarat.",
      content:
        "In the arid landscapes of Kutch, a tradition of weaving has survived for over five centuries. We visit the master weavers who continue this extraordinary craft.",
      date: "AUGUST 2024",
      readTime: "6 MIN READ",
      category: "CRAFT",
      heroImage: "/new-wallpapers-1.jpeg",
      featured: false,
      published: true,
      order: 5,
    },
    {
      title: "How to Layer Textures with Cushions",
      slug: "styling-cushions",
      excerpt:
        "Expert interior styling tips for creating depth and warmth through textile layering.",
      content:
        "Layering textures is one of the most effective ways to add depth and visual interest to a space. In this guide, we explore how to combine different fabrics and textures through cushions.",
      date: "JULY 2024",
      readTime: "5 MIN READ",
      category: "INTERIORS",
      heroImage: "/new-upholstery-1.jpeg",
      featured: false,
      published: true,
      order: 6,
    },
  ];

  for (const blog of blogs) {
    await prisma.blog.create({ data: blog });
  }
  console.log(`  ✅ Created ${blogs.length} blogs`);

  // Seed Hero Images
  const heroImages = [
    { src: "/new-hero-1.jpeg", alt: "Hero image 1", order: 0 },
    { src: "/new-hero-2.jpeg", alt: "Hero image 2", order: 1 },
    { src: "/new-upholstery-2.jpeg", alt: "Upholstery showcase", order: 2 },
    { src: "/new-drapery-1.jpeg", alt: "Drapery showcase", order: 3 },
    { src: "/new-rugs-1.jpeg", alt: "Rugs showcase", order: 4 },
  ];

  for (const img of heroImages) {
    await prisma.heroImage.create({ data: img });
  }
  console.log(`  ✅ Created ${heroImages.length} hero images`);

  console.log("\n🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
