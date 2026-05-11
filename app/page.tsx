import Hero from "@/components/home/Hero";
import CollectionsStrip from "@/components/home/CollectionsStrip";
import BrandStatement from "@/components/home/BrandStatement";
import FeaturedCollection from "@/components/home/FeaturedCollection";
import JournalTeaser from "@/components/home/JournalTeaser";
import EnquiryCTA from "@/components/home/EnquiryCTA";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <CollectionsStrip />
      <BrandStatement />
      <FeaturedCollection />
      <JournalTeaser />
      <EnquiryCTA />
    </div>
  );
}
