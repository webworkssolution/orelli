import Link from "next/link";

interface CollectionCardProps {
  title: string;
  description: string;
  imageSrc: string;
  slug: string;
}

export default function CollectionCard({ title, description, imageSrc, slug }: CollectionCardProps) {
  return (
    <Link href={`/collections/${slug}`} className="block group">
      <div className="relative aspect-[3/4] overflow-hidden rounded-[4px] bg-border">
        {/* Image with zoom effect on hover */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-105"
          style={{ backgroundImage: `url(${imageSrc})` }}
        />
        
        {/* Dark overlay that fades in from bottom */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100 flex items-end p-6">
          <p className="font-sans text-whiteAlt text-[14px] line-clamp-1">
            {description}
          </p>
        </div>
      </div>
      
      {/* Title outside the image */}
      <h3 className="font-cormorant text-[20px] text-foreground mt-3">
        {title}
      </h3>
    </Link>
  );
}
