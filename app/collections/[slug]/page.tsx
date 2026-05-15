import Link from "next/link";
import FadeUp from "@/components/ui/FadeUp";

const getImageUrl = (slug: string) => {
  switch(slug) {
    case 'upholstery': return '/upholstery.jpeg';
    case 'drapery': return '/drapary.jpeg';
    case 'rugs': return '/rugs.jpeg';
    case 'wallpapers': return '/wallpapers.jpeg';
    case 'outdoor': return '/outdoor.jpeg';
    default: return '/upholstery.jpeg';
  }
};

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const imageSrc = getImageUrl(params.slug);

  return (
    <div className="min-h-screen bg-background pt-[72px]">
      <div className="flex flex-col md:flex-row w-full min-h-[calc(100vh-72px)]">
        
        {/* Left: Image Gallery */}
        <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col gap-4">
          <FadeUp>
            <div className="w-full aspect-square bg-border rounded-[4px] overflow-hidden relative">
              <img
                src={imageSrc}
                alt={params.slug}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </FadeUp>
        </div>

        {/* Right: Info Panel */}
        <div className="w-full md:w-1/2 p-6 md:p-16 flex flex-col justify-center">
          <FadeUp delay={0.1}>
            <div className="font-sans text-[12px] text-[#888] mb-6">
              <Link href="/categories" className="hover:text-foreground transition-colors">Categories</Link>
              <span className="mx-2">/</span>
              <span className="text-foreground capitalize">{params.slug.replace(/-/g, " ")}</span>
            </div>

            <h1 className="font-cormorant text-[clamp(28px,3vw,44px)] text-foreground leading-tight mb-2 capitalize">
              {params.slug.replace(/-/g, " ")}
            </h1>
            
            <div className="font-sans uppercase tracking-[0.12em] text-[11px] text-[#888]">
              {params.slug.replace(/-/g, " ").toUpperCase()} · NATURAL FIBRE
            </div>

            <div className="w-full h-[1px] bg-border my-5" />

            <p className="font-sans text-[14px] text-[#555] leading-[1.8] mb-8">
              Woven on traditional looms by master artisans, this textile brings exceptional tactile richness and enduring strength. Ideal for high-use residential seating and statement pieces, it softens beautifully with age while maintaining its structured weave.
            </p>

            <Link href={`/contact?product=${params.slug}`} className="btn-filled w-full text-center block mb-4">
              ENQUIRE
            </Link>
            <p className="font-sans text-[12px] text-[#888] text-center">
              Custom orders welcome. Lead time 4–6 weeks.
            </p>
          </FadeUp>
        </div>

      </div>
    </div>
  );
}
