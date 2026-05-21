import Hero from "@/components/home/Hero";
import CollectionsStrip from "@/components/home/CollectionsStrip";
import BrandStatement from "@/components/home/BrandStatement";
// import FeaturedProject from "@/components/home/FeaturedProject";
import BlogsTeaser from "@/components/home/BlogsTeaser";
import EnquiryCTA from "@/components/home/EnquiryCTA";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <CollectionsStrip />
      <BrandStatement />
      {/* <FeaturedProject /> */}
      <BlogsTeaser />
      <EnquiryCTA />
    </div>
  );
}
